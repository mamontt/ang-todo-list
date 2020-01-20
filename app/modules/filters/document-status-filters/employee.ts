/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {STATUSES} from './../../../constants/statuses';

export const EMPLOYEE_TO_SIGN = {
    query: [STATUSES.TO_SIGN].join(','),
    name: 'filters.tosign'
};

export const EMPLOYEE_TO_SEND = {
    query: [STATUSES.TO_SEND].join(','),
    name: 'filters.signedOfficial'
};

export const EMPLOYEE_PROCESSING = {
    query: [STATUSES.INCOMING].join(','),
    name: 'filters.in_process'
};

export const EMPLOYEE_EXECUTED = {
    query: [STATUSES.COMPLETED].join(','),
    name: 'filters.executedOfficial'
};

export const EMPLOYEE_NOT_ASSIGNED = {
    query: [STATUSES.UNASSIGNED].join(','),
    name: 'filters.received'
};

export const EMPLOYEE_TO_BANK_EXECUTED = {
    query: [STATUSES.COMPLETED].join(','),
    name: 'filters.executedOfficial'
};

export const EMPLOYEE_PROBLEMS = {
    query: [STATUSES.TROUBLED].join(','),
    name: 'filters.problem'
};

export const EMPLOYEE_IN_PROCESS = {
    query: [STATUSES.IN_WORKING].join(','),
    name: 'filters.bankInprocess'
};

export const EMPLOYEE_TO_BANK_IN_PROCESS = {
    query: [STATUSES.IN_PROCESS].join(','),
    name: 'filters.in_process'
};
