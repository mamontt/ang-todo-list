/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2018 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {Component} from 'react';
import {get} from 'lodash';
import {connect} from 'react-redux';
import {Select} from '@vtb/fe-ui-select';
import {noop} from '@vtb/services/utils';
import {StoreType} from './../../../store/root-selector';
import {getLoadingState} from '../dictionary-scroller/dictionary-scroller-selectors';
import {
    DictionaryOptions,
    putDictionaryToStore as putDictionaryToStoreAction,
    showDictionary
} from '../actions';
import {getDictionary} from '../selectors';
import {getFormattedSelectItems, getIdField} from './selectors';
import {Client} from '../../../common-types';

type DictionarySelectProps = {
    autoSelectSingleOption?: boolean;
    dictionaryName: string;
    nameField: string;
    value?: string | Client;
    onChange?: (value: string | Client) => void;
    fieldToDisplay?: string;
    showDescription?: string;
}

type MapStateToPropsType = {
    items?: Array<Client>;
    loading: boolean;
}

type MapDispatchToPropsType = {
    showDictionaryModal: (name: string, options: DictionaryOptions, customModal?: string) => void;
    putDictionaryToStore: Function;
}

type DictionarySelectClassType = DictionarySelectProps & MapStateToPropsType & MapDispatchToPropsType;

export class DictionarySelectClass extends Component<DictionarySelectClassType, {}> {
    componentDidMount() {
        const {dictionaryName, putDictionaryToStore} = this.props;
        putDictionaryToStore({name: dictionaryName});
        this.autoSelectOneItem();
    }

    componentDidUpdate(prevProps: DictionarySelectClassType) {
        if (prevProps.items !== this.props.items ||
            prevProps.value !== this.props.value) {
            this.autoSelectOneItem();
        }
    }

    getFormattedSelectItemsReSelector = getFormattedSelectItems();
    getIdFieldReSelector = getIdField();

    getFormattedSelectItems = () => this.getFormattedSelectItemsReSelector(this.props);
    getIdField = () => this.getIdFieldReSelector(this.props);

    autoSelectOneItem() {
        const {
            autoSelectSingleOption,
            items = [],
            onChange = noop
        } = this.props;

        if (autoSelectSingleOption && this.isValueUndefinedOrNull() && items.length === 1) {
            onChange(items[0]);
        }
    }

    isValueUndefinedOrNull() {
        const {value} = this.props;
        return value === undefined || value === null;
    }

    handleOnChange = (value: number | string): void => {
        const {onChange, items = []} = this.props;
        const foundItem = items.find((item) => item[this.getIdField()] === value);
        if (onChange) onChange(foundItem);
    };

    render() {
        const {value, ...props} = this.props;
        return (
            <Select
                {...props}
                value={get(value, this.getIdField())}
                onChange={this.handleOnChange}
                items={this.getFormattedSelectItems()}
            />
        );
    }
}

type OwnPropsType = {
    dictionaryName: string
}

export const DictionarySelect = connect(
    (state: StoreType, ownProps: OwnPropsType) => ({
        items: getDictionary(ownProps.dictionaryName)(state),
        loading: getLoadingState(state)
    }),
    {
        putDictionaryToStore: putDictionaryToStoreAction,
        showDictionaryModal: showDictionary
    }
)(DictionarySelectClass);
