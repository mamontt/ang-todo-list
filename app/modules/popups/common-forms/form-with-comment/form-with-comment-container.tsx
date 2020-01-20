/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2018 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {Component} from 'react';
import {reduxForm} from 'redux-form';
import {connect} from 'react-redux';
import {closeModal as close} from '@vtb/fe-ui-dialog';
import {compose} from 'redux';
import {get, noop} from 'lodash';
import {FormWithComment} from './form-with-comment';
import {doActionOnSubmit, doActionWithoutRequestOnSubmit} from './actions';

type FormWithCommentContainerTypes = {
    modalParams?: {
        namespace: string,
        resource: Object,
        id: number | string,
        documentActionName: string,
        afterSubmit: Function,
        afterError: Function,
        formParams: {
            title: string,
            commentFieldKey: string,
            submitFieldLabel: string,
            submitButtonLabel: string,
            cancelButtonLabel: string,
            reduxFormProps: Object
        },
        withoutRequest?: boolean
    },
    onSubmitAction: Function,
    onSubmitWithoutRequest: Function,
    closeModal: Function
};

class FormWithCommentContainerClass extends Component<FormWithCommentContainerTypes> {
    onSubmit = (formData: {[commentFieldKey: string]: string}) => {
        const {
            modalParams: {
                namespace = '',
                resource = {},
                id = null,
                documentActionName = '',
                afterSubmit = noop,
                afterError = noop,
                formParams: {
                    commentFieldKey = 'reason'
                } = {},
                withoutRequest = false
            } = {},
            onSubmitAction,
            onSubmitWithoutRequest
        } = this.props;

        if (withoutRequest) {
            onSubmitWithoutRequest(() => {
                const comment = get(formData, 'comment', '');
                this.props.closeModal();
                return afterSubmit(comment);
            });
        } else {
            onSubmitAction(
                `${namespace}/${documentActionName}`,
                resource,
                id,
                documentActionName,
                {[commentFieldKey]: formData[commentFieldKey]},
                () => {
                    this.props.closeModal();
                    return afterSubmit();
                },
                () => afterError()
            );
        }
    };

    onClose = () => {
        const {modalParams, closeModal} = this.props;
        if (modalParams.withoutRequest) {
            closeModal();
        }
        closeModal();
    };

    render() {
        const {
            modalParams: {
                formParams: {
                    title = '',
                    submitFieldLabel = '',
                    submitButtonLabel = '',
                    cancelButtonLabel = '',
                    commentFieldKey = 'reason'
                } = {}
            } = {}
        } = this.props;
        return (
            <FormWithComment
                {...this.props}
                onSubmit={this.onSubmit}
                onClose={this.onClose}
                title={title}
                submitFieldLabel={submitFieldLabel}
                submitButtonLabel={submitButtonLabel}
                cancelButtonLabel={cancelButtonLabel}
                commentFieldKey={commentFieldKey}
                withCross
            />
        );
    }
}

export const FormWithCommentContainer = compose(
    connect(
        (state, ownProps: FormWithCommentContainerTypes) => {
            const {
                modalParams: {
                    namespace = '',
                    documentActionName = '',
                    formParams: {
                        reduxFormProps = {}
                    } = {}
                } = {}
            } = ownProps;
            return {
                form: `${namespace}/${documentActionName}`,
                ...reduxFormProps
            };
        },
        {
            onSubmitAction: doActionOnSubmit,
            onSubmitWithoutRequest: doActionWithoutRequestOnSubmit,
            closeModal: close
        }
    ),
    reduxForm({
        enableReinitialize: true
    })
)(FormWithCommentContainerClass as any);
