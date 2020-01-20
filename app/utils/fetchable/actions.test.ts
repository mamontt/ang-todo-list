/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {
    FETCH_START,
    FETCH_DONE,
    fetchStart,
    fetchDone,
    fetchFinished,
    fetchError
} from './actions';

describe('Fetchable action types', () => {
    const namespace = 'someNamespace';

    test('FETCH_START should return action type', () => {
        const expected = `@@fetchable/${namespace}/FETCH_START`;
        expect(FETCH_START(namespace)).toEqual(expected);
    });
    test('FETCH_DONE should return action type', () => {
        const expected = `@@fetchable/${namespace}/FETCH_DONE`;
        expect(FETCH_DONE(namespace)).toEqual(expected);
    });
    test('fetchStart should return action', () => {
        const type = `@@fetchable/${namespace}/FETCH_START`;
        const meta = {namespace};
        expect(fetchStart(namespace))
            .toEqual({type, meta});
    });
    test('fetchDone should return action', () => {
        const type = `@@fetchable/${namespace}/FETCH_DONE`;
        const payload = {
            data: [{something: 'here'}]
        };
        const meta = {namespace};
        expect(fetchDone(namespace, payload.data))
            .toEqual({type, payload, meta});
    });
    test('fetchFinished should return action', () => {
        const type = `@@fetchable/${namespace}/FETCH_FINISHED`;
        const payload = {
            data: [{something: 'here'}]
        };
        const meta = {namespace};
        expect(fetchFinished(namespace, payload.data))
            .toEqual({type, payload, meta});
    });
    test('fetchError should return action', () => {
        const type = `@@fetchable/${namespace}/FETCH_ERROR`;
        const payload = {
            err: [{something: 'here'}]
        };
        const meta = {namespace, err: payload.err};
        expect(fetchError(namespace, payload.err))
            .toEqual({type, payload, meta});
    });
});
