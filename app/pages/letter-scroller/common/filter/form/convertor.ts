/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2018 VTB Group. All rights reserved.
 */
import {get} from 'lodash';

let prevBranch = {};
let prevClient = {};
let prevLetterType = {};
let prevClientOfficer = {};

export type FiltersType = {
    dateFrom?: string;
    dateTo?: string;
    branchId?: number;
    clientId?: number;
    isFavourite?: boolean;
    dsfTypeId?: number;
    statuses?: string;
    clientOfficerId?: number;
    statusCategory?: string;
}

export const filtersToForm = (
    {
        dateFrom,
        dateTo,
        branchId,
        clientId,
        dsfTypeId,
        statuses,
        clientOfficerId,
        ...filters
    }: FiltersType
) => ({
    period: [dateFrom, dateTo],
    branchId: branchId === get(prevBranch, 'id', NaN) ? prevBranch : branchId,
    clientId: clientId === get(prevClient, 'id', NaN) ? prevClient : clientId,
    clientOfficerId: clientOfficerId === get(prevClientOfficer, 'id', NaN) ? prevClientOfficer : clientOfficerId,
    dsfTypeId: dsfTypeId === get(prevLetterType, 'id', NaN) ? prevLetterType : dsfTypeId,
    statuses: (statuses || '').split(',').filter(x => x),
    ...filters
});

export type FiltersForm = {
    [fieldName: string]: any;
}

export function formToFilters({
    period,
    preset,
    dsfTypeId = {},
    branchId = {},
    clientId = {},
    statuses = [],
    clientOfficerId = {},
    ...form
}: FiltersForm) {
    prevBranch = branchId;
    prevClient = clientId;
    prevClientOfficer = clientOfficerId;
    prevLetterType = dsfTypeId;
    return {
        dateFrom: get(period, '0'),
        dateTo: get(period, '1'),
        branchId: get(branchId, 'id', null),
        clientId: get(clientId, 'id', null),
        clientOfficerId: get(clientOfficerId, 'id', null),
        dsfTypeId: get(dsfTypeId, 'id', null),
        statuses: Array.isArray(statuses) ? statuses.join(',') : '',
        ...form
    };
}
