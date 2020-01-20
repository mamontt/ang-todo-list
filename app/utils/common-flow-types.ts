/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
/*
 A = simple or 'thunk action.
 We can not use https://github.com/reactjs/redux/blob/master/flow-typed/redux.js
 because we use thunk.
 */
export type Dispatch<A> = (action: A) => A;

export interface SimpleAction {
    type: string;
    meta?: {
        namespace?: string;
    };
}

export type NamespacedActionType = (namespace: string) => string;

export type ThunkAction<A, S> = (dispatch: Dispatch<A>, getState: () => S) => void;

export type Action = (SimpleAction | ThunkAction<any, any>);

export type ActionCreator = (...params: Array<any>) => Action;
