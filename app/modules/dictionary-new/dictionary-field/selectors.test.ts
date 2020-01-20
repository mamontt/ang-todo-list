/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2018 VTB Group. All rights reserved.
 */
import {OFFICIALS} from '../dictionary-names';
import {getFormattedSelectItems, getIdField} from './selectors';

describe('Given dictionary-field selectors', () => {
    const items = [{
        id: 'firstDummyId',
        code: 'firstCode',
        description: 'firstDescription'
    }, {
        id: 'secondDummyId',
        code: 'secondCode',
        description: 'secondDescription'
    }];
    let reSelector = getFormattedSelectItems();
    let genTestCase: any = ({...override}) => ({
        dictionaryName: OFFICIALS,
        fieldToDisplay: 'code',
        showDescription: false,
        ...override,
        reSelector,
        reSelectorName: (getFormattedSelectItems as any).name
    });
    [
        genTestCase({}),
        genTestCase({value: { id: 'dummyValueId', code: 'dummyValueCode', description: 'dummyValueDescription'}}),
        genTestCase({items}),
        genTestCase({items, value: { id: 'dummyValueId', code: 'dummyValueCode', description: 'dummyValueDescription'}}),
        genTestCase({items, showDescription: 'description'}),
        genTestCase({items, dictionaryName: 'unknown'}),
        genTestCase({items, fieldToDisplay: 'unknown'}),
        genTestCase({items, showDescription: 'unknown' })
    ].map((testCase, index) =>
        describe(`when ${testCase.reSelectorName} is calling for test case ${index}`, () => {
            it('returns expected data', () => {
                expect(testCase.reSelector(testCase)).toMatchSnapshot();
            });
        }));

    reSelector = getIdField();

    genTestCase = ({...override}) => ({
        ...override,
        reSelector,
        reSelectorName: getIdField.name
    });
    [
        genTestCase({}),
        genTestCase({dictionaryName: OFFICIALS})
    ].map((testCase, index) =>
        describe(`when ${testCase.reSelectorName} is calling for test case ${index}`, () => {
            it('returns expected data', () => {
                expect(testCase.reSelector(testCase)).toMatchSnapshot();
            });
        }));
});
