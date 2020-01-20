/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2018 VTB Group. All rights reserved.
 */
import {Scroller} from '@vtb/fe-ui-table';
import {DICTIONARY_COMMON_SCROLLER as name} from '../constants';
import {StoreType} from '../../../store/root-selector';
import {Row} from '../../../pages/letter-scroller/common/table/recall-cell/row-type';

export const getActiveRow = (state: StoreType): Row => Scroller.selectors.getActiveRow(state, name);
export const getPage = (state: StoreType): number => Scroller.selectors.getActivePage(state, name);
export const getCheckedRows = (state: StoreType): Array<Object> | void =>
    Scroller.selectors.getCheckedRows(state, name);
export const getLoadingState = (state: StoreType): boolean => Scroller.selectors.getLoadingState(state, name) || false;

export const getData = (state: StoreType): Array<Object> => {
    const data = Scroller.selectors.getData(state, name);
    if (Array.isArray(data)) {
        return data;
    }
    return (data && data.data) || [];
};
