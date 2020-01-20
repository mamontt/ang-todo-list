/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {Component} from 'react';
import {connect} from 'react-redux';
import {AnyAction, Dispatch} from 'redux';
import {Scroller, DataTable} from '@vtb/fe-ui-table';
import {letterOfficial} from './../../../../../../api/letter';
import {Loader} from './../../../../../../modules/loader';
import {onScrollerRouteChange} from './../../../../../../modules/common-form-hocs/on-scroller-route-change';
import {FROM_BANK} from './../../../../../../modules/define-letter-direction';
import {TableViewProps} from '../../../../../../pages/letter-scroller/employee/scroller-parts/table/to-bank/table';
import {LETTER_SCROLLER_NAME_FROM_BANK} from '../../../../../../pages/letter-scroller/constants';
import {officialActionFabriqueFromBank} from '../../../../../../pages/letter-scroller/official/letter-scroller-from-bank/official-action-fabrique-from-bank';
import {getCheckedRowsIds} from '../../../../../../pages/letter-scroller/selectors';
import {RowType, RowsType} from '../../../../../../pages/letter-scroller/flow-types';
import {getTableColumns} from './table-options';
import {StoreType} from '../../../../../../store/root-selector';

@onScrollerRouteChange
class TableViewFromBankClass extends Component<TableViewProps> {
    render() {
        const {
            goTo,
            data = [],
            addCheckedRows,
            removeCheckedRows,
            getCapabilities,
            setActiveRow,
            checkedRows,
            getActualCheckedRows,
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
                    onRowActivate={(row: RowType) => setActiveRow(row)}
                    onRowDblClick={(row: RowType) => goTo.editDocument(row.id)}
                    onSelectionChange={({checked, row}: RowsType) => {
                        if (checked) {
                            addCheckedRows([row]);
                        } else {
                            removeCheckedRows([row]);
                        }
                        getCapabilities(getCheckedRowsIds(getActualCheckedRows()));
                    }}
                    rows={data}
                    rowIdGetter={(row: RowType) => row.id}
                    sorting={sorting}
                    onSortingChange={setSorting}
                    selectedRows={checkedRows}
                    joinColumns
                    multiSelect
                    withSettings
                    showSettingsModal={showSettingsModal}
                    savedSettings={savedSettings}
                    setSavedSettings={setSavedSettings}
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
        resource: letterOfficial(FROM_BANK),
        sorting: Scroller.selectors.getSorting(state, LETTER_SCROLLER_NAME_FROM_BANK)
    }),
    {
        ...officialActionFabriqueFromBank,
        getActualCheckedRows: () =>
            (dispatch: Dispatch<AnyAction>, getState: () => StoreType) =>
                Scroller.selectors.getCheckedRows(getState(), LETTER_SCROLLER_NAME_FROM_BANK)
    }
)(TableViewFromBankClass);
