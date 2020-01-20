/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2018 VTB Group. All rights reserved.
 */
import React, {Component} from 'react';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {noop} from 'lodash';
import {reduxForm, getFormValues} from 'redux-form';
import {closeModal} from '@vtb/fe-ui-dialog';
import {CreateCancellationDocModalContent} from './components/content';

type CancellationDocModal = {
    changeReason: (value?: string) => void;
    closeModal: () => void;
    isLoading?: boolean;
    modalParams: any;
    formValues: {reason: string};
    save: Function;
    form: string;
};

export class CreateCancellationDocModalUI extends Component<CancellationDocModal> {
    static defaultProps = {
        changeReason: noop,
        close: noop,
        save: noop
    };

    handleSave = () => {
        const {
            modalParams: {onSave},
            formValues: {reason}
        } = this.props;
        this.props.closeModal();
        onSave(reason);
    };

    render() {
        const {
            modalParams: {documents, docTypeId},
            isLoading,
            formValues: {reason} = {reason: ''},
            form
        } = this.props;
        const buttonsAreDisabled = isLoading || !reason.length;
        const multipleDocs = documents.length > 1;
        const clientId = documents.map(d => d.clientSnapshot && d.clientSnapshot.id)[0];
        return (
            <CreateCancellationDocModalContent
                buttonsAreDisabled={buttonsAreDisabled}
                isLoading={isLoading}
                multipleDocs={multipleDocs}
                onChangeReason={() => {}}
                onClose={this.props.closeModal}
                onSave={this.handleSave}
                formName={form}
                clientId={clientId}
                docTypeId={docTypeId}
            />
        );
    }
}

const MODAL_CANCELLATION_DOC_FORM_NAME = 'MODAL_CANCELLATION_DOC_FORM_NAME';
export const CreateCancellationDocModal = compose(
    reduxForm({
        form: MODAL_CANCELLATION_DOC_FORM_NAME
    }),
    connect(
        state => ({
            formValues: getFormValues(MODAL_CANCELLATION_DOC_FORM_NAME)(state)
        }),
        {
            closeModal
        }
    )
)(CreateCancellationDocModalUI);
