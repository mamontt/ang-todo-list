/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {declensionInCountContext} from './declension';

describe('Declension util', () => {
    describe('nounDeclensionInCountContext', () => {
        const DECLENSIONS = {
            one: 'документ',
            from2to4: 'документа',
            from5to20: 'документов'
        };
        test('should return "from5to20" case', () => {
            const data = [0, 5, 10, 11, 14, 126];
            data.forEach((count: number) =>
                expect(declensionInCountContext(count, DECLENSIONS)).toEqual(DECLENSIONS.from5to20));
        });
        test('should return "one" case', () => {
            const data = [1, 21, 131];
            data.forEach((count: number) =>
                expect(declensionInCountContext(count, DECLENSIONS)).toEqual(DECLENSIONS.one));
        });
        test('should return "from2to4" case', () => {
            const data = [2, 3, 4, 22, 43, 54, 103, 172];
            data.forEach((count: number) =>
                expect(declensionInCountContext(count, DECLENSIONS)).toEqual(DECLENSIONS.from2to4));
        });
    });
});
