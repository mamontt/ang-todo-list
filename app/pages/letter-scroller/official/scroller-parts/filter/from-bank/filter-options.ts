/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {DOCUMENT_STATUS_FILTERS} from './../../../../../../modules/filters';
import {STATUSES} from './../../../../../../constants/statuses';

export const fromBankOfficialStatusFilters = [
    DOCUMENT_STATUS_FILTERS.EMPLOYEE_IN_PROCESS,
    DOCUMENT_STATUS_FILTERS.EMPLOYEE_TO_SIGN,
    DOCUMENT_STATUS_FILTERS.EMPLOYEE_TO_SEND,
    DOCUMENT_STATUS_FILTERS.EMPLOYEE_PROCESSING,
    DOCUMENT_STATUS_FILTERS.EMPLOYEE_EXECUTED,
    DOCUMENT_STATUS_FILTERS.ALL
];

export const fromBankOfficialStatusFiltersForAllTab = {
    statuses: [
        STATUSES.DRAFT,
        STATUSES.NEW,
        STATUSES.PARTLY_SIGNED_BY_BANK,
        STATUSES.SIGNED_BY_BANK,
        STATUSES.SENDING,
        STATUSES.DELIVERED,
        STATUSES.DETAILS_ERROR,
        STATUSES.CORRECT_REQUISITES,
        STATUSES.WRONG_E_SIGNATURE,
        STATUSES.OBTAINED_BY_CLIENT,
        STATUSES.EXECUTED,
        STATUSES.RECALLED_BY_BANK
    ].join(',')
};

export const FormCounterparts = {
    branch: 'common.sender',
    client: 'common.receiver'
};
