/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {get, isEmpty, isNil, memoize} from 'lodash';
import {API_URL} from './../../api';
import {getValidationErrors} from './../../modules/validation';
import {
    CHECK_SIGN,
    EXPORT_VERIFY,
    REMOVE_SIGN,
    SIGN
} from './../../constants/document-action-capabilities';
import {Tab} from './tab-types';
import {Branch, Client, Letter} from '../../common-types';

type BuildTabsTypes = {
    documentId: number | string;
    documentStatus: string;
    letterTabs: Array<Tab>;
    persistentTabId: string;
    isCopy: boolean;
}

type PropsType = {
    service: string;
    endPoint: string;
    dictionaryUrl: string;
    urlParams: string;
}

/**
 * Transformation of last check results to format for getValidationErrors()
 */
const transformCheckResults = (checkData: Letter, documentId: number) => (
    (!isEmpty(checkData)) ?
        {
            id: documentId,
            errors: [{
                type: checkData[0].type,
                message: checkData[0].message,
                errors: checkData[0].errors,
                warnings: checkData[0].warnings
            }]
        }
        : null);

export const rebuildCheckResultsData = (
    document: Letter,
    documentId: number = null
) => getValidationErrors(transformCheckResults(document, documentId));

const getClientIdUrlPart = (clientId: number, params: string = '') => (
    clientId ? `?clientId=${clientId}${params ? `&${params}` : ''}` : `${params ? `?${params}` : ''}`
);
export const branchPathAdapter = (clientId: number, urlParams: string) =>
    ({
        service, endPoint, dictionaryUrl
    }: PropsType) => `${[API_URL, service, dictionaryUrl, endPoint]
        .filter((value: string) => value !== undefined).join('/')}${getClientIdUrlPart(clientId, urlParams)}`;


export const getIdFromSnapshot = (snapshot: Client | Branch) => get(snapshot, 'id', undefined);

export const buildDisableActions = memoize((capabilities: Array<string>) => [
    !capabilities.includes(CHECK_SIGN) ? 'check' : undefined,
    !capabilities.includes(REMOVE_SIGN) ? 'remove' : undefined,
    !capabilities.includes(SIGN) ? 'sign' : undefined,
    !capabilities.includes(EXPORT_VERIFY) ? 'export' : undefined,
    !capabilities.includes(CHECK_SIGN) ? 'checkAll' : undefined
].filter(Boolean));

export const buildTabs = ({
    documentId,
    documentStatus,
    letterTabs,
    persistentTabId,
    isCopy
}: BuildTabsTypes) => {
    if (!isNil(documentId) && !isNil(documentStatus) && !isCopy) {
        return letterTabs;
    }
    const found = letterTabs.find((item: Tab) => item.id === persistentTabId);
    return isNil(found) ? [] : [found];
};
