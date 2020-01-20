/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {
    toNumberDP,
    toAmount,
    toNumberDPInput,
    toNumberDPRequest,
    splitNumberDPToPartsObject,
    amountFormatter,
    bytesToReadable,
    bankAccountToGroups,
    splitStingByGroups
} from './number-formatter';

describe('Number formatter util', () => {
    describe('toNumberDP', () => {
        test('toNumberDP format number to deal passport contract number', () => {
            const input = '123456781234123411';
            expect(toNumberDP(input)).toEqual('12345678/1234/1234/1/1');
        });
    });
    describe('toAmount', () => {
        test('toAmount with empty number returns empty undefined', () => {
            expect(toAmount('')).toEqual('');
        });
        test('toAmount format number to deal passport amount format with 0', () => {
            const input = '0';
            expect(toAmount(input)).toEqual('0.00');
        });
        test('toAmount format number to deal passport amount format with 100', () => {
            const input = '100';
            expect(toAmount(input)).toEqual('100.00');
        });
        test('toAmount should work correct on a negative number', () => {
            const input = '-123123123.123123';
            expect(toAmount(input)).toEqual('-123 123 123.12');
        });
        test('toAmount should round correct on a negative number', () => {
            const input = '-123123123.129';
            expect(toAmount(input)).toEqual('-123 123 123.13');
        });
        test('toAmount should correct calculate integer part on a negative number', () => {
            const input = '-123123123.999';
            expect(toAmount(input)).toEqual('-123 123 124.00');
        });
        test('toAmount format number to deal passport amount format with 40000', () => {
            const input = '40000';
            expect(toAmount(input)).toEqual('40 000.00');
        });
        test('toAmount format number to deal passport amount format with 0,35', () => {
            const input = '0.35';
            expect(toAmount(input)).toEqual('0.35');
        });
        test('toAmount format number to deal passport amount format with 0,35', () => {
            const input = '10.5';
            expect(toAmount(input)).toEqual('10.50');
        });
        test('toAmount format number to deal passport amount format with 200,35', () => {
            const input = '200.35';
            expect(toAmount(input)).toEqual('200.35');
        });
        test('toAmount format number to deal passport amount format with 20000,35', () => {
            const input = '20000.35';
            expect(toAmount(input)).toEqual('20 000.35');
        });
        test('toAmount should floor decimals to 00', () => {
            const input = '10.999';
            expect(toAmount(input)).toEqual('11.00');
        });
        test('toAmount should floor decimals to greater', () => {
            const input = '20000.006';
            expect(toAmount(input)).toEqual('20 000.01');
        });
        test('toAmount should floor decimals to lower', () => {
            const input = '20000.002';
            expect(toAmount(input)).toEqual('20 000.00');
        });
        test('toAmount should number on numberString', () => {
            const input = '20000,002';
            expect(toAmount(input)).toEqual('20 000.00');
        });
        test('toAmount should floor decimals to greater', () => {
            const input = '100.225';
            expect(toAmount(input)).toEqual('100.23');
        });
        test('toAmount should return correct number', () => {
            const input = '123456789012345';
            expect(toAmount(input)).toEqual('123 456 789 012 345.00');
        });
        test('toAmount should be signed if input is less than zero', () => {
            const input = '-123456789012345';
            expect(toAmount(input)).toEqual('-123 456 789 012 345.00');
        });
        test('toAmount should not add decimal part if decimal flag set to false', () => {
            const input = '123456';
            expect(toAmount(input, false)).toEqual('123 456');
        });
    });
    describe('bankAccountToGroups', () => {
        test('bankAccountToGroups should split account number by space', () => {
            expect(bankAccountToGroups('40702810300030002864', ' ')).toEqual('40702 810 3 0003 0002864');
        });
    });
    describe('splitStingByGroups', () => {
        test('splitStingByGroups should split string to several string using group sizing', () => {
            expect(splitStingByGroups('123456789', [2, 3, 4])).toEqual(['12', '345', '6789']);
        });
        test('splitStingByGroups should ignore tail which "does not have" group ', () => {
            expect(splitStingByGroups('123456789', [2, 3])).toEqual(['12', '345']);
        });
        test('splitStingByGroups should return shorter or empty group if string dose not have enough chars', () => {
            expect(splitStingByGroups('123456', [2, 3, 5, 7])).toEqual(['12', '345', '6', '']);
        });
        test('splitStingByGroups should treat null as an empty string', () => {
            expect(splitStingByGroups(null, [2, 3, 5])).toEqual(['', '', '']);
        });
        test('splitStingByGroups should treat undefined as an empty string', () => {
            expect(splitStingByGroups(undefined, [2, 3, 5])).toEqual(['', '', '']);
        });
    });
    describe('toNumberDPInput', () => {
        test('toNumberDPInput format DP string to input string', () => {
            const input = '12//32//2';
            expect(toNumberDPInput(input)).toEqual('12______/____/32__/_/2');
        });
        test('toNumberDPInput format DP string to input string with custom filler', () => {
            const input = '/32//2/';
            expect(toNumberDPInput(input, '-')).toEqual('--------/32--/----/2/-');
        });
    });
    describe('toNumberDPRequest', () => {
        test('toNumberDPInput format DP input to request format', () => {
            const input = '12______/____/32__/_/2';
            expect(toNumberDPRequest(input)).toEqual('12//32//2');
        });
        test('toNumberDPRequest format empty DP string to input string with custom filler', () => {
            expect(toNumberDPRequest('')).toEqual('////');
        });
    });
    describe('amountFormatter', () => {
        test('amountFormatter should return correct format string', () => {
            const testedData = ['0.123', '...12sdase3', 'sdasdasd0.123weqeq', ',123454,32', '.,12'];
            testedData.forEach((item) => {
                expect(amountFormatter(item)).toEqual('0.12');
            });
        });

        test('amountFormatter should return correct format string (0.) ', () => {
            const testedData = ['0.', '0.', '.', ',', '0,,', '0..', '..', 'x.'];
            testedData.forEach((item) => {
                expect(amountFormatter(item)).toEqual('0.');
            });
        });
    });
    describe('splitNumberDPToPartsObject', () => {
        test('splitNumberDPToPartsObject should return object with parts of number DP', () => {
            const expected = {
                part1: '11111111',
                part2: '2222',
                part3: '3333',
                part4: '4',
                part5: '5'
            };
            expect(splitNumberDPToPartsObject(
                `${expected.part1}/${expected.part2}/${expected.part3}/${expected.part4}/${expected.part5}`
            )).toEqual(expected);
        });
    });
    describe('bytesToReadable', () => {
        test('bytesToReadable should return bytes if less than 1024', () => {
            const bytes = 302;
            const expected = '302 Б';
            expect(bytesToReadable(bytes)).toEqual(expected);
        });
        test('bytesToReadable should return rounded kilobytes to less', () => {
            const bytes = 5230;
            const expected = '5 Кб';
            expect(bytesToReadable(bytes)).toEqual(expected);
        });
        test('bytesToReadable should return rounded kilobytes to great', () => {
            const bytes = 5800;
            const expected = '5 Кб';
            expect(bytesToReadable(bytes)).toEqual(expected);
        });
        test('bytesToReadable should return rounded megabytes to great', () => {
            const bytes = 50000800;
            const expected = '47 Мб';
            expect(bytesToReadable(bytes)).toEqual(expected);
        });
    });
});
