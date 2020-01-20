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
import {returnFailedResult} from '../return-failed-result';

const i18n = translate.ui(dictionary);

type CheckSignaturesParams = {
    capabilitiesUrl: string;
    sendUrl: (id: string | number) => string;
    actionName?: string;
};

export const checkSignature = ({capabilitiesUrl, sendUrl, actionName = 'CHECK_SIGN'}: CheckSignaturesParams) =>
    groupActionCreator({
        action: ({document}: GroupActionParams) => (dispatch: Function) =>
            resource(sendUrl(document.id))
                .create()
                .then((response: {results: Array<any>}) => {
                    const valid = response.results.every(sign => sign.status === 'VALID');
                    return valid ? returnSuccessResult(document)() : returnFailedResult(document)();
                })
                .catch(catchGroupError(document)),
        i18n,
        actionName,
        getGroupCapabilities: getGroupCapabilities(capabilitiesUrl)
    });
