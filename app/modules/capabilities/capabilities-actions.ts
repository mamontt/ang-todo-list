/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {identity} from 'lodash';
import {fetchData} from './../../utils/fetchable';
import {CLIENT_CAPABILITIES_SUB_RESOURCE} from './../../api/urls';
import {ApiMethod} from '../../utils/fetchable';

const CAPABILITIES_DOMAIN_NAMESPACE = '@@capabilities';
export const SET_CAPABILITIES = `${CAPABILITIES_DOMAIN_NAMESPACE}/SET`;
export const CLEAR_CAPABILITIES = `${CAPABILITIES_DOMAIN_NAMESPACE}/CLEAR`;

export type fetchCapabilitiesType = {
    documentName: string;
    resource: {
        [method: string]: ApiMethod;
    };
    capabilitiesSubResource: string;
    form: string;
    actionPrefix?: string;
}

type Result = Array<string>;

export const clearCapabilities = (documentName: string) => () => ({
    type: CLEAR_CAPABILITIES,
    meta: {documentName}
});

export function setCapabilitiesActionCreator(documentName: string, payload: Result) {
    return {
        type: SET_CAPABILITIES,
        payload,
        meta: {documentName}
    };
}

function stripPrefixInjector(actionPrefix: string) {
    return (
        actionPrefix ?
            (data: Result) => {
                const matcher = new RegExp(`^${actionPrefix}`);
                return [].concat(data).filter(x => x).map(x => x.replace(matcher, ''));
            } :
            identity
    );
}

export const setCapabilities = (
    documentName: string,
    result: Result,
    actionPrefix: string
) => setCapabilitiesActionCreator(
    documentName,
    stripPrefixInjector(actionPrefix)(result)
);

export const fetchCapabilities = ({
    documentName,
    resource,
    capabilitiesSubResource = CLIENT_CAPABILITIES_SUB_RESOURCE,
    actionPrefix = '',
    form
}: fetchCapabilitiesType) => (id: number) =>
    fetchData(CAPABILITIES_DOMAIN_NAMESPACE, {
        form,
        after: (result: Result) => setCapabilities(documentName, result, actionPrefix)
    })(resource.get, `${id}/${capabilitiesSubResource}`);
