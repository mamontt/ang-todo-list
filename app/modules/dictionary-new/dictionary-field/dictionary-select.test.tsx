/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2018 VTB Group. All rights reserved.
 */
describe('DictionaryInput', () => {
    it.skip('TODO refactor test', () => {
    });
});

// import * as React from 'react';
// import {shallow} from 'enzyme';
// import {isFunction, mapValues, set} from 'lodash';
// import {noop} from '@vtb/services/utils';
// import {Select} from '@vtb/fe-ui-select';
// import {DictionarySelectClass} from './dictionary-select';
// import {DICTIONARY_DESCRIPTORS} from '../dictionary-descriptors';
//
// jest.mock('../dictionary-descriptors', () => ({
//     DICTIONARY_DESCRIPTORS: {}
// }));
//
// describe('Given DictionarySelectClass', () => {
//     let wrapper: any;
//     const defProps: any = ({...otherProps}) => mapValues({
//         autoSelectSingleOption: true,
//         putDictionaryToStore: noop,
//         dictionaryName: 'dummyDictionaryName',
//         onChange: noop,
//         ...otherProps
//     }, (value, key) => (isFunction(value) ? jest.fn(value).mockName(key) : value));
//
//     describe('When component is rendering with default properties', () => {
//         beforeAll(() => {
//             wrapper = shallow(<DictionarySelectClass {...defProps({})} />);
//         });
//
//         it('renders empty items and calls putDictionaryToStore once', () => {
//             expect(wrapper).toMatchSnapshot();
//         });
//
//         it('does not call onChange property for empty items', () => {
//             expect(wrapper.instance().props.onChange).not.toHaveBeenCalled();
//         });
//
//         describe('and then is changing the value property', () => {
//             beforeAll(() => {
//                 wrapper.instance().props.onChange.mockClear();
//                 wrapper.setProps({value: { id: 'dummyId' }});
//             });
//
//             it('renders items with single element from value property', () => {
//                 expect(wrapper).toMatchSnapshot();
//             });
//
//             it('does not call onChange property for not changed items', () => {
//                 expect(wrapper.instance().props.onChange).not.toHaveBeenCalled();
//             });
//         });
//     });
//
//     describe('When dictionary description is initializing with fieldToDisplay property ' +
//         'and then component is rendering', () => {
//         beforeAll(() => {
//             const props = defProps({
//                 value: {
//                     id: 'dummyId',
//                     titleField: 'dummyTitleField'
//                 }
//             });
//             set(DICTIONARY_DESCRIPTORS, props.dictionaryName, {
//                 fieldToDisplay: 'titleField'
//             });
//             wrapper = shallow(<DictionarySelectClass {...props} />);
//         });
//
//         it('renders items with one element with title from fieldToDisplay field in value property', () => {
//             expect(wrapper).toMatchSnapshot();
//         });
//
//         describe('and then is switching on showing description', () => {
//             beforeAll(() => {
//                 wrapper.setProps({showDescription: true});
//             });
//
//             it('renders items with valueText from the id field', () => {
//                 expect(wrapper).toMatchSnapshot();
//             });
//
//             describe('and then is changing value and showDescription properties', () => {
//                 beforeAll(() => {
//                     wrapper.setProps({
//                         value: {
//                             id: 'dummyId',
//                             titleField: 'dummyTitleField',
//                             codeField: 'dummyCodeField'
//                         },
//                         showDescription: 'codeField'
//                     });
//                 });
//
//                 it('renders items with valueText from showDescription field in value property', () => {
//                     expect(wrapper).toMatchSnapshot();
//                 });
//
//                 describe('and then is passing items property with 3 elements', () => {
//                     beforeAll(() => {
//                         wrapper.instance().props.onChange.mockClear();
//                         wrapper.setProps({
//                             items: Array.from(Array(3).keys()).map(id => ({
//                                 id,
//                                 titleField: `dummyTitleField for ${id}`,
//                                 codeField: `dummyCodeField for ${id}`
//                             }))
//                         });
//                     });
//
//                     it('renders 3 items', () => {
//                         expect(wrapper).toMatchSnapshot();
//                     });
//
//                     it('does not call onChange property for more then one element in items', () => {
//                         expect(wrapper.instance().props.onChange).not.toHaveBeenCalled();
//                     });
//
//                     describe('and then calling onChange property in Select component with id = 1', () => {
//                         beforeAll(() => {
//                             wrapper.instance().props.onChange.mockClear();
//                             wrapper.find(Select).props().onChange(1);
//                         });
//
//                         it('calls onChange property once with original item for id = 1', () => {
//                             expect(wrapper.instance().props.onChange).toMatchSnapshot();
//                         });
//                     });
//                 });
//             });
//         });
//     });
//
//     describe('When component is rendering with one element in items property and value property', () => {
//         beforeAll(() => {
//             const props = defProps({
//                 fieldToDisplay: 'title',
//                 items: [{ id: 'dummyId', title: 'dummyTitle'}],
//                 value: {id: 'dummyValueId'}
//             });
//             wrapper = shallow(<DictionarySelectClass {...props} />);
//         });
//
//         it('does not call onChange property for empty items', () => {
//             expect(wrapper.instance().props.onChange).not.toHaveBeenCalled();
//         });
//
//         describe('and then is setting the value property to null', () => {
//             beforeAll(() => {
//                 wrapper.instance().props.onChange.mockClear();
//                 wrapper.setProps({value: null});
//             });
//
//             it('calls onChange property once with the single item from items', () => {
//                 expect(wrapper.instance().props.onChange).toMatchSnapshot();
//             });
//         });
//
//         describe('and then is resetting the value property', () => {
//             beforeAll(() => {
//                 wrapper.instance().props.onChange.mockClear();
//                 wrapper.setProps({value: undefined});
//             });
//
//             it('calls onChange property once with the single item from items', () => {
//                 expect(wrapper.instance().props.onChange).toMatchSnapshot();
//             });
//
//             describe('and then changing items property', () => {
//                 beforeAll(() => {
//                     wrapper.instance().props.onChange.mockClear();
//                     wrapper.setProps({ items: [{ id: 'otherDummyId', title: 'otherDummyTitle'}] });
//                 });
//
//                 it('calls onChange property once with the other single item from items', () => {
//                     expect(wrapper.instance().props.onChange).toMatchSnapshot();
//                 });
//
//                 describe('and then changing items property to empty array with value property', () => {
//                     beforeAll(() => {
//                         wrapper.instance().props.onChange.mockClear();
//                         wrapper.setProps({ items: [], value: { id: 'valueDummyId', title: 'valueDummyTitle'} });
//                     });
//
//                     it('does not call onChange property', () => {
//                         expect(wrapper.instance().props.onChange).not.toHaveBeenCalled();
//                     });
//                 });
//             });
//         });
//     });
// });
