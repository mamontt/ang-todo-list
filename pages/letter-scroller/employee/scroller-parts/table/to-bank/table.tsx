/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2018 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {Component} from 'react';
import {connect} from 'react-redux';
import {Scroller, DataTable} from '@vtb/fe-ui-table';
import {letter} from './../../../../../../api/letter';
import {onScrollerRouteChange} from './../../../../../../modules/common-form-hocs/on-scroller-route-change';
import {TO_BANK} from './../../../../../../modules/define-letter-direction';
import {Loader} from './../../../../../../modules/loader';
import {GoTo} from './../../../../../../utils/routing';
import {LETTER_SCROLLER_NAME_TO_BANK} from '../../../../../../pages/letter-scroller/constants';
import {actionFabriqueToBank} from '../../../../../../pages/letter-scroller/employee/letter-scroller-to-bank/action-fabrique-to-bank';
import {getCheckedRowsIds} from '../../../../../../pages/letter-scroller/selectors';
import {toggleFavorite} from '../../../../../../pages/letter-scroller/actions';
import {rowStylesModifier} from '../../../../../../pages/letter-scroller/common/table/utils';
import {RowType, RowsType} from '../../../../../../pages/letter-scroller/flow-types';
import {getTableColumns} from './table-options';
import {SortingProps} from '../../../../../../modules/dictionary-new/flow-types';
import {ResourceType} from '../../../../../../modules/resource';

type SavedSettingProps = {
    quickViewIsActive: boolean;
    scrollerName: string;
}

export type TableViewProps = {
    goTo?: GoTo;
    data?: Array<RowType>;
    setActiveRow?: (row: RowType) => void;
    addCheckedRows?: (rows: Array<RowType>) => void;
    removeCheckedRows?: (rows: Array<RowType>) => void;
    getCapabilities?: (name: string) => Array<string>;
    getActualCheckedRows?: () => Array<RowType>;
    toggleFavor?: (
        row: RowType,
        resource: ResourceType,
        callback: () => void,
        scrollerName: string
    ) => void;
    resource?: ResourceType;
    getData?: () => void;
    checkedRows?: Array<RowType>;
    savedSettings?: SavedSettingProps;
    showSettingsModal?: (modal: string) => void;
    setSavedSettings?: (r: string) => void;
    activeRow?: RowType;
    setSorting?: () => void;
    sorting?: SortingProps;
    isLoading?: boolean;
    scrollerName?: string;
}
// @ts-ignore
@onScrollerRouteChange
class TableViewToBankClass extends Component<TableViewProps> {
    handleActivate = (row: RowType) => this.props.setActiveRow(row);
    handleDoubleClick = (row: RowType) => this.props.goTo.editDocument(row.id);
    handleSelectionChange = ({checked, row}: RowsType) => {
        const {
            addCheckedRows,
            removeCheckedRows,
            getCapabilities,
            getActualCheckedRows
        } = this.props;

        if (checked) {
            addCheckedRows([row]);
        } else {
            removeCheckedRows([row]);
        }
        getCapabilities(getCheckedRowsIds(getActualCheckedRows()));
    };
    handleIdGetter = (row: RowType) => row.id;
    handleMarkChange = ({row}: RowsType) =>
        this.props.toggleFavor(
            row,
            this.props.resource,
            () => (dispatch: Function) => {
                dispatch(this.props.getData);
            },
            LETTER_SCROLLER_NAME_TO_BANK
        );


    render() {
        const {
            data = [],
            checkedRows,
            savedSettings,
            showSettingsModal,
            setSavedSettings,
            activeRow,
            setSorting,
            sorting,
            isLoading
        } = this.props;
        return (
            <Loader visible={isLoading}>
                <DataTable
                    activeRow={activeRow}
                    columns={getTableColumns()}
                    onRowActivate={this.handleActivate}
                    onRowDblClick={this.handleDoubleClick}
                    onSelectionChange={this.handleSelectionChange}
                    rows={data}
                    rowIdGetter={this.handleIdGetter}
                    sorting={sorting}
                    onSortingChange={setSorting}
                    selectedRows={checkedRows}
                    joinColumns
                    multiSelect
                    withSettings
                    showSettingsModal={showSettingsModal}
                    savedSettings={savedSettings}
                    setSavedSettings={setSavedSettings}
                    markedRows={data.filter((item: {favourite: boolean}) => item.favourite)}
                    markRows
                    onRowMarkChange={this.handleMarkChange}
                    rowStylesModifier={rowStylesModifier}
                />
            </Loader>
        );
    }
}

export const TableViewToBank = connect(
    state => ({
        isLoading: Scroller.selectors.getLoadingState(state, LETTER_SCROLLER_NAME_TO_BANK),
        data: Scroller.selectors.getData(state, LETTER_SCROLLER_NAME_TO_BANK),
        checkedRows: Scroller.selectors.getCheckedRows(state, LETTER_SCROLLER_NAME_TO_BANK),
        activeRow: Scroller.selectors.getActiveRow(state, LETTER_SCROLLER_NAME_TO_BANK),
        savedSettings: Scroller.selectors.getSavedSettings(state, LETTER_SCROLLER_NAME_TO_BANK),
        resource: letter(TO_BANK),
        sorting: Scroller.selectors.getSorting(state, LETTER_SCROLLER_NAME_TO_BANK)
    }),
    {
        ...actionFabriqueToBank,
        getActualCheckedRows: () =>
            (
                dispatch: Function,
                getState: Function
            ) => Scroller.selectors.getCheckedRows(getState(), LETTER_SCROLLER_NAME_TO_BANK),
        toggleFavor: toggleFavorite
    }
)(TableViewToBankClass);
