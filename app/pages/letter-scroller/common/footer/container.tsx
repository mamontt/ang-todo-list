/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {Component} from 'react';
import {connect} from 'react-redux';
import {Scroller, ScrollerSumPaginationFooter} from '@vtb/fe-ui-table';
import {StoreType} from '../../../../store/root-selector';
import {RowType} from '../../flow-types';

type FooterViewProps = {
    totalRecords?: number;
    recordsCount?: number;
    activePage?: number;
    selectedDocs?: Array<RowType>;
    setRecordsCount?: (itemsPerPage: number) => void;
    setActivePage?: (pageNumber: number) => void;
}

type FiltersType = {
    [searchQueryField: string]: string;
}

export type Actions = {
    addCheckedRows: () => void;
    applyCurrentParams: (e: string) => void;
    clearData: () => void;
    destroy: () => void;
    getCapabilities: () => void;
    getData: () => void;
    getSavedSettings: () => void;
    infinityScrollerLoader: () => void;
    init: () => void;
    removeCheckedRows: () => void;
    setActivePage: (pageNumber: number) => void;
    setActiveRow: () => void;
    setCheckedRows: () => void;
    setDataUrl: (param: string) => void;
    setFetchParams: () => void;
    setFilterCounters: () => void;
    setFilters: (filters: FiltersType, dictionaryName: string) => void;
    setLoading: () => void;
    setOverlayVisibility: () => void;
    setQuickViewMode: (e: string) => void;
    setRecordsCount: (itemsPerPage: number) => void;
    setSavedSettings: (r: string) => void;
    setSorting: (e: string) => void;
    showSettingsModal: (modal: string) => void;
}

export const getCommonFooterView = (scrollerName: string, actions: Actions) => {
    class FooterView extends Component<FooterViewProps> {
        setItemsPerPage = (itemsPerPage: number) => this.props.setRecordsCount(itemsPerPage);
        setPage = (pageNumber: number) => this.props.setActivePage(pageNumber);

        render() {
            const {
                totalRecords,
                recordsCount,
                activePage,
                selectedDocs
            } = this.props;
            return (
                <ScrollerSumPaginationFooter
                    hasPagination
                    totalItems={totalRecords}
                    itemsPerPage={recordsCount}
                    onChangeItemsPerPage={this.setItemsPerPage}
                    onChangePage={this.setPage}
                    page={activePage}
                    text={selectedDocs.length > 0 ? selectedDocs.length : '0'}
                />
            );
        }
    }
    return connect(
        (state: StoreType) => ({
            totalRecords: Scroller.selectors.getTotalRecords(state, scrollerName),
            recordsCount: Scroller.selectors.getRecordsCount(state, scrollerName),
            activePage: Scroller.selectors.getActivePage(state, scrollerName),
            selectedDocs: Scroller.selectors.getCheckedRows(state, scrollerName)
        }),
        actions
    )(FooterView);
};
