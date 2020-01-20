/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {isNil, memoize} from 'lodash';
import {formatDateToDDMMYYYY} from '@vtb/services/l10n';
import {translate} from './../../../../utils/translate';

function renderDateRannge([from, to]: Array<string> = []) {
    if (from && to) {
        return translate('filters.dates.from-to', {from: formatDateToDDMMYYYY(from), to: formatDateToDDMMYYYY(to)});
    } else if (from) {
        return translate('filters.dates.from', {from: formatDateToDDMMYYYY(from)});
    } else if (to) {
        return translate('filters.dates.to', {to: formatDateToDDMMYYYY(to)});
    }

    return null;
}

export const getTags = memoize(() => ({
    isFavourite: {render(value: boolean) { return value && translate('filters.favorite'); }},
    hasAttachments: {render(value: boolean) { return value && translate('filters.attachments'); }},
    preset: {hide: true},
    statusCategory: {hide: true},
    period: {render: renderDateRannge},
    phone: {render(value: string) { return value && translate('filters.form.fields.clientResponsibleOfficer.phone'); }},
    statuses: {
        render(vals: Array<string> | null = []) {
            return !isNil(vals) && vals.length &&
                !(vals.length === 1 && vals[0] === 'ALL') && translate('filters.form.status');
        }
    },
    topic: {render(value: string) { return value && translate('filters.form.fields.topic'); }},
    body: {render(value: string) { return value && translate('filters.form.fields.content'); }},
    number: {render(value: number) { return value && translate('filters.form.fields.documentNumber'); }},
    clientId: {render(client: number) { return client && translate('filters.form.fields.clientSnapshot'); }},
    branchId: {render(branch: number) { return branch && translate('filters.form.fields.branchSnapshot'); }},
    clientOfficerId: {
        render(clientOfficer: number) {
            return clientOfficer && translate('filters.form.fields.clientResponsibleOfficer.name');
        }
    },
    dsfTypeId: {render(dsfTypeId: number) { return dsfTypeId && translate('filters.form.fields.letterType.name'); }}
}));
