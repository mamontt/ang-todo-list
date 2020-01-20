/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {ComponentType} from 'react';
import {createStore} from 'redux';
import {mount} from 'enzyme';
import {formFetchAndClear} from './form-fetch-and-clear';
import {StoreType} from '../../store/root-selector';

describe('formFetchAndClearHOC', () => {
    const fetch = jest.fn(() => ({type: 'fetch'}));
    const clear = jest.fn(() => ({type: 'clear'}));

    const Component = () => (<div />);

    afterEach(() => {
        fetch.mockClear();
        clear.mockClear();
    });
    const store = createStore((state: StoreType) => state);
    const FormFetchAndClear: ComponentType<any> = formFetchAndClear(fetch, clear)(Component);

    test('must NOT dispatch clear action at componentWillMount if documentId is Number', () => {
        mount(<FormFetchAndClear store={store} documentId={2} />);
        expect(clear).not.toHaveBeenCalled();
    });
    test('must dispatch clear action if component will unmount', () => {
        const wrapper = mount(<FormFetchAndClear store={store} documentId={2} />);
        wrapper.unmount();
        expect(clear).toHaveBeenCalledTimes(1);
    });
    test('must dispatch fetch action with documentId param if documentId is set', () => {
        mount(<FormFetchAndClear store={store} documentId={2} letterDirection="to-bank" />);
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenLastCalledWith(2, 'to-bank');
    });
    test('must dispatch fetch action with documentId param if documentId have been changed', () => {
        const wrapper = mount(<FormFetchAndClear store={store} />);
        wrapper.setProps({documentId: 2, letterDirection: 'to-bank'});
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenLastCalledWith(2, 'to-bank');
    });
});
