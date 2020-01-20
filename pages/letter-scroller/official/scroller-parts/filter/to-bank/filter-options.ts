/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {DOCUMENT_STATUS_FILTERS} from './../../../../../../modules/filters';

export const toBankOfficialStatusFilters = [
    DOCUMENT_STATUS_FILTERS.EMPLOYEE_NOT_ASSIGNED,
    DOCUMENT_STATUS_FILTERS.EMPLOYEE_TO_BANK_IN_PROCESS,
    DOCUMENT_STATUS_FILTERS.EMPLOYEE_TO_BANK_EXECUTED,
    DOCUMENT_STATUS_FILTERS.EMPLOYEE_PROBLEMS,
    DOCUMENT_STATUS_FILTERS.ALL
];

export const FormCounterparts = {
    branch: 'common.receiver',
    client: 'common.sender'
};
