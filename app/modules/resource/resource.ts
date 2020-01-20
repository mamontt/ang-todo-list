/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import fetch from '@vtb/services/request';
import {isObject, keys, pick, identity} from 'lodash';
import url from 'url';
import {ApiMethod} from './../../utils/fetchable';
import * as RequestTypes from '../../constants/request-types-big';
import * as ResourceMethods from '../../constants/request-types';
import {OK, CREATED, BAD_REQUEST} from '../../api/response-codes';
import {json} from './interceptors';

export type ResourceType = {
    get: ApiMethod;
    post: ApiMethod;
    create: ApiMethod;
    delete: ApiMethod;
    update: ApiMethod;
    action?: ApiMethod;
    [method: string]: ApiMethod;
}

type Param = {
    size?: number;
    page?: number;
}

type UrlParam = string | Param;

export function resource(
    endpoint: string,
    methods: Array<string> = keys(ResourceMethods),
    interceptor: Function = identity
) {
    return <ResourceType>pick(
        defineRequestTypes(endpoint, interceptor),
        methods.map(method => method.toLowerCase())
    );
}

function defineRequestTypes(endpoint: string, interceptor) {
    return {
        get: defineGet(endpoint, interceptor),
        post: definePost(endpoint, interceptor),
        create: definePost(endpoint, interceptor),
        update: definePut(endpoint, interceptor),
        action: defineAction(endpoint, interceptor),
        options: defineOptions(endpoint, interceptor),
        delete: defineDelete(endpoint, interceptor),
        validate: defineValidate(endpoint, interceptor)
    };
}

function defineGet(endpoint: string, interceptor = identity) {
    return (urlParam: UrlParam) =>
        fetchWithHandleResponse({
            url: makeUrl(endpoint, urlParam),
            ...interceptor({
                method: RequestTypes.GET
            })
        });
}

function definePost(endpoint: string, interceptor = json) {
    return (data: string) =>
        fetchWithHandleResponse({
            url: endpoint,
            ...interceptor({
                method: RequestTypes.POST,
                data
            })
        });
}

function definePut(endpoint: string, interceptor = json) {
    return (urlParam: UrlParam, data = {}) =>
        fetchWithHandleResponse({
            url: makeUrl(endpoint, urlParam),
            ...interceptor({
                method: RequestTypes.PUT,
                data
            })
        });
}

function defineOptions(endpoint: string, interceptor = identity) {
    return (urlParam: UrlParam) =>
        fetchWithHandleResponse({
            url: makeUrl(endpoint, urlParam),
            ...interceptor({
                method: RequestTypes.OPTIONS
            })
        });
}

function defineDelete(endpoint: string, interceptor = identity) {
    return (urlParam: UrlParam) =>
        fetchWithHandleResponse({
            url: makeUrl(endpoint, urlParam),
            ...interceptor({
                method: RequestTypes.DELETE
            })
        });
}

function defineAction(endpoint: string, interceptor = json) {
    return (id: number, action: string, data = {}) =>
        fetchWithHandleResponse({
            url: makeActionUrl(endpoint, id, action),
            ...interceptor({
                method: RequestTypes.POST,
                data
            })
        });
}

function defineValidate(endpoint: string, interceptor = json) {
    return (data = {}) =>
        fetchWithHandleResponse({
            url: `${endpoint}/validate`,
            ...interceptor({
                method: RequestTypes.POST,
                data
            })
        });
}

export function makeActionUrl(endpoint: string, id: Number, action: string = '') {
    return `${endpoint}/${String(id)}/${action}`;
}

export function makeUrl(endpoint: string, urlParam: UrlParam = {}) {
    const urlObj = makeUrlObj(urlParam);
    return url.resolve(`${endpoint}/`, url.format(urlObj));
}

export function makeUrlObj(urlParam: any) {
    const timestamp: string = `${Date.now()}`;

    if (isScalar(urlParam)) {
        return {
            pathname: String(urlParam),
            query: {timestamp}
        };
    }

    return {
        query: {
            ...urlParam,
            timestamp
        }
    };
}

function isScalar(val: string) {
    return !isObject(val);
}

export function fetchWithHandleResponse(request: Object) {
    return fetch(request).then(handleResponse);
}

type ResponseType = {
    status: number,
    data: {
        data: any
    }
}

function handleResponse(response: ResponseType) {
    if (response.status === OK || response.status === CREATED) {
        return getResponseBody(response);
    } else if (response.status > OK && response.status < BAD_REQUEST) {
        return Promise.resolve({});
    }
    return getResponseBody(response).then(err => Promise.reject(err));
}

function getResponseBody(response: ResponseType) {
    return Promise.resolve((response && response.data) || {});
}
