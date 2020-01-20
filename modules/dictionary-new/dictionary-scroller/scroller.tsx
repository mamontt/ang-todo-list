/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2018 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {PureComponent} from 'react';
import {connect} from 'react-redux';
import {AnyAction, bindActionCreators, Dispatch} from 'redux';
import {Scroller} from '@vtb/fe-ui-table';
import {closeModal} from '@vtb/fe-ui-dialog';
import {noop} from '@vtb/services/utils';
import {DICTIONARY_INITIAL_PARAMS, DICTIONARY_COMMON_SCROLLER} from '../constants';
import {actionFabrique} from './action-fabrique';
import {DictionaryScrollerInnSearch} from './dictionary-scroller-search';
import {DictionaryScrollerTable} from './dictionary-scroller-table';
import {DictionaryScrollerFooter} from './dictionary-scroller-footer';
import {getDictionary} from '../selectors';
import {getActiveRow, getPage} from './dictionary-scroller-selectors';
import {ScrollerType} from '../flow-types';
import {OwnPropsType} from './';
import {StoreType} from '../../../store/root-selector';

class DictionaryScrollerComponent extends PureComponent<ScrollerType> {
    render() {
        const {
            filterView: FilterView,
            ...props
        } = this.props;

        const {
            page,
            totalRecords,
            recordsCount,
            setRecordsCount,
            setActivePage
        } = props;

        const pagination = {
            page,
            totalRecords,
            itemsPerPage: recordsCount,
            onChangePage: setActivePage ? (nextPage: number) => setActivePage(nextPage - 1) : noop,
            onChangeItemsPerPage: setRecordsCount
        };

        return (
            <Scroller.Module
                {...props}
                scrollerName={DICTIONARY_COMMON_SCROLLER}
                initParams={DICTIONARY_INITIAL_PARAMS}
                tableView={<DictionaryScrollerTable
                    scrollerName={DICTIONARY_COMMON_SCROLLER}
                    getTableColumns={props.getTableColumns}
                    dataPath={props.dataPath}
                    multi={props.multi}
                    setDictionaryValues={props.setDictionaryValues}
                    {...props}
                />}
                actionBarView={props.multi && <DictionaryScrollerInnSearch changeContext={props.changeContext} />}
                filterView={FilterView && <FilterView {...props} />}
                footerView={<DictionaryScrollerFooter
                    {...props}
                    pagination={pagination}
                    setActivePage={props.setActivePage}
                    activeRow={props.activeRow}
                    checkedRows={props.checkedRows}
                    setDictionaryValues={props.setDictionaryValues}
                    closeModal={() => {
                        props.closeModal();
                        props.destroy();
                    }}
                    multi={props.multi}
                />}
            />
        );
    }
}

const mapDispatchToProps = (
    dispatch: Dispatch<AnyAction>,
    {url, dataPath, fetchParams}: OwnPropsType
) => bindActionCreators({
    closeModal,
    getDictionary,
    ...actionFabrique(url, dataPath, fetchParams)
}, dispatch);

const mapStateToProps = (state: StoreType, ownProps: OwnPropsType) => {
    const {filterItemsCount} = ownProps;
    const recordsCount = Scroller.selectors.getTotalRecords(state, DICTIONARY_COMMON_SCROLLER);
    const totalRecords = filterItemsCount || recordsCount;

    return {
        page: getPage(state),
        activeRow: getActiveRow(state),
        totalRecords,
        allRows: Scroller.selectors.getData(state, DICTIONARY_COMMON_SCROLLER),
        activePage: Scroller.selectors.getActivePage(state, DICTIONARY_COMMON_SCROLLER),
        recordsCount: Scroller.selectors.getRecordsCount(state, DICTIONARY_COMMON_SCROLLER),
        checkedRows: Scroller.selectors.getCheckedRows(state, DICTIONARY_COMMON_SCROLLER),
        queryParams: ownProps.queryParams,
        pathAdapter: ownProps.pathAdapter,
        multi: ownProps.multi,
        fieldValue: ownProps.fieldValue
    };
};

export const DictionaryScroller = connect(
    mapStateToProps,
    mapDispatchToProps
)(DictionaryScrollerComponent);
