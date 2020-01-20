/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {groupActionCreator} from '@vtb/fe-bi-group-modals';
import {showModal} from '@vtb/fe-ui-dialog';
import {translate} from '@vtb/services/i18n';
import dictionary from './dictionary.json';
import {getGroupCapabilities} from '../get-group-capabilities';
import {resource} from '../../../modules/resource';
import {GenericDocument} from '../generic-document';
import {CREATE_CANCELLATION_DOC} from './create-cancellation-doc-modal/create-cancel-request-modal';
import {returnSuccessResult} from '../return-success-result';
import {catchGroupError} from '../catch-group-error';

const i18n = translate.ui(dictionary);

export type CreateCancelRequestParams = {
    capabilitiesUrl: string;
    cancelRequestUrl: string;
    actionName?: string;
    docTypeId?: number;
};

export type CreateCancelRequest = (params: CreateCancelRequestParams) => Function;

const withoutDefaultValue = (tr: Function) => (key, params) => {
    const formattedText = tr(key, params);
    return formattedText === key ? null : formattedText;
};

export const createCancelRequest = ({
    capabilitiesUrl,
    cancelRequestUrl,
    docTypeId = 1,
    actionName = 'RECALL'
}: CreateCancelRequestParams) =>
    groupActionCreator({
        groupAction: ({documents}: any) => (dispatch: Function) =>
            new Promise((resolve, reject) => {
                dispatch(
                    showModal(CREATE_CANCELLATION_DOC, {
                        docTypeId,
                        documents,
                        onSave: (reason: string) =>
                            Promise.all(
                                documents.map((document: GenericDocument) =>
                                    resource(cancelRequestUrl)
                                        .post({
                                            clientId: document.clientSnapshot.id,
                                            cancelEdocRefId: document.edocRefId,
                                            reason
                                        })
                                        .then(returnSuccessResult(document))
                                        .catch(catchGroupError(document)))
                            ).then(resolve)
                    })
                );
            }),
        i18n,
        actionName,
        getGroupCapabilities: getGroupCapabilities(capabilitiesUrl)
    });
