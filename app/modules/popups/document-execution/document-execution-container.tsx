/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {ComponentType} from 'react';
import {closeModal} from '@vtb/fe-ui-dialog';
import {omit, noop} from 'lodash';
import {connect} from 'react-redux';
import {doActionOnSubmit} from './actions';
import {documentExecutionWithFormProps} from './document-execution-with-form-props';

type DocumentExecutionFormContainerProps = {
    modalParams: {
        namespace: string,
        resource: Object,
        id: number | string,
        documentActionName: string,
        afterSubmit: Function,
        reduxFormProps: Object
    },
    onSubmitAction: Function,
    closeModal: Function
}

class DocumentExecutionFormContainerClass extends React.Component<DocumentExecutionFormContainerProps> {
    onSubmit = (formData: Object) => {
        const {
            modalParams: {
                namespace = '',
                resource = {},
                id = null,
                documentActionName = '',
                afterSubmit = noop
            } = {},
            onSubmitAction
        } = this.props;

        onSubmitAction(
            `${namespace}/${documentActionName}`,
            resource,
            id,
            documentActionName,
            {...omit(formData, 'complexPart')},
            () => {
                this.props.closeModal();
                return afterSubmit();
            }
        );
    };

    render() {
        const {
            modalParams: {
                reduxFormProps = {}
            } = {}
        } = this.props;

        const DocumentExecutionForm: ComponentType<any> = documentExecutionWithFormProps(reduxFormProps);
        return (
            <DocumentExecutionForm
                onSubmit={this.onSubmit}
                onClose={this.props.closeModal}
            />
        );
    }
}

export const DocumentExecutionFormContainer = connect(null, {
    onSubmitAction: doActionOnSubmit,
    closeModal
})(DocumentExecutionFormContainerClass);
