/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2018 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {Component, ComponentType} from 'react';
import {get, isEmpty, isEqual, isString, isObject, memoize, identity} from 'lodash';
import {connect} from 'react-redux';
import {Input} from '@vtb/fe-ui-input';
import {Select} from '@vtb/fe-ui-select';
import {compareFieldsRecursive} from './../../../utils/form-fields-compare';
import {StoreType} from './../../../store/root-selector';
import {getLoadingState} from '../dictionary-scroller/dictionary-scroller-selectors';
import {DictionaryOptions, putDictionaryToStore, showDictionary} from '../actions';
import {getDictionary} from '../selectors';
import {DICTIONARY_DESCRIPTORS} from '../dictionary-descriptors';
import {DEFAULT_QUERY_FIELD} from '../constants';
import {Client} from '../../../common-types';

export type DictionaryInputProps = {
    autoSelectSingleOption?: boolean;
    dictionaryName: string;
    nameField: string;
    value?: Array<Client>;
    onChange: (value?: Client | Array<Client> | string) => void;
    onBlur: (value?: Client | Array<Client> | string) => void;
    filterItems?: (data: {data: any}) => void;
    fieldToDisplay?: string;
    fetchParams?: {
        method: string,
        params?: {
            page: number,
            size: number
        }};
    pathAdapter?: () => void;
    multi?: boolean;
    noOnChangeUpdate?: boolean;
    searchQueryField?: string;
    customHandleOpen?: Function;
    handleFilterChange?: (value: string) => void;
    displayFormatter?: () => void;
    disableDisplayFormatterInFilterItems?: boolean;
    emptyValue?: string;
    listFilterComponent?: ComponentType<any>;
}

type MapStateToPropsType = {
    items?: Array<Client>;
    data: Array<Client>;
    loading: boolean;
}

type MapDispatchToPropsType = {
    showDictionaryModal: (name: string, options: DictionaryOptions, customModal?: string) => void;
    putDictionaryToStore: Function;
}

type DictionaryInputClassType = DictionaryInputProps & MapStateToPropsType & MapDispatchToPropsType;

type DictionaryInputState = {
    items: Array<Client>;
    value: string | Client;
}

const filterItems = memoize(
    (filter: string, items: Array<Client> = [], format: Function = identity) => {
        if (!filter.length) {
            return items.slice(0, items.length);
        }
        const lowerFilter = isString(filter) ? filter.toLowerCase() : '';

        return items
            .filter(
                item =>
                    item &&
                    format(item) &&
                    format(item)
                        .toLowerCase()
                        .indexOf(lowerFilter) >= 0
            )
            .slice(0, items.length);
    },
    (filter, items, format) => `${filter}/${items.reduce((acc: string, item: string) => `${acc}${format(item)}`, '')}`
);

const getStateItems = (props: DictionaryInputClassType) => {
    if (props.items && props.items.length > 0) {
        return props.items;
    }
    if (props.value) {
        return [props.value];
    }
    return [];
};

const autoSelect = ({autoSelectSingleOption, items, onChange}: DictionaryInputClassType) =>
    autoSelectSingleOption && items && items.length === 1 && onChange && onChange(items[0]);

const multiItemsPrepare = (items: Array<Client>, fieldToDisplay: string) =>
    items && items.map((item: {id: number}) => ({value: item.id, title: get(item, fieldToDisplay)}));

const multiValuePrepare = (value: Array<Client>) => value && value.map(({id}: {id: number}) => id);

const defaultItems: Array<Client> = [];

export class DictionaryInputClass extends Component<DictionaryInputClassType, DictionaryInputState> {
    static getDerivedStateFromProps(props: DictionaryInputClassType, state: DictionaryInputState) {
        const {items: oldItems, value: oldValue} = state;
        const {items, value} = props;
        let derivedState = null;

        if (!isEqual(items, oldItems)) {
            derivedState = {
                items: getStateItems(props)
            };
        }
        if (!oldValue) {
            derivedState = {
                ...(derivedState || null),
                value
            };
        }

        if (derivedState && derivedState.items && !value) {
            autoSelect(props);
        }
        return derivedState;
    }

    state = {
        items: defaultItems,
        value: ''
    };

    componentDidMount() {
        const {
            fetchParams, pathAdapter, dictionaryName, value
        } = this.props;

        this.props.putDictionaryToStore({
            name: dictionaryName,
            fetchParams,
            pathAdapter,
            force: !isEmpty(fetchParams)
        });

        if (isObject(value)) {
            (this as any).previousCorrectValue = value;
        }
    }

    componentDidUpdate(prevProps: DictionaryInputProps) {
        const {
            fetchParams, pathAdapter, dictionaryName, noOnChangeUpdate, value, onChange, onBlur, emptyValue = ''
        } = this.props;
        if (!isEqual(fetchParams, prevProps.fetchParams) && !noOnChangeUpdate) {
            this.props.putDictionaryToStore({
                name: dictionaryName,
                fetchParams,
                pathAdapter,
                force: !isEmpty(fetchParams)
            });
        }

        if (!this.filterActive && !isObject(value) && !isEmpty(value)) {
            onChange(this.previousCorrectValue || emptyValue);
            onBlur(this.previousCorrectValue || emptyValue);
        }
    }

