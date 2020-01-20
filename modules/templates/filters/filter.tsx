/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2018 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {PureComponent} from 'react';
import {AnyAction, bindActionCreators, Dispatch} from 'redux';
import {connect} from 'react-redux';
import {omit} from 'lodash';
import {Filter as FilterUiKit} from '@vtb/fe-ui-table';
import {ModalForm} from '@vtb/fe-ui-grid';
import {reset, change, destroy, getFormValues} from 'redux-form';
import {FilterForm} from './filter-form';
import {TEMPLATES_DESCRIPTORS} from '../template-descriptors';
import {convertFormToFilterTemplate, buildTagsFilter, buildTranslate, buildFormName, FormType} from './utils';
import {OnFilterTagsType} from '../flow-types';
import {ActionFabriqueType} from '../../dictionary-new/flow-types';
import {StoreType} from '../../../store/root-selector';

type FilterPropsType = ActionFabriqueType & {
    docTypeId?: number;
    onFilterTags?: OnFilterTagsType;
    onDeleteField?: (fieldName: string) => Array<string>;
}

type FilterClassStateType = {
    open: boolean;
}

type MapStateToPropsType = {
    form?: FormType;
}

type MapDispatchToPropsType = {
    resetForm: () => void;
    destroy: () => void;
    changeForm: (name: string, value: string | null) => void;
}

export type FilterClassPropsType = FilterPropsType & MapStateToPropsType & MapDispatchToPropsType;

const mapStateToProps = (state: StoreType, {docTypeId}: {docTypeId?: number}): MapStateToPropsType => ({
    form: getFormValues(buildFormName(docTypeId))(state)
});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>, {docTypeId}: {docTypeId?: number}): MapDispatchToPropsType =>
    bindActionCreators({
        resetForm: () => reset(buildFormName(docTypeId)),
        changeForm: (name, value) => change(buildFormName(docTypeId), name, value),
        destroy: () => destroy(buildFormName(docTypeId))
    }, dispatch);

export const Filter = connect(mapStateToProps, mapDispatchToProps)(
    class FilterClass extends PureComponent<FilterClassPropsType, FilterClassStateType> {
        state = {
            open: false
        };

        componentWillUnmount() {
            this.props.destroy();
        }

        handleSubmitFilter = () => {
            this.props.setFilters(convertFormToFilterTemplate(this.props.form));
            this.setState(() => ({open: false}));
        };

        handleCleanFilter = () => {
            this.props.resetForm();
        };

        handleOpenForm = (open: boolean) => this.setState(() => ({open}));

        handleDeleteField = (fieldName: string) => {
            const {
                resetForm,
                setFilters,
                onDeleteField,
                changeForm,
                form = {}
            } = this.props;
            if (fieldName === FilterUiKit.CLEAR_FILTER) {
                resetForm();
                setFilters({});
            } else {
                let removeFields = [fieldName];

                if (onDeleteField) {
                    removeFields = removeFields.concat(onDeleteField(fieldName));
                }

                const filters = convertFormToFilterTemplate(omit(form, removeFields));

                removeFields.forEach(field => changeForm(field, null));
                setFilters(filters);
            }
        };

        render() {
            const {form, docTypeId, onFilterTags} = this.props;
            const translate = buildTranslate(TEMPLATES_DESCRIPTORS[docTypeId].filterFields());
            const fields = buildTagsFilter(form, translate, onFilterTags);

            return (
                <FilterUiKit.Simple
                    fields={fields}
                    open={this.state.open}
                    onOpenForm={this.handleOpenForm}
                    onSubmitButton={this.handleSubmitFilter}
                    onCleanButton={this.handleCleanFilter}
                    onDeleteField={this.handleDeleteField}
                    leftSide={<ModalForm.Header title="" />}
                >
                    <FilterForm
                        form={buildFormName(docTypeId)}
                        docTypeId={docTypeId}
                        handleSubmit={this.handleSubmitFilter}
                    />
                </FilterUiKit.Simple>);
        }
    }
);
