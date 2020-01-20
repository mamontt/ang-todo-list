/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {fetchStart, fetchFinished, fetchDone, fetchError} from './../../utils/fetchable';
import {loaderReducer} from './loader-reducer';

describe('Loader reducer', () => {
    const INITIAL_STATE = {};

    test('should respond to fetchStart and set true state to passed namespace', () => {
        const namespace = 'some-fetch-namespace';
        const action = fetchStart(namespace, null);

        const state = loaderReducer(INITIAL_STATE, action);
        expect(state).toHaveProperty(namespace, true);
    });

    test('should respond to fetchDone and set false state to passed namespace', () => {
        const namespace = 'some-fetch-namespace';
        const startAction = fetchStart(namespace, null);

        const startState = loaderReducer(INITIAL_STATE, startAction);
        const action = fetchDone(namespace, {});
        const state = loaderReducer(startState, action);
        expect(state).toHaveProperty(namespace, false);
    });

    test('should respond to fetchFinished and set false state to passed namespace', () => {
        const namespace = 'some-fetch-namespace';
        const startAction = fetchStart(namespace, null);

        const startState = loaderReducer(INITIAL_STATE, startAction);
        const action = fetchFinished(namespace, {});
        const state = loaderReducer(startState, action);
        expect(state).toHaveProperty(namespace, false);
    });

    test('should respond to fetchError and set false state to passed namespace', () => {
        const namespace = 'some-fetch-namespace';
        const startAction = fetchStart(namespace, null);

        const startState = loaderReducer(INITIAL_STATE, startAction);
        const action = fetchError(namespace, {});
        const state = loaderReducer(startState, action);
        expect(state).toHaveProperty(namespace, false);
    });
});
