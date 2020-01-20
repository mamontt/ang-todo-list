/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {getExportUrl} from './urls';

jest.mock('redux-reducers-injector', () => ({
    injectReducer: () => {}
}));

describe('getExportUrl', () => {
    const defaultExportParams = {
        type: 'type',
        extension: 'extension',
        split: false,
        fields: 'f1,f2,f3',
        letterDirection: 'to-bank',
        isOfficial: false
    };

    it('letterDirection: toBank, isOfficial: false', () => {
        expect(
            getExportUrl('1,2,3', {...defaultExportParams, letterDirection: 'to-bank', isOfficial: false})
        ).toBe('/api/letters/letters/export-to-bank?ids=1,2,3&format=EXTENSION&type=TYPE&split=false&fields=f1,f2,f3');
    });
    it('letterDirection: fromBank, isOfficial: false', () => {
        expect(
            getExportUrl('1,2,3', {...defaultExportParams, letterDirection: 'from-bank', isOfficial: false})
        ).toBe('/api/letters/letters/export-from-bank?ids=1,2,3&format=EXTENSION&type=TYPE&split=false&fields=f1,f2,f3');
    });
    it('letterDirection: toBank, isOfficial: true', () => {
        expect(
            getExportUrl('1,2,3', {...defaultExportParams, letterDirection: 'to-bank', isOfficial: true})
        ).toBe('/api/letters/letters/employees/export-to-bank?ids=1,2,3&format=EXTENSION&type=TYPE&split=false&fields=f1,f2,f3');
    });
    it('letterDirection: fromBank, isOfficial: true', () => {
        expect(
            getExportUrl('1,2,3', {...defaultExportParams, letterDirection: 'from-bank', isOfficial: true})
        ).toBe('/api/letters/letters/employees/export-from-bank?ids=1,2,3&format=EXTENSION&type=TYPE&split=false&fields=f1,f2,f3');
    });
});
