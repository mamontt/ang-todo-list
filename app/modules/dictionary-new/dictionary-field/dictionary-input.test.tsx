/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2018 VTB Group. All rights reserved.
 */

describe('DictionaryInput', () => {
    it.skip('TODO refactor test', () => {
    });
});

// import * as React from 'react';
// import {mount} from 'enzyme';
//
// import {DictionaryInputClass} from './dictionary-input';
//
// const singleOption = [{
//     id: 1,
//     shortName: 'test1'
// }];
//
// const multipleOptions = [{
//     id: 1,
//     shortName: 'test1'
// },
// {
//     id: 2,
//     shortName: 'test2'
// }];
//
// const renderDictionaryInput = (props: any) => {
//     const putDictionaryToStore = jest.fn();
//     const onChange = jest.fn();
//     const wrapper = mount(<DictionaryInputClass
//         dictionaryName="dictionaryName"
//         putDictionaryToStore={putDictionaryToStore}
//         onChange={onChange}
//         {...props}
//     />);
//     return wrapper;
// };
//
// describe('DictionaryInput test mount', () => {
//     it('should call putDictionaryToStore once', () => {
//         const DictionaryInputClassWrapper = renderDictionaryInput({});
//         expect(DictionaryInputClassWrapper.props().putDictionaryToStore).toHaveBeenCalled();
//         expect(DictionaryInputClassWrapper.props().putDictionaryToStore.mock.calls.length).toBe(1);
//         DictionaryInputClassWrapper.setProps({items: multipleOptions});
//         expect(DictionaryInputClassWrapper.props().putDictionaryToStore.mock.calls.length).toBe(1);
//     });
// });
//
// describe('DictionaryInput {autoSelectSingleOption=false} test mount', () => {
//     it('should not call onChange if items length is 1', () => {
//         const DictionaryInputClassWrapper = renderDictionaryInput({items: singleOption});
//         expect(DictionaryInputClassWrapper.props().onChange.mock.calls.length).toBe(0);
//     });
//     it('should not call onChange if items length is not 1', () => {
//         const DictionaryInputClassWrapper = renderDictionaryInput({items: multipleOptions});
//         expect(DictionaryInputClassWrapper.props().onChange.mock.calls.length).toBe(0);
//     });
// });
//
// describe('DictionaryInput {autoSelectSingleOption=true} test mount', () => {
//     it('should call onChange after set items length 1', () => {
//         const DictionaryInputClassWrapper = renderDictionaryInput({
//         items: singleOption, autoSelectSingleOption: true
//     });
//         expect(DictionaryInputClassWrapper.props().onChange.mock.calls.length).toBe(1);
//     });
//     it('should not call onChange after set items length 1 if value set', () => {
//         const DictionaryInputClassWrapper = renderDictionaryInput({
//         items: singleOption, autoSelectSingleOption: true, value: {name: 'DummyValue', id: 21}
//     });
//         expect(DictionaryInputClassWrapper.props().onChange.mock.calls.length).toBe(0);
//     });
//     it('should not call onChange after set items length not 1', () => {
//         const DictionaryInputClassWrapper = renderDictionaryInput(
//             {items: multipleOptions, autoSelectSingleOption: true}
//         );
//         expect(DictionaryInputClassWrapper.props().onChange.mock.calls.length).toBe(0);
//     });
// });
//
// describe('DictionaryInput {autoSelectSingleOption=false} test change items', () => {
//     let DictionaryInputClassWrapper: any;
//     beforeEach(() => {
//         DictionaryInputClassWrapper = renderDictionaryInput({});
//     });
//     it('should call onChange after set items length 1', () => {
//         expect(DictionaryInputClassWrapper.props().onChange.mock.calls.length).toBe(0);
//         DictionaryInputClassWrapper.setProps({items: singleOption});
//         expect(DictionaryInputClassWrapper.props().onChange.mock.calls.length).toBe(0);
//     });
//     it('should not call onChange after set items length not 1', () => {
//         expect(DictionaryInputClassWrapper.props().onChange.mock.calls.length).toBe(0);
//         DictionaryInputClassWrapper.setProps({items: multipleOptions});
//         expect(DictionaryInputClassWrapper.props().onChange.mock.calls.length).toBe(0);
//     });
// });
//
// describe('DictionaryInput {autoSelectSingleOption=true} test change items', () => {
//     let DictionaryInputClassWrapper: any;
//     beforeEach(() => {
//         DictionaryInputClassWrapper = renderDictionaryInput({autoSelectSingleOption: true});
//     });
//     it('should call onChange after set items length 1', () => {
//         expect(DictionaryInputClassWrapper.props().onChange.mock.calls.length).toBe(0);
//         DictionaryInputClassWrapper.setProps({items: singleOption});
//         expect(DictionaryInputClassWrapper.props().onChange.mock.calls.length).toBe(1);
//     });
//     it('should not call onChange after set items length not 1', () => {
//         expect(DictionaryInputClassWrapper.props().onChange.mock.calls.length).toBe(0);
//         DictionaryInputClassWrapper.setProps({items: multipleOptions});
//         expect(DictionaryInputClassWrapper.props().onChange.mock.calls.length).toBe(0);
//     });
//     it('should call onChange once for equals items', () => {
//         expect(DictionaryInputClassWrapper.props().onChange.mock.calls.length).toBe(0);
//         DictionaryInputClassWrapper.setProps({items: singleOption});
//         DictionaryInputClassWrapper.setProps({items: singleOption});
//         expect(DictionaryInputClassWrapper.props().onChange.mock.calls.length).toBe(1);
//     });
//     it('should not call onChange if value set', () => {
//         expect(DictionaryInputClassWrapper.props().onChange.mock.calls.length).toBe(0);
//         DictionaryInputClassWrapper.setProps({value: {name: 'DummyValue', id: 21}});
//         DictionaryInputClassWrapper.setProps({items: singleOption});
//         expect(DictionaryInputClassWrapper.props().onChange.mock.calls.length).toBe(0);
//     });
// });
//
// describe('When DictionaryInputClass is creating with some property "value" and empty "items"', () => {
//     let input: any;
//     beforeAll(() => {
//         input = renderDictionaryInput({
//             items: [],
//             value: {name: 'DummyValue', id: 21}
//         });
//     });
//
//     it('changes own state to items with value as single element', () => {
//         expect(input.state()).toMatchSnapshot();
//     });
//
//     describe('and then changing "items" property to items with single option item', () => {
//         beforeAll(() => {
//             input.setProps({items: singleOption});
//         });
//
//         it('changes own state to items with single option', () => {
//             expect(input.state()).toMatchSnapshot();
//         });
//     });
// });
//
// describe('When DictionaryInputClass is creating with some property "value" and single option "items"', () => {
//     let input: any;
//     beforeAll(() => {
//         input = renderDictionaryInput({
//             items: singleOption,
//             value: {name: 'DummyValue', id: 21}
//         });
//     });
//
//     it('changes own state to items with single option', () => {
//         expect(input.state()).toMatchSnapshot();
//     });
// });
