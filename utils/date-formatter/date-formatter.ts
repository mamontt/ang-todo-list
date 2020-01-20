/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import moment from 'moment';

export function fromDatePickerToISO8601(dateString: string | void): string {
    return dateString ? `${moment(dateString, 'DD.MM.YYYY').format('YYYY-MM-DDT00:00:00.000')}Z` : '';
}

export function dateTimeToDate(iso?: string): string {
    if (!iso) {
        return '';
    }
    const date = adjustValidISODate(iso);
    if (isDateInvalid(date)) {
        return '';
    }
    return `${pad(date.getDate(), 2)}.${pad(date.getMonth() + 1, 2)}.${date.getFullYear()}`;
}

function pad(number: number, size: number): string {
    let s = number.toString();
    while (s.length < size) {
        s = `0${s}`;
    }
    return s;
}

export function dateStringToISO(dateString: string): string {
    if (isDateStringEmpty(dateString)) {
        return '';
    }
    const date = new Date(dateString);
    if (isDateInvalid(date)) {
        return '';
    }
    return date.toISOString();
}

export function adjustValidISODate(iso: string): Date {
    let date = new Date(iso);
    if (isDateInvalid(date)) {
        date = new Date(transformDateToSupportIE(iso));
    }
    return date;
}

export function isDateStringEmpty(dateString: string | void | null): boolean {
    return (dateString === '' || dateString === undefined || dateString === null);
}

export function isDateInvalid(date: Date): boolean {
    return Number.isNaN(date.getTime());
}

export function transformDateToSupportIE(iso: string): string {
    // https://docs.microsoft.com/en-us/scripting/javascript/date-and-time-strings-javascript#ISO
    return iso.replace(/([+-])(\d\d)(\d\d)$/, '$1$2:$3');
}
