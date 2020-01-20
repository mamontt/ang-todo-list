/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import reducer from './reducer';
import * as A from './actions';

const namespace = 'someNamespace';

describe('Fetchable reducer', () => {
    test('default should return new reducer function', () => {
        expect(typeof reducer(namespace)).toEqual('function');
    });

    const preparedReducer = reducer(namespace);

    describe('fetchDone', () => {
        test('fetchDone should set fetched data', () => {
            const initialState: Array<Object> = [];
            const response = {data: [{newElement: 'here'}]};
            const newState = preparedReducer(initialState, A.fetchDone(namespace, response.data));
            expect(newState).toEqual([...response.data]);
        });
        test('fetchDone should set fetched data if contentPath presented', () => {
            const preparedReducerWithContentPath = reducer(namespace, {contentPath: 'content'});
            const initialState: Array<Object> = [];
            const response = {data: {content: [{newElement: 'here'}]}};
            const newState = preparedReducerWithContentPath(initialState,
                A.fetchDone(namespace, response.data));
            expect(newState).toEqual([...response.data.content]);
        });
        test('fetchDone should not set any data if contentPath presented not exist', () => {
            const preparedReducerWithContentPath = reducer(namespace, {contentPath: 'unexpected'});
            const initialState: Array<Object> = [];
            const response = {data: {content: [{newElement: 'here'}]}};
            const newState = preparedReducerWithContentPath(initialState,
                A.fetchDone(namespace, response.data));
            expect(newState).toEqual(initialState);
        });
        test('should set initial state if presented', () => {
            const initialState = [{s: 'state'}];
            const preparedReducerWithContentPath = reducer(
                namespace, {initialState, contentPath: 'unexpected'}
            );
            const newState = preparedReducerWithContentPath(initialState,
                A.fetchDone(namespace, null));
            expect(newState).toEqual(initialState);
        });
    });

    describe('fetchError', () => {
        test('should not set any data if error presented', () => {
            const initialState = [{another: 'element'}, {one: 'more'}];
            const newState = preparedReducer(initialState, A.fetchError(namespace, {message: 'something'}));
            expect(newState).toEqual(initialState);
        });
    });
});
