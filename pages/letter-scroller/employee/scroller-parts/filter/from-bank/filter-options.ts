/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {DOCUMENT_STATUS_FILTERS} from './../../../../../../modules/filters';

export const fromBankEmployeeStatusFilters = [
    DOCUMENT_STATUS_FILTERS.INCOMING,
    DOCUMENT_STATUS_FILTERS.WERE_READ,
    DOCUMENT_STATUS_FILTERS.RECALLED_BY_BANK,
    DOCUMENT_STATUS_FILTERS.FAVORITE,
    DOCUMENT_STATUS_FILTERS.ALL
];

export const FormCounterparts = {
    branch: 'common.sender',
    client: 'common.receiver'
};
