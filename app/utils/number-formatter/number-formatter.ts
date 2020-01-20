/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {isEmpty, padStart, isNil, times, constant, take} from 'lodash';

const FRAC_SEP = '.';
const FRAC_LENGTH = 2;
const FRAC_BASE = 10 ** FRAC_LENGTH;

export function toAmount(amount: string, decimal: boolean = true): string {
    return decimal ? toDecimalAmount(amount) : toIntegerAmount(amount);
}

function toDecimalAmount(amount: string): string {
    const number = parseFloat(amount);

    if (Number.isNaN(number)) {
        return String(amount);
    }
    const roundNumber = Math.abs(roundToFrac(number));
    return `${formatSign(number)}${formatInt(Math.floor(roundNumber))}${FRAC_SEP}${formatFrac(calcFrac(roundNumber))}`;
}

function toIntegerAmount(amount: string): string {
    const number = parseInt(amount, 10);

    if (Number.isNaN(number)) {
        return String(amount);
    }
    return `${formatSign(number)}${formatInt(number)}`;
}

export function splitStingByGroups(
    str: string,
    groupsSizes: Array<number>,
    prevResult: Array<string> = []
): Array<string> {
    if (isNil(str)) {
        return splitStingByGroups('', groupsSizes, prevResult);
    }
    if (groupsSizes.length === 0) {
        return prevResult;
    }
    const [groupSize, ...restGroupsSizes] = groupsSizes;
    const result = [...prevResult, str.substr(0, groupSize)];
    return splitStingByGroups(str.substr(groupSize), restGroupsSizes, result);
}

/**
 * Format 18 digits numeric string to deal passport contract number
 * e.g. 123456781234123412 -> 12345678/1234/1234/1/2
 * @param numDP
 * @returns {string}
 */
export function toNumberDP(numDP: string): string {
    return `${numDP || ''}`
        .split('')
        .map((el, ind) => ([8, 12, 16, 17].indexOf(ind) !== -1 ? `/${el}` : el))
        .join('');
}

/**
 * Re-format 18 digits numeric string for output in printed doc and text inputs.
 * @param numDP
 * @param {string} filler
 * @returns {string}
 */
export function toNumberDPInput(numDP: string, filler: string = '_'): string {
    const dealPassportNumber = isEmpty(numDP) ? '////' : numDP;
    return arrayToConcreteLength(dealPassportNumber.split('/'), 5, '').map((el, index) => {
        switch (index) {
            case 0:
                return arrayToConcreteLength(el.split(''), 8, filler).join('');
            case 1:
            case 2:
                return arrayToConcreteLength(el.split(''), 4, filler).join('');

            case 3:
            case 4:
                return arrayToConcreteLength(el.split(''), 1, filler).join('');
            default:
                return '';
        }
    }).join('/');
}

export function toNumberDPRequest(numDP: string): string {
    const dealPassportNumber = isEmpty(numDP) ? '////' : numDP;
    return arrayToConcreteLength(dealPassportNumber.split('/'), 5, '').map(el => el.replace(/\D/g, '')).join('/');
}

/**
 * Creates object like {part1: '11111111', part2: '2222'... } from deal passport number
 * @param numDP
 * @returns {Object}
 */
export function splitNumberDPToPartsObject(numDP: string): Object {
    const dealPassportNumber = isEmpty(numDP) ? '////' : numDP;
    return arrayToConcreteLength(dealPassportNumber.split('/'), 5, '').reduce((prev, current, ind) => (
        {...prev, [`part${ind + 1}`]: current}
    ), {});
}

export function amountFormatter(value: string = ''): string {
    let filteredDotNumeric = value
    // eslint-disable-next-line no-useless-escape
        .replace(/[^\d\.,]+/g, '')
        .replace(/[,]+/g, '.')
        .replace(/\.{2,}/g, '.');

    if (filteredDotNumeric[0] === '.') {
        filteredDotNumeric = `0${filteredDotNumeric}`;
    }

    const executed = /\d+\.[\d]{0,2}/g.exec(filteredDotNumeric);

    return executed && executed.length > 0 ? executed[0] : filteredDotNumeric;
}

/**
 * Formats 20-digits bank account to groups
 * @param accountNumber Unformatted account number
 * @param separator Default is non-breaking space &nbsp;
 * @returns {string}
 */
export function bankAccountToGroups(accountNumber: string, separator: string = '\u00A0'): string {
    const groups = [5, 3, 1, 4, 7];
    return splitStingByGroups(accountNumber, groups).join(separator);
}

/**
 * Convert bytes to human readable string
 * TODO UT
 * @param bytes
 * @returns {string}
 */
export function bytesToReadable(bytes: number = 0): string {
    let result = bytes;
    const gap = 1024;
    if (Math.abs(bytes) < gap) {
        return `${result} Б`;
    }
    const units = ['Кб', 'Мб', 'Гб', 'Тб'];
    let unitIndex = -1;
    do {
        result /= gap;
        unitIndex += 1;
    } while (Math.abs(result) >= gap && unitIndex < units.length - 1);
    return `${Math.floor(result)} ${units[unitIndex]}`;
}

function formatSign(amount: number) {
    if (amount < 0) {
        return '-';
    }
    return '';
}

function roundToFrac(amount: number) {
    return Math.round(amount * FRAC_BASE) / FRAC_BASE;
}

function formatInt(int: number) {
    const [first, ...groups] = toGroups(int);
    const formatGroup = (group: string) => padStart(String(group), 3, '0');
    return [first, ...groups.map(formatGroup)].join(' ');
}

function toGroups(int: number): Array<any> {
    const next = Math.abs(Math.floor(int / 1000));
    const group = Math.abs(int % 1000);
    return next ? [...toGroups(next), group] : [group];
}

function formatFrac(fracPart: number) {
    return padStart(String(fracPart), FRAC_LENGTH, '0');
}

function calcFrac(amount: number) {
    return Math.round((amount * FRAC_BASE) % FRAC_BASE);
}

function arrayToConcreteLength(arr: Array<any>, length: number, filler: string = '&nbsp;'): Array<any> {
    const arrLength = arr.length;
    if (arrLength < length) {
        return [...arr, ...times(length - arrLength, constant(filler))];
    }
    return take(arr, length);
}
