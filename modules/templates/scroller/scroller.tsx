/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2018 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {PureComponent, ReactNode} from 'react';
import {connect} from 'react-redux';
import {AnyAction, bindActionCreators, Dispatch} from 'redux';
import {noop} from '@vtb/services/utils';
import {closeModal} from '@vtb/fe-ui-dialog';
import {Scroller} from '@vtb/fe-ui-table';
import {FooterWithPagination} from './../../../components/footers';
import {ActionFabriqueType} from '../../../modules/dictionary-new/flow-types';
import {actionFabrique} from './action-fabrique';
import {Table} from './table';
import {buildScrollerName} from './utils';
import {DeleteTemplateActionType} from '../flow-types';
import {TEMPLATES_INITIAL_PARAMS} from '../constants';
import {RowType} from '../../../pages/letter-scroller/flow-types';
import {StoreType} from '../../../store/root-selector';

type TemplatesScrollerType = {
    docTypeId: number;
    createModalTemplates: (row: RowType) => void;
    deleteTemplate: DeleteTemplateActionType;
    filterView?: ReactNode;
}

type MapDispatchToPropsType = ActionFabriqueType & { closeModal: typeof closeModal};
type MapStateToPropsType = {
    activeRow: RowType;
    activePage: number;
    setActivePage?: (row: RowType) => void;
    setRecordsCount?: (count: number) => void;
    page: number;
    totalRecords: number;
    recordsCount: number;
    isLoading: boolean;
}

type ScrollerType = TemplatesScrollerType & MapDispatchToPropsType & MapStateToPropsType;

const mapDispatchToProps:(fun: Function, template: TemplatesScrollerType) => MapDispatchToPropsType = (
    dispatch: Dispatch<AnyAction>,
    {docTypeId}
) => bindActionCreators({
    ...actionFabrique({docTypeId}),
    closeModal
}, dispatch);

const mapStateToProps = (state: StoreType, {docTypeId}: TemplatesScrollerType): MapStateToPropsType => ({
    isLoading: Scroller.selectors.getLoadingState(state, buildScrollerName(docTypeId)),
    page: Scroller.selectors.getActivePage(state, buildScrollerName(docTypeId)),
    activeRow: Scroller.selectors.getActiveRow(state, buildScrollerName(docTypeId)),
    totalRecords: Scroller.selectors.getTotalRecords(state, buildScrollerName(docTypeId)),
    activePage: Scroller.selectors.getActivePage(state, buildScrollerName(docTypeId)),
    recordsCount: Scroller.selectors.getRecordsCount(state, buildScrollerName(docTypeId))
});

class TemplatesScrollerComponent extends PureComponent<ScrollerType> {
    componentDidMount() {
        this.props.setActiveRow();
    }

    render() {
        const {
            docTypeId,
            createModalTemplates,
            filterView: Filter,
            ...props
        } = this.props;

        const {
            activeRow,
            page,
            totalRecords,
            recordsCount,
            setRecordsCount,
            setActivePage,
            setActiveRow
        } = props;

        const submit = {
            onClick: () => {
                createModalTemplates(activeRow);
                props.closeModal();
                setActiveRow();
            },
            disabled: !activeRow,
            title: 'buttons.choose'
        };

        const pagination = {
            page,
            totalRecords,
            itemsPerPage: recordsCount,
            onChangePage: setActivePage ? (nextPage: number) => setActivePage(nextPage - 1) : noop,
            onChangeItemsPerPage: setRecordsCount
        };

        const filterView = Filter &&
            <Filter
                {...props}
                docTypeId={docTypeId}
            />;

        const tableView = (
            <Table
                {...props}
                scrollerName={buildScrollerName(docTypeId)}
                docTypeId={docTypeId}
            />);

        const footerView = (
            <FooterWithPagination
                submitButton={submit}
                pagination={pagination}
            />);

        return (
            <Scroller.Module
                {...props}
                scrollerName={buildScrollerName(docTypeId)}
                initParams={TEMPLATES_INITIAL_PARAMS}
                filterView={filterView}
                tableView={tableView}
                footerView={footerView}
            />);
    }
}

export const TemplatesScroller = connect(
    mapStateToProps,
    mapDispatchToProps
)(TemplatesScrollerComponent);
