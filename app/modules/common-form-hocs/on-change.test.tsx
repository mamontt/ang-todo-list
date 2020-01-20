/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {mount} from 'enzyme';
import {onChange} from './on-change';

describe('onChangeHOC', () => {
    const callback = jest.fn();

    const observed = 'observed';
    const multiObservedFields = ['firstField', 'secondField'];
    const otherProps = {other1: 1, other2: '2'};
    const observedWithOtherProps = {observed, ...otherProps};
    const multiObservedWithOtherProps = {multiObservedFields, ...otherProps};
    const Component = (props: {observed: string}) => (<div>{props.observed}</div>);

    afterEach(() => {
        callback.mockReset();
    });

    const WithOnChange = onChange([observed], callback)(Component);
    const WithMultiOnChange = onChange(multiObservedFields, callback)(Component);

    test('must NOT call listener if observed property is NOT set', () => {
        mount(<WithOnChange {...otherProps} />);
        expect(callback).not.toHaveBeenCalled();
    });
    test('must call listener once if observed property is initially set', () => {
        mount(<WithOnChange {...observedWithOtherProps} />);
        expect(callback).toHaveBeenCalledTimes(1);
        mount(<WithOnChange {...{...observedWithOtherProps, observed: null}} />);
        expect(callback).toHaveBeenCalledTimes(2);
        mount(<WithOnChange {...{...observedWithOtherProps, observed: undefined}} />);
        expect(callback).toHaveBeenCalledTimes(3);
        mount(<WithOnChange {...{...observedWithOtherProps, observed: false}} />);
        expect(callback).toHaveBeenCalledTimes(4);
    });
    test('must call listener with initial props if observed property is initially set', () => {
        mount(<WithOnChange {...observedWithOtherProps} />);
        expect(callback).toHaveBeenCalledWith(observedWithOtherProps, null, expect.anything());
    });
    test('must NOT call listener if observed property is NOT changed, but some other prop is changed', () => {
        const wrapper = mount(<WithOnChange {...otherProps} />);
        wrapper.setProps({...otherProps, other1: 10});
        expect(callback).not.toHaveBeenCalled();
    });
    test('must call listener if observed property have been changed', () => {
        const wrapper = mount(<WithOnChange {...otherProps} />);
        wrapper.setProps({...observedWithOtherProps, observed: 'changed'});
        expect(callback).toHaveBeenCalledTimes(1);
        wrapper.setProps({...observedWithOtherProps, observed: null});
        expect(callback).toHaveBeenCalledTimes(2);
        wrapper.setProps({...observedWithOtherProps, observed: false});
        expect(callback).toHaveBeenCalledTimes(3);
        wrapper.setProps({...observedWithOtherProps, observed: undefined});
        expect(callback).toHaveBeenCalledTimes(4);
    });
    test('must call listener with nextProps props if observed property have been changed', () => {
        const wrapper = mount(<WithOnChange {...observedWithOtherProps} />);
        const nextProps = {...observedWithOtherProps, observed: 'changed'};
        const oldProps = {...observedWithOtherProps};
        wrapper.setProps(nextProps);
        expect(callback).toHaveBeenLastCalledWith(nextProps, oldProps, expect.anything());
    });
    test('must call listener if one of observed properties have been changed', () => {
        const wrapper = mount(<WithMultiOnChange {...otherProps} />);
        wrapper.setProps({...observedWithOtherProps, firstField: 'changed'});
        expect(callback).toHaveBeenCalledTimes(1);
        wrapper.setProps({...observedWithOtherProps, firstField: null});
        expect(callback).toHaveBeenCalledTimes(2);
        wrapper.setProps({...observedWithOtherProps, firstField: false});
        expect(callback).toHaveBeenCalledTimes(3);
        wrapper.setProps({...observedWithOtherProps, firstField: undefined});
        expect(callback).toHaveBeenCalledTimes(4);
    });
    test('must call listener with nextProps props if one of observed properties have been changed', () => {
        const wrapper = mount(<WithMultiOnChange {...multiObservedWithOtherProps} />);
        const nextProps = {...multiObservedWithOtherProps, firstField: 'changed'};
        const oldProps = {...multiObservedWithOtherProps};
        wrapper.setProps(nextProps);
        expect(callback).toHaveBeenLastCalledWith(nextProps, oldProps, expect.anything());
    });
    test('must call listener once if both observed properties have been changed', () => {
        const wrapper = mount(<WithMultiOnChange {...otherProps} />);
        wrapper.setProps({...observedWithOtherProps, firstField: 'changed', secondField: 'changed'});
        expect(callback).toHaveBeenCalledTimes(1);
    });
});
