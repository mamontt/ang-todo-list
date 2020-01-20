/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2018 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {Component, ComponentType} from 'react';
import {connect} from 'react-redux';
import {getFormValues, reduxForm, change} from 'redux-form';
import {closeModal, SHOW_CENTER} from '@vtb/fe-ui-dialog';
import {noop} from 'lodash';
import {compose} from 'redux';
import {DETAIL_TYPE} from '../../modules/export';
import {ExportModal, ExportContentPropsType, ContentItems} from './export-modal';
import {EXPORT_MODAL_NAME} from './actions';
import {EXPORT_FORM} from './export-content';
import {initialValues as initial} from './constants';
import {StoreType} from '../../store/root-selector';

export type ShowExportModalType = ContentItems & {
    title?: string;
    content?: ComponentType<ExportContentPropsType>;
    exportButtonTitle?: string;
    onExport?: Function;
    onReload?: () => void;
    initialValues?: {[key: string]: any};
}

type ExportPopupOwnType = {
    modalParams: ShowExportModalType;
}

type MapStateToPropsType = {
    formValues?: {[key: string]: string};
    initialValues?: {[key: string]: any};
}

type MapDispatchToPropsType = {
    closeModal: () => void;
    onChange?: (param: string, format: string) => void;
};

type ExportPopupType = ExportPopupOwnType & MapStateToPropsType & MapDispatchToPropsType;

const changeValue = (filedName: string, value: string) => change(EXPORT_FORM, filedName, value);

export class ExportPopupContainer extends Component<ExportPopupType> {
    onExport = () => {
        const {modalParams: {onExport = noop, onReload = noop}, formValues} = this.props;
        this.props.closeModal();
        onExport(formValues);
        onReload();
    };

    render() {
        const {
            formValues,
            onChange,
            modalParams: {
                title,
                content,
                exportTypes,
                extensionItems,
                isMultiple,
                exportButtonTitle
            }
        } = this.props;

        return (
            <ExportModal
                title={title}
                content={content}
                exportTypes={exportTypes}
                extensionItems={extensionItems}
                isMultiple={isMultiple}
                exportButtonTitle={exportButtonTitle}
                onExport={this.onExport}
                closeModal={this.props.closeModal}
                formValues={formValues}
                onChange={onChange}
            />
        );
    }
}

type OwnPropsType = {
    modalParams: {
        initialValues: {
            type: string,
            extension: string,
            split: false
        },
        isMultiple: boolean
    }
}

const mapStateToProps = (state: StoreType, ownProps: OwnPropsType): MapStateToPropsType => {
    const {initialValues = initial, isMultiple} = ownProps.modalParams;

    return {
        formValues: getFormValues(EXPORT_FORM)(state),
        initialValues: isMultiple ? initialValues : {...initialValues, type: DETAIL_TYPE}
    };
};

const mapDispatchToPropsType: MapDispatchToPropsType = {
    closeModal,
    onChange: changeValue
};

export const ExportPopup = compose(
    connect(mapStateToProps, mapDispatchToPropsType),
    reduxForm({
        form: EXPORT_FORM,
        enableReinitialize: true
    })
)(ExportPopupContainer as any);

export const EXPORT_MODAL = {
    view: EXPORT_MODAL_NAME,
    type: SHOW_CENTER,
    component: ExportPopup
};
