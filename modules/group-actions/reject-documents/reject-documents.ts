/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2018 VTB Group. All rights reserved.
 */
import {translate} from '@vtb/services/i18n';
import {showModal} from '@vtb/fe-ui-dialog';
import {groupActionCreator} from '@vtb/fe-bi-group-modals';
import {FORM_WITH_COMMENT} from '../../popups';
import {commentValidator} from '../../form-sidebar/form-sidebar-actions';
import dictionary from './dictionary.json';
import {resource} from '../../resource';
import {returnSuccessResult} from '../return-success-result';
import {catchGroupError} from '../catch-group-error';
import {getGroupCapabilities} from '..//get-group-capabilities';
import {GroupAction} from '../group-action';

const i18n = translate.ui(dictionary);

export type RejectDocumentParams = {
    capabilitiesUrl: string;
    getUrlForReject: (id: string) => string;
    actionName?: string;
};

export type RejectDocuments = (params: RejectDocumentParams) => Function;

export const rejectDocuments = ({
    capabilitiesUrl,
    getUrlForReject,
    actionName = 'REJECT'
}: RejectDocumentParams): GroupAction =>
    groupActionCreator({
        groupAction: ({documents}: any) => (dispatch: Function) =>
            new Promise((resolve, reject) => {
                dispatch(
                    showModal(FORM_WITH_COMMENT, {
                        withoutRequest: true,
                        formParams: {
                            title: i18n('modals.rejectModalTitle'),
                            submitFieldLabel: i18n('modals.rejectModalFieldLabel'),
                            submitButtonLabel: i18n('buttons.reject'),
                            cancelButtonLabel: i18n('buttons.cancel'),
                            commentFieldKey: 'comment',
                            reduxFormProps: {validate: commentValidator}
                        },
                        afterSubmit: (comment: string) =>
                            Promise.all(
                                documents.map((document: any) =>
                                    resource(getUrlForReject(document.id))
                                        .post({
                                            comment
                                        })
                                        .then(returnSuccessResult(document))
                                        .catch(catchGroupError(document))
                                )
                            ).then(resolve)
                    })
                );
            }),
        i18n,
        actionName,
        getGroupCapabilities: getGroupCapabilities(capabilitiesUrl)
    });
