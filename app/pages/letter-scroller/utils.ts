/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {get, isEmpty, intersection, noop, uniq} from 'lodash';
import {translate} from './../../utils/translate';
import {STATUSES_PARTIAL} from './../../constants/statuses-partial';
import {FILTERS_CATEGORY_ALL} from './../../constants/statuses';
import {CheckboxStatusType, RowType} from './flow-types';
import {Row} from './common/table/recall-cell/row-type';

type statusFilterTypes = {
    name: string;
    query: string;
}
type tabFiltersTypes = {
    isFavourite?: boolean;
    statuses?: string;
}

type KeysMatchType = {
    [translateKey: string]: string;
}

export type statusFiltersToCheckboxOptionsTypes = {
    tabFilters?: tabFiltersTypes;
    statusFilters?: Array<statusFilterTypes>;
    additionalFilterItems?: Array<statusFilterTypes>;
    translationKeysMatch: KeysMatchType;
    filterStatusesAll?: Array<string>;
    rows: Array<any>;
}

const substTranslationKey = (substData: KeysMatchType, translateKey: string) => (
    isEmpty(substData[translateKey])
        ? translateKey
        : substData[translateKey]
);

const customAllMenuItem = () => [{title: translate('filters.all'), value: 'ALL'}];

const createMenuItem = (menuItem: string, translationKeysMatch: KeysMatchType) => ({
    title: translate(substTranslationKey(translationKeysMatch, `filters.${menuItem.toLowerCase()}`)),
    value: menuItem
});

const getFavouriteStatuses = (favouriteRows: Array<RowType> = []) => (
    favouriteRows.length > 0
        ? uniq(favouriteRows.map(rowItem => get(rowItem, 'status.id')))
        : []
);

/**
 * Manages filers items for mass select dorpdown with checkbox
 * @param tabFilters - object with list of statuses or with favorites flag
 * @param statusFilters - array of items for tabs categories
 * @param additionalFilterItems - optional, array of filter objects for ALL categories, NOT displayed in categories
 * @param translationKeysMatch - optional, object for substitution of translation keys
 * @param filterStatusesAll - optional, array of statuses for ALL flat menu
 * @param rows - array of rows (now for favourites only), needed to extract statuses for checkbox dpopdown
 * @returns {*}
 */
export const statusFiltersToCheckboxOptions = ({
    translationKeysMatch = {},
    rows = []
}: statusFiltersToCheckboxOptionsTypes) => {
    return [...customAllMenuItem(),
        ...getFavouriteStatuses(rows)
            .map(menuItem => createMenuItem(menuItem, translationKeysMatch))
    ];
};

export const actionBarCheckboxStatusHandler = (props: CheckboxStatusType, prevState: CheckboxStatusType) => {
    const {
        checkedRows = [],
        allRows = []
    } = props;

    const {selectedValue} = prevState;

    // handling flat arrays is faster
    const allRowsIds = allRows.map((item: {id: string}) => (item.id));
    const checkedRowsIds = checkedRows.map((item: {id: string}) => (item.id));
    const matchSize = intersection(allRowsIds, checkedRowsIds).length;
    if (matchSize === 0) {
        return {
            selectedValue: null
        };
    }
    return {
        selectedValue: selectedValue || ''
    };
};

type filterHandlerProps = {
    filterValue: string | Array<string>;
    allRows: Array<Row>;
    checkedRows: Array<Row>;
    addCheckedRows: (rows: Array<Row>) => void;
    setCheckedRows: (rows: Array<Row>) => void;
    removeCheckedRows: (rows: Array<Row>) => void;
    getCapabilitiesWrapper: () => void;
}

export const subFilterSelectHandled = (
    {
        filterValue,
        allRows = [],
        checkedRows = [],
        addCheckedRows,
        setCheckedRows,
        removeCheckedRows,
        getCapabilitiesWrapper = noop
    }: filterHandlerProps
) => {
    if (filterValue === STATUSES_PARTIAL.ALL) {
        setCheckedRows(allRows);
    } else if (filterValue === null) {
        setCheckedRows([]);
    } else {
        removeCheckedRows(allRows);
        addCheckedRows(
            allRows.filter((item: {status: {id: string}}) =>
                (Array.isArray(filterValue) ? filterValue.includes(item.status.id) : filterValue === item.status.id))
        );
    }
    getCapabilitiesWrapper();
    return filterValue;
};

export const getCategoryNameByStatuses = (statusFilters: Array<Object> = [], statuses: string = '') => {
    const categoryFilters = statusFilters
        ? statusFilters.find((statusElement: {query: string}) => statusElement.query === statuses)
        : null;
    return get(categoryFilters, 'name', STATUSES_PARTIAL);
};

type ButtonType = {
    disabled: boolean;
    icon: string;
    id: string;
    onClick: () => void;
    title: string;
}

type ButtonsType = {
    [value: string]: ButtonType;
}

type CategoriesType = Array<string>;
type PerCategoriesType = {
    [value: string]: CategoriesType;
}

export const filterActionsBarButtonsByFilterCategory = (
    buttons: ButtonsType = {},
    buttonsPerCategories: PerCategoriesType = {},
    categoryName: string,
    performFiltering: boolean = true
) => {
    const processCategory = performFiltering ? categoryName : FILTERS_CATEGORY_ALL;
    const idsToPick = get(buttonsPerCategories, [processCategory], null);
    return idsToPick
        ? idsToPick.map((key: string) => get(buttons, [key]))
        : [];
};
