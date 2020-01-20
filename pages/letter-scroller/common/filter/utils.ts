/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {get, pickBy} from 'lodash';
import {translate} from './../../../../utils/translate';
import {DOCUMENT_STATUS_FILTERS} from './../../../../modules/filters';
import {FAVORITE, ALL} from './../../../../modules/filters/document-status-filters/common';
import { FiltersType } from './form/convertor';
import {FilterTabItemType} from './container';

// TODO Make unique status name
const counterMap = {
    [DOCUMENT_STATUS_FILTERS.TO_SIGN.name]: 'TO_SIGN',
    [DOCUMENT_STATUS_FILTERS.EMPLOYEE_TO_SIGN.name]: 'TO_SIGN',
    [DOCUMENT_STATUS_FILTERS.TO_BE_SENT.name]: 'TO_SEND',
    [DOCUMENT_STATUS_FILTERS.REJECTED.name]: 'DECLINED',
    [DOCUMENT_STATUS_FILTERS.INCOMING.name]: 'INCOMING',
    [DOCUMENT_STATUS_FILTERS.EMPLOYEE_NOT_ASSIGNED.name]: 'UNASSIGNED',
    [DOCUMENT_STATUS_FILTERS.EMPLOYEE_TO_BANK_IN_PROCESS.name]: 'IN_PROCESS',
    [DOCUMENT_STATUS_FILTERS.EMPLOYEE_PROBLEMS.name]: 'TROUBLED',
    [DOCUMENT_STATUS_FILTERS.EMPLOYEE_TO_SEND.name]: 'TO_SEND',
    [DOCUMENT_STATUS_FILTERS.EMPLOYEE_PROCESSING.name]: 'IN_PROCESS',
    [DOCUMENT_STATUS_FILTERS.EXECUTED.name]: 'COMPLETED'
};

type FilterCounters = {
    [name: string]: number;
}

const getBadgeCount = (filterCounters: FilterCounters, name: string) => {
    const getCounter = (counter: string) => get(filterCounters, counter, null);
    return getCounter(counterMap[name]);
};

export const getFilterTabItem = ({query, name, badgeSpecial}: FilterTabItemType, filterCounters: FilterCounters) => ({
    id: query,
    title: translate(name),
    badge: getBadgeCount(filterCounters, name),
    badgeSpecial
});

export const mergeFilters = (formFilters: FiltersType, activeTab: string) => {
    const isFavoriteActive = activeTab === FAVORITE.query;
    const isAll = activeTab === ALL.query;
    return pickBy({
        ...formFilters,
        isFavourite: isFavoriteActive || formFilters.isFavourite,
        statusCategory: isFavoriteActive || isAll ? null : activeTab
    });
};

