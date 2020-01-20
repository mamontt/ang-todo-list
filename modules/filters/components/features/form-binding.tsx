/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {LegacyRef} from 'react';
import {ComponentType, PureComponent} from 'react';
import {connect} from 'react-redux';
import {initialize, getFormValues, reduxForm} from 'redux-form';
import {omit, noop} from 'lodash';
import {PERIOD, STATUSES} from '../../../../constants/form-naming';
import {Tagable} from './tagable';
import {NewFiltersType} from './value-mapping';

type AttachedFormType = {
    formComponent?: ComponentType<any>;
    initialValues?: {
        [fieldName: string]: string;
    };
    onSubmit?: Function;
    ref?: LegacyRef<HTMLFormElement>;
}

const AttachedForm: ComponentType<AttachedFormType> = reduxForm({})(
    ({ formComponent: Form, ...props }: AttachedFormType) =>
        <Form {...props} />
);

type Props = {
    formOptions?: {
        form?: string;
        onChange?: (filters: NewFiltersType) => void;
    },
    dispatch?: Function;
    value?: {[fieldName: string]: string};
    onChange?: (filters: NewFiltersType) => void;
    formComponent?: ComponentType<any>;
    onFilterAdd?: (fieldName: string, fieldValue: string) => void;
    onDeleteField?: (fieldName: string) => void;
}

class FormBindingClass extends PureComponent<Props> {
    handleCleanForm = () => {
        const {formOptions, dispatch} = this.props;
        dispatch(initialize(formOptions.form, {
            [STATUSES]: [],
            [PERIOD]: []
        }));
    };

    rendererForm = (ref = noop) => {
        const {
            formOptions, value, onChange, formComponent
        } = this.props;

        return (
            <AttachedForm
                {...formOptions}
                formComponent={formComponent}
                initialValues={value}
                onSubmit={onChange}
                ref={ref}
            />
        );
    };

    render() {
        const props = omit(this.props, ['formComponent', 'formOptions']);

        return (
            <Tagable
                {...props}
                onCleanButton={this.handleCleanForm}
            >
                {this.rendererForm}
            </Tagable>
        );
    }
}

export const FormBinding: ComponentType<Props> = connect((state, ownProps: {formOptions: {form: string}}) => ({
    form: getFormValues(ownProps.formOptions.form)(state)
}))(FormBindingClass);
