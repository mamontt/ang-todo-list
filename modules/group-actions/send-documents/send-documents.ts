/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
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

type SendDocumentsParams = {
    capabilitiesUrl: string;
    sendUrl: (id: string | number) => string;
    actionName?: string;
};

export const sendDocuments = ({capabilitiesUrl, sendUrl, actionName = 'SEND'}: SendDocumentsParams): GroupAction =>
    groupActionCreator({
        action: ({document}: GroupActionParams) => (dispatch: Function) =>
            resource(sendUrl(document.id))
                .create()
                .then(returnSuccessResult(document))
                .catch(catchGroupError(document)),
        i18n,
        actionName,
        getGroupCapabilities: getGroupCapabilities(capabilitiesUrl)
    });