    previousCorrectValue: string | Client = '';
    filterActive = false;

    handleFilterChange = (value: string): void => {
        const {handleFilterChange} = this.props;

        this.filterActive = true;
        if (handleFilterChange) handleFilterChange(value);

        this.setState({
            value
        });
    };

    multiHandleChange = (value: Array<number>) => {
        const {onChange} = this.props;
        onChange(value.map(valId => this.state.items.find(({id}: {id: number}) => valId === id)));
    };

    handleOpenCatalog = () => {
        const {
            showDictionaryModal,
            dictionaryName,
            onChange,
            filterItems: filterItemList,
            fetchParams,
            pathAdapter,
            multi,
            customHandleOpen,
            searchQueryField = DEFAULT_QUERY_FIELD,
            value
        } = this.props;
        const {items} = this.state;
        const filterItemsCount = filterItemList ? items.length : null;

        if (customHandleOpen) {
            customHandleOpen({filterItemsCount, ...this.props});
        } else {
            showDictionaryModal(dictionaryName, {
                setDictionaryValues: onChange,
                filterItems: filterItemList,
                filterItemsCount,
                fetchParams,
                pathAdapter,
                multi,
                searchQueryField,
                fieldValue: value,
                checkedRows: value
            });
        }
    };

    handleChange = (value: Client) => {
        const {onChange} = this.props;
        const isEmptyValues = isEmpty(this.previousCorrectValue) && isEmpty(value);

        if (!compareFieldsRecursive(value, this.previousCorrectValue) || (isEmptyValues)) {
            (this as any).previousCorrectValue = isObject(value) ? value : this.previousCorrectValue;
            onChange(value);
            this.setState({
                value
            });
        }
    };

    handleBlur = (value: Client) => {
        const {onBlur} = this.props;
        this.filterActive = false;
        onBlur(value);
    };

    handleFocus = () => {
        const {value = ''} = this.state;
        if (!isObject(value)) {
            this.setState(({
                value: null
            }));
        }
    };

    defaultFormatter = (item?: string | Client) => {
        const {fieldToDisplay} = this.props;

        if (isString(item)) {
            return item;
        }
        // @ts-ignore
        return item[fieldToDisplay || (get(DICTIONARY_DESCRIPTORS, `${this.props.dictionaryName}.fieldToDisplay`))];
    };

    render() {
        const {
            value,
            fieldToDisplay,
            multi,
            displayFormatter,
            disableDisplayFormatterInFilterItems,
            listFilterComponent,
            emptyValue = '',
            ...props
        } = this.props;
        const {items, value: stateValue} = this.state;
        const filterFormatter =
            displayFormatter && !disableDisplayFormatterInFilterItems ? displayFormatter : this.defaultFormatter;
        const filteredItems = filterItems(stateValue || '', items || [], filterFormatter);
        return multi ? (
            <Select.Multi
                {...props}
                items={multiItemsPrepare(
                    filteredItems,
                    fieldToDisplay || (get(DICTIONARY_DESCRIPTORS, `${this.props.dictionaryName}.fieldToDisplay`) as any)
                )}
                onChange={this.multiHandleChange}
                value={multiValuePrepare(value)}
                onDictionaryClick={this.handleOpenCatalog}
                onFilterChange={this.handleFilterChange}
                dictionaryView
                itemsForDictView={-1}
                totalAmountOfItems={items.length}
                listFilterComponent={listFilterComponent}
            />
        ) : (
            <Input.Cataloged
                {...props}
                items={filteredItems}
                onFilterChange={this.handleFilterChange}
                onChange={this.handleChange}
                value={this.filterActive ? stateValue : value}
                formatter={displayFormatter || this.defaultFormatter}
                onOpenCatalog={this.handleOpenCatalog}
                totalAmountOfItems={items && items.length}
                onBlur={this.handleBlur}
                onFocus={this.handleFocus}
                emptyValue={emptyValue}
            />
        );
    }
}

const mapStateToProps = (state: StoreType, ownProps: DictionaryInputProps): MapStateToPropsType => {
    const {filterItems: filterItemList} = ownProps;
    const data = getDictionary(ownProps.dictionaryName, !isEmpty(ownProps.fetchParams))(state);
    const items = filterItemList ? filterItemList(data) : data;

    return {
        items,
        data,
        loading: getLoadingState(state)
    };
};

const mapDispatchToProps: MapDispatchToPropsType = {
    putDictionaryToStore,
    showDictionaryModal: showDictionary
};

export const DictionaryInput = connect(
    mapStateToProps,
    mapDispatchToProps
)(DictionaryInputClass);
