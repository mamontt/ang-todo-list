/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {DOCUMENT_STATUS_FILTERS} from './../../../../../../modules/filters';

export const toBankEmployeeStatusFilters = [
    DOCUMENT_STATUS_FILTERS.CLIENT_PROCESSING,
    DOCUMENT_STATUS_FILTERS.TO_SIGN,
    DOCUMENT_STATUS_FILTERS.TO_BE_SENT,
    DOCUMENT_STATUS_FILTERS.CLIENT_IN_PROCESS,
    DOCUMENT_STATUS_FILTERS.EXECUTED,
    DOCUMENT_STATUS_FILTERS.FAVORITE,
    DOCUMENT_STATUS_FILTERS.ALL
];

export const FormCounterparts = {
    branch: 'common.receiver',
    client: 'common.sender'
};
