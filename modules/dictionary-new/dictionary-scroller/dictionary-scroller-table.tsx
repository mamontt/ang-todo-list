/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2018 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {Component} from 'react';
import {connect} from 'react-redux';
import {AnyAction, bindActionCreators, Dispatch} from 'redux';
import {noop, isEmpty} from 'lodash';
import {DataTable} from '@vtb/fe-ui-table';
import {TableSelectionType} from '../flow-types';
import {actionFabrique} from './action-fabrique';
import * as selectors from './dictionary-scroller-selectors';
import {OwnPropsType} from './index';
import {RowType} from '../../../pages/letter-scroller/flow-types';
import {StoreType} from '../../../store/root-selector';
import {Client, Column} from '../../../common-types';

type TableStateType = {
    markRows: boolean;
    markedRows: Array<RowType>;
}

type RowParams = RowType | Array<RowType>;

type TablePropsType = {
    url: string;
    dictionary: Array<Client>;
    setActiveRow: (fieldValue: RowType) => void;
    isLoading: boolean;
    getTableColumns: () => Array<Column>;
    dataPath?: string; // eslint-disable-line react/no-unused-prop-types
    multi: boolean;
    checkedRows: Array<RowType>;
    rowStyleRule: (fieldValue: RowType, rows: Array<RowType>) => boolean;
    checkDisability: (fieldValue: RowType, rows: Array<RowType>) => boolean;
    addCheckedRows: (fieldValue: RowParams) => void;
    removeCheckedRows: (fieldValue: RowParams) => void;
    rowIdFieldName?: string;
    setDictionaryValues: (fieldValue: RowParams) => void;
    closeModal: () => void;
    joinColumns?: boolean,
    setCheckedRows: (fieldValue: RowParams) => void;
    fieldValue?: RowType;
    activeRow: RowType;
};

class Table extends Component<TablePropsType, TableStateType> {
    componentDidMount() {
        const {
            multi, fieldValue, setActiveRow, setCheckedRows
        } = this.props;

        if (!isEmpty(fieldValue)) {
            if (multi) {
                setCheckedRows(fieldValue);
            } else {
                setActiveRow(fieldValue);
            }
        }
    }

    onSelectionChange = (select: TableSelectionType, checkedRows: Array<Object>) => {
        const {
            checkDisability
        } = this.props;

        const shouldDisable = checkDisability ? checkDisability(select.row, checkedRows) : false;

        if (shouldDisable && select.checked) {
            return noop;
        }

        return this.handleSelectionChange(select);
    };

    // TODO: Prevent trigger setActive => setChecked || setSelected
    handleRowActivate = (activeRow: RowType) => {
        this.props.setActiveRow(activeRow);
    };

    rowStylesModifier = (row: RowType, checkedRows: Array<Object>) => {
        const {rowStyleRule} = this.props;
        const shouldStyleRow = rowStyleRule ? rowStyleRule(row, checkedRows) : false;

        return shouldStyleRow ? [DataTable.RowStyles.ACCENT_NEW] : '';
    };

    handleSelectionChange = ({checked, row}: TableSelectionType) => {
        const {addCheckedRows, removeCheckedRows, rowIdFieldName} = this.props;
        const mappedRow: Array<RowType> = [rowIdFieldName ? {id: row.rowIdFieldName, ...row} : row];

        return checked
            ? addCheckedRows(mappedRow)
            : removeCheckedRows(mappedRow);
    };

    handleSelectionRowDblClick = (clickedRow: RowType) => {
        const {
            multi, setDictionaryValues, closeModal
        } = this.props;

        setDictionaryValues(multi ? [clickedRow] : clickedRow);
        closeModal();
    };

    handleSelectAll = (selected: boolean) => {
        const {setCheckedRows, dictionary} = this.props;
        setCheckedRows(selected ? dictionary : []);
    };

    render() {
        const {
            isLoading,
            url,
            checkedRows,
            multi,
            getTableColumns,
            rowIdFieldName = 'id',
            dictionary,
            joinColumns,
            activeRow
        } = this.props;
        return (
            !isLoading &&
            <DataTable
                url={url}
                activeRow={activeRow}
                columns={getTableColumns()}
                multiSelect={multi}
                onRowActivate={multi ? noop : this.handleRowActivate}
                onRowClick={noop}
                onRowDblClick={(value: RowType) => this.handleSelectionRowDblClick(value)}
                onSelectionChange={(select: TableSelectionType) => this.onSelectionChange(select, checkedRows)}
                rowIdGetter={(row: {[rowIdFieldName: string]: string}) => row[rowIdFieldName]}
                rows={dictionary}
                selectedRows={checkedRows}
                rowStylesModifier={(row: RowType) => this.rowStylesModifier(row, checkedRows)}
                joinColumns={joinColumns}
                onSelectAll={this.handleSelectAll}
            />
        );
    }
}

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>, ownProps: OwnPropsType) => bindActionCreators({
    ...actionFabrique(ownProps.url, ownProps.dataPath, ownProps.queryParams, ownProps.pathAdapter)
}, dispatch);

const mapStateToProps = (state: StoreType, ownProps: OwnPropsType) => {
    const {filterItems} = ownProps;
    const items = selectors.getData(state);
    const dictionary = filterItems
        ? filterItems(items)
        : items;

    return {
        isLoading: selectors.getLoadingState(state),
        activeRow: selectors.getActiveRow(state),
        checkedRows: selectors.getCheckedRows(state),
        dictionary
    };
};

export const DictionaryScrollerTable: any = connect(
    mapStateToProps,
    mapDispatchToProps
)(Table);
