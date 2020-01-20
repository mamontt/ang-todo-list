/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {createSelector} from 'reselect';
import {memoize, get} from 'lodash';
import {join} from 'lodash/fp';
import {ROOT_NAMESPACE} from './../constants/root-namspace';

export type StoreType = {
    [ROOT_NAMESPACE]: string
}

const DEFAULT_ROOT_STATE = {};
// add a current active bundle store check to allow other streams use the VRKO reducers
export const rootSelector = (store: StoreType) => store[ROOT_NAMESPACE] || DEFAULT_ROOT_STATE;

const DEFAULT_DOMAIN = {};
export const getDomain = memoize(
    (domainFullName, defaultValue = DEFAULT_DOMAIN) => createSelector(
        rootSelector,
        currencyState => get(currencyState, domainFullName, defaultValue)
    ),
    join('')
);

type StateType = {
    bundle: {
        bundleName: string
    }
}

const getBundle = (state: StateType) => state.bundle;
export const bundleNameSelector = createSelector(getBundle, bundle => bundle.bundleName);
