/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {
    dateStringToISO,
    adjustValidISODate,
    isDateStringEmpty,
    isDateInvalid,
    transformDateToSupportIE
} from './date-formatter';

describe('Date formatter util', () => {
    describe('dateStringToISO', () => {
        test('should return iso string from YYYY-mm-dd string', () => {
            const date = '2017-01-30';
            const expected = new Date(Date.parse(date));
            expect(dateStringToISO(date)).toEqual(expected.toISOString());
        });
        test('should return empty string on empty iso', () => {
            expect(dateStringToISO('')).toEqual('');
        });
        test('should return empty string with wrong date', () => {
            expect(dateStringToISO('wrong-date')).toEqual('');
        });
    });
    describe('adjustValidISODate', () => {
        test('should return invalid date on empty iso', () => {
            expect(isDateInvalid(adjustValidISODate(''))).toBeTruthy();
        });
        test('should return date on correct iso string', () => {
            expect(adjustValidISODate('2017-06-10T00:00:00.000+0000')).toEqual(new Date(Date.UTC(2017, 5, 10, 0)));
        });
    });
    describe('isDateStringEmpty', () => {
        test('should return true on null string', () => {
            expect(isDateStringEmpty(null)).toBeTruthy();
        });
        test('should return true on undefined string', () => {
            expect(isDateStringEmpty(undefined)).toBeTruthy();
        });
        test('should return true on empty string', () => {
            expect(isDateStringEmpty('')).toBeTruthy();
        });
        test('should return false on non empty string', () => {
            expect(isDateStringEmpty('non empty')).toBeFalsy();
        });
    });
    describe('isDateInvalid', () => {
        test('should return false on correct date', () => {
            expect(isDateInvalid(new Date())).toBeFalsy();
        });
        test('should return true on incorrect date', () => {
            expect(isDateInvalid(new Date('Invalid date string'))).toBeTruthy();
        });
    });
    describe('transformDateToSupportIE', () => {
        test('should insert semicolon inside timezone code', () => {
            expect(transformDateToSupportIE('2017-06-10T00:00:00.000+0000')).toEqual('2017-06-10T00:00:00.000+00:00');
        });
        test('should return text without changes', () => {
            expect(transformDateToSupportIE('2017-06-10T00:00:00.000')).toEqual('2017-06-10T00:00:00.000');
        });
    });
});
