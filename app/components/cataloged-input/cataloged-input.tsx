/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {Component} from 'react';
import {get, has, omit, isNil, isString, isArray} from 'lodash';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {change, getFormInitialValues, getFormMeta} from 'redux-form';
import {Fields} from '@vtb/fe-ui-input';
import {showModal as showModalAction} from '@vtb/fe-ui-dialog';
import {ActionCreator} from './../../utils/common-flow-types';
import {FiltersType} from '../../pages/letter-scroller/common/filter/form';

type OwnProps = {
    form: string,
    forLabelId?: string,
    name: string,
    displayValue: string,
    modalName?: string,
    /** Объект с параметрами, которые будут переданы при запросе словаря */
    filters?: FiltersType,
    onChange?: Function,
    fetch?: Function,
    maxLength: number,
    disabled: boolean
};

type StateProps = {
    isTouched: boolean,
    isInitialized: boolean,
    initialValues: any
};

type DispatchProps = {
    changeField: ActionCreator,
    showModal: ActionCreator
};

type Props = OwnProps & StateProps & DispatchProps;
type State = {
    clientId: number
}

class CatalogedInputComponent extends Component<Props, State> {
    state = {
        clientId: null
    };

    onItemsLoaded = ({items}: any): void => {
        const {isInitialized, initialValues, filters = {}} = this.props;
        const clientIdFromProps = get(filters, 'clientId', null);
        const documentId = get(initialValues, 'id', null);
        const isChangedClient = this.state.clientId !== clientIdFromProps;

        if (isArray(items) && items.length === 1 && !isInitialized && !documentId && isChangedClient) {
            const [item] = items;
            this.changeValueWithOnChange(item);
        }
        this.setState({clientId: filters.clientId});
    };

    handleOpenCatalog = () => {
        const {
            showModal,
            modalName,
            filters
        } = this.props;

        showModal(modalName, {
            onSelect: this.changeValueWithOnChange,
            filters
        });
    };

    changeValueWithOnChange = (value: string) => {
        const {changeField, onChange} = this.props;

        changeField(this.formatter(value));

        if (onChange) {
            onChange(value);
        }
    };

    formatter = (item: string): string => {
        if (isNil(item)) {
            return null;
        }

        return isString(item) ? item : item[this.props.displayValue];
    };

    render() {
        const {name, changeField} = this.props;
        const rest = omit(this.props, [
            'form',
            'name',
            'displayValue',
            'isTouched',
            'isInitialized',
            'modalName',
            'filters',
            'changeField',
            'showModal'
        ]);

        return (
            <Fields.CatalogedInputWithData
                name={name}
                id={name}
                formatter={this.formatter}
                formatItem={this.formatter}
                onFilterChange={changeField}
                normalize={this.formatter}
                symbolsToSearch={Infinity}
                onItemsLoaded={this.onItemsLoaded}
                onOpenCatalog={this.handleOpenCatalog}
                {...rest}
            />
        );
    }
}

export const CatalogedInput = connect(
    (state, {form, name}: OwnProps): StateProps => ({
        isTouched: get(getFormMeta(form)(state), `${name}.touched`, false),
        isInitialized: has(getFormInitialValues(form)(state), name),
        initialValues: getFormInitialValues(form)(state)
    }),
    (dispatch, {form, name}: OwnProps): DispatchProps => ({
        changeField: (value) => dispatch(change(form, name, value)),
        ...bindActionCreators({showModal: showModalAction}, dispatch)
    })
)(CatalogedInputComponent);
