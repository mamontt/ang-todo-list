/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2018 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {Component} from 'react';
import {connect} from 'react-redux';
import {AnyAction, Dispatch} from 'redux';
import {Scroller, DataTable} from '@vtb/fe-ui-table';
import {letter} from './../../../../../../api/letter';
import {onScrollerRouteChange} from './../../../../../../modules/common-form-hocs/on-scroller-route-change';
import {FROM_BANK} from './../../../../../../modules/define-letter-direction';
import {Loader} from './../../../../../../modules/loader';
import {LETTER_SCROLLER_NAME_FROM_BANK} from '../../../../../../pages/letter-scroller/constants';
import {actionFabriqueFromBank} from '../../../../../../pages/letter-scroller/employee/letter-scroller-from-bank/action-fabrique-from-bank';
import {getCheckedRowsIds} from '../../../../../../pages/letter-scroller/selectors';
import {toggleFavorite} from '../../../../../../pages/letter-scroller/actions';
import {rowStylesModifier} from '../../../../../../pages/letter-scroller/common/table/utils';
import {RowType, RowsType} from '../../../../../../pages/letter-scroller/flow-types';
import {getTableColumns} from './table-options';
import {TableViewProps} from '../to-bank/table';
import {StoreType} from '../../../../../../store/root-selector';
// @ts-ignore
@onScrollerRouteChange
class TableViewFromBankClass extends Component<TableViewProps> {
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
            LETTER_SCROLLER_NAME_FROM_BANK
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
                    rowStylesModifier={rowStylesModifier}
                    onRowMarkChange={this.handleMarkChange}
                />
            </Loader>
        );
    }
}

export const TableViewFromBank = connect(
    (state: StoreType) => ({
        isLoading: Scroller.selectors.getLoadingState(state, LETTER_SCROLLER_NAME_FROM_BANK),
        data: Scroller.selectors.getData(state, LETTER_SCROLLER_NAME_FROM_BANK),
        checkedRows: Scroller.selectors.getCheckedRows(state, LETTER_SCROLLER_NAME_FROM_BANK),
        activeRow: Scroller.selectors.getActiveRow(state, LETTER_SCROLLER_NAME_FROM_BANK),
        savedSettings: Scroller.selectors.getSavedSettings(state, LETTER_SCROLLER_NAME_FROM_BANK),
        resource: letter(FROM_BANK),
        sorting: Scroller.selectors.getSorting(state, LETTER_SCROLLER_NAME_FROM_BANK)
    }),
    {
        ...actionFabriqueFromBank,
        getActualCheckedRows: () =>
            (
                dispatch: Dispatch<AnyAction>,
                getState: () => StoreType
            ) => Scroller.selectors.getCheckedRows(getState(), LETTER_SCROLLER_NAME_FROM_BANK),
        toggleFavor: toggleFavorite
    }
)(TableViewFromBankClass);
