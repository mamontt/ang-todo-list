/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {STATUSES} from './../../../constants/statuses';

export const CLIENT_IN_PROCESS = {
    query: [STATUSES.IN_PROCESS].join(','),
    name: 'filters.inprocess'
};

export const EXECUTED = {
    query: [STATUSES.COMPLETED].join(','),
    name: 'filters.executed',
    badgeSpecial: true
};

export const INCOMING = {
    query: [STATUSES.INCOMING].join(','),
    name: 'filters.new'
};

export const WERE_READ = {
    query: [STATUSES.EXECUTED].join(','),
    name: 'filters.wereRead'
};

export const RECALLED_BY_BANK = {
    query: [STATUSES.RECALLED_BY_BANK].join(','),
    name: 'filters.calledBackByBank'
};

export const CLIENT_PROCESSING = {
    query: [STATUSES.IN_WORKING].join(','),
    name: 'filters.clientInprocess'
};

// TODO [sf] 03-Oct-18 not clear about CORRECT_REQUISITES, to ask analytics, v1.1?
export const TROUBLED = {
    query: [STATUSES.DELIVERED].join(','),
    name: 'filters.problem'
};

export const TO_SEND = {
    query: [STATUSES.NEW, STATUSES.SIGNED, STATUSES.SENDING].join(),
    name: 'filters.toSend'
};
