/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2018 VTB Group. All rights reserved.
 */
import {groupActionCreator} from '@vtb/fe-bi-group-modals';
import {translate} from '@vtb/services/i18n';
import dictionary from './dictionary.json';
import {resource} from '../../../modules/resource';
import {GroupActionParams} from '../group-action-params';
import {returnSuccessResult} from '../return-success-result';
import {catchGroupError} from '../catch-group-error';
import {getGroupCapabilities} from '../get-group-capabilities';
import {GroupAction} from './../group-action';

const i18n = translate.ui(dictionary);

export type DeleteDocumentsParams = {
    capabilitiesUrl: string;
    sendUrl: (id: string | number) => string;
    actionName?: string;
};

export const deleteDocuments = ({
    capabilitiesUrl,
    sendUrl,
    actionName = 'DELETE'
}: DeleteDocumentsParams): GroupAction =>
    groupActionCreator({
        action: ({document}: GroupActionParams) => (dispatch: Function) =>
            resource(sendUrl(document.id))
                .delete()
                .then(returnSuccessResult(document))
                .catch(catchGroupError(document)),
        i18n,
        actionName,
        getGroupCapabilities: getGroupCapabilities(capabilitiesUrl)
    });
