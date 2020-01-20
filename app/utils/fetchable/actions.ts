/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {startSubmit, stopSubmit} from 'redux-form';

import {
    SimpleAction,
    Action,
    NamespacedActionType,
    ThunkAction
} from '../../utils/common-flow-types';

export type FetchPayload = {
    data: any;
    err?: any;
}
export type FetchMeta = {
    namespace: string;
    err?: any;
}
export interface FetchAction extends SimpleAction {
    payload: FetchPayload;
    meta: FetchMeta;
}

export type ApiMethod = (...args: Array<any>) => Promise<any>;
export type FetchStart = (namespace: string, apiArgs?: Array<any>) => SimpleAction;
export type AfterFetch = (namespace: string, data?: any) => FetchAction;

export const FETCH_START: NamespacedActionType = namespace => `@@fetchable/${namespace}/FETCH_START`;
export const FETCH_DONE: NamespacedActionType = namespace => `@@fetchable/${namespace}/FETCH_DONE`;
export const FETCH_FINISHED: NamespacedActionType = namespace => `@@fetchable/${namespace}/FETCH_FINISHED`;
export const FETCH_ERROR: NamespacedActionType = namespace => `@@fetchable/${namespace}/FETCH_ERROR`;

export const fetchStart: FetchStart = (namespace: string, apiArgs?: any) => ({
    type: FETCH_START(namespace),
    meta: {namespace, apiArgs}
});
export const fetchFinished: AfterFetch = (namespace: string, data?: any) => ({
    type: FETCH_FINISHED(namespace),
    payload: {data},
    meta: {namespace}
});
export const fetchDone: AfterFetch = (namespace: string, data?: any) => ({
    type: FETCH_DONE(namespace),
    payload: {data},
    meta: {namespace}
});
export const fetchError: AfterFetch = (namespace: string, err?: any, data = undefined) => ({
    type: FETCH_ERROR(namespace),
    payload: {err, data},
    meta: {namespace, err}
});

export const doFetch = defineFetchActionCreator(fetchFinished);
export const fetchData = defineFetchActionCreator(fetchDone);

type FetchActionCreatorOptions = {
    before?: () => Action;
    after?: (result?: Array<Object>) => void;
    afterError?: (result?: any) => Action;
    form?: string;
    isFetchSuccess?: boolean;
    isFetchError?: boolean;
    isFetchStart?: boolean;
}

type DefineFetchActionCreatorResult = (
    namespace: string,
    options?: FetchActionCreatorOptions
) => (apiMethod: ApiMethod, ...args: Array<any>) => ThunkAction<Action, any>;
function defineFetchActionCreator(fetchSuccess: AfterFetch): DefineFetchActionCreatorResult {
    return (
        namespace,
        {
            before, after, afterError, form, isFetchSuccess = true, isFetchError = true, isFetchStart = true
        } = {}
    ) => (apiMethod, ...args) => dispatch => {
        if (isFetchStart) dispatch(fetchStart(namespace, args));
        if (before) dispatch(before());
        if (form) dispatch(startSubmit(form));
        return apiMethod(...args)
            .then((result: any) => {
                if (isFetchSuccess)dispatch(fetchSuccess(namespace, result));
                safeDispatch(after && after(result));
                safeDispatch(form && stopSubmit(form));
                return {result, args};
            })
            .catch((err: any) => {
                if (isFetchError)dispatch(fetchError(namespace, err));
                safeDispatch(afterError && afterError(err));
                safeDispatch(form && stopSubmit(form, err));
                return {result: err, error: true, args};
            });

        function safeDispatch(action: any) {
            if (action) {
                dispatch(action);
            }
        }
    };
}
