/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {memoize, get, isEmpty} from 'lodash';
import {getDomain, StoreType} from './../../../store/root-selector';

// TODO [Andrei_Paramoshkin] 8/18/2017 Use selectors!
export const getValidationErrors = memoize((namespace: string) =>
    (state: StoreType) =>
        get(getDomain(namespace)(state), 'validationInspector.validationErrors'));

export const getValidationWarnings = memoize((namespace: string) =>
    (state: StoreType) =>
        get(getDomain(namespace)(state), 'validationInspector.validationWarnings'));

export const isValidationMessagesEmpty = memoize((namespace: string) =>
    (state: StoreType) =>
        isEmpty(getValidationErrors(namespace)(state)) && isEmpty(getValidationWarnings(namespace)(state)));

export const isValidationInspectorVisible = memoize((namespace: string) =>
    (state: StoreType) =>
        !isValidationMessagesEmpty(namespace)(state) &&
        get(getDomain(namespace)(state), 'validationInspector.visible', false));
