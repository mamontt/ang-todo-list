/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {PureComponent} from 'react';
import {connect} from 'react-redux';
import {head} from 'lodash';
import {Scroller} from '@vtb/fe-ui-table';
import {LETTER_SCROLLER_INITIAL_PARAMS, LETTER_SCROLLER_NAME_TO_BANK} from '../../../../pages/letter-scroller/constants';
import {ConnectedActionBarView} from '../../../../pages/letter-scroller/common/scroller-parts/action-bar/action-bar-view';
import {TO_BANK} from './../../../../modules/define-letter-direction';
import {toBankEmployeeStatusFilters} from '../../../../pages/letter-scroller/employee/scroller-parts/filter/to-bank/filter-options';
import {EmptyView} from '../../../../pages/letter-scroller/common/empty-view';
import {LetterScrollerProps, PropsType} from '../../../../pages/letter-scroller/flow-types';
import {actionFabriqueToBank} from './action-fabrique-to-bank';
import {
    TableViewToBank,
    QuickViewToBank,
    FilterViewToBank,
    FooterViewToBank
} from '../scroller-parts';
import {StoreType} from '../../../../store/root-selector';

export const ConnectedLetterScroller = connect(
    (state: StoreType, ownProps: PropsType) => ({
        showEmptyView: Scroller.selectors.getEmptyState(state, ownProps.scrollerName),
        quickViewIsActive: Scroller.selectors.getQuickView(state, ownProps.scrollerName),
        overlayVisible: Scroller.selectors.getOverlayVisibility(state, ownProps.scrollerName)
    }),
    actionFabriqueToBank
)(Scroller.Module);

export const initialParams = {
    ...LETTER_SCROLLER_INITIAL_PARAMS,
    ...{filters: {statusCategory: head(toBankEmployeeStatusFilters).query}}
};

export class LetterScrollerToBank extends PureComponent<LetterScrollerProps> {
    render() {
        return (
            <ConnectedLetterScroller
                scrollerName={LETTER_SCROLLER_NAME_TO_BANK}
                initParams={initialParams}
                currentParams={this.props.location.state}
                actionBarView={<ConnectedActionBarView
                    {...this.props}
                    letterDirection={TO_BANK}
                />}
                tableView={<TableViewToBank
                    {...this.props}
                    scrollerName={LETTER_SCROLLER_NAME_TO_BANK}
                />}
                quickViewView={<QuickViewToBank {...this.props} />}
                filterView={<FilterViewToBank {...this.props} />}
                footerView={<FooterViewToBank />}
                showEmptyView={this.props.showEmptyView}
                emptyView={<EmptyView />}
            />
        );
    }
}
