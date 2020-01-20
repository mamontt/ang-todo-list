/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {PureComponent} from 'react';
import {connect} from 'react-redux';
import {head} from 'lodash';
import {Scroller} from '@vtb/fe-ui-table';
import {LETTER_SCROLLER_INITIAL_PARAMS, LETTER_SCROLLER_NAME_FROM_BANK} from '../../../../pages/letter-scroller/constants';
import {FROM_BANK} from './../../../../modules/define-letter-direction';
import {ConnectedActionBarView} from '../../../../pages/letter-scroller/common/scroller-parts/action-bar/action-bar-view';
import {fromBankEmployeeStatusFilters} from '../../../../pages/letter-scroller/employee/scroller-parts/filter/from-bank/filter-options';
import {EmptyView} from '../../../../pages/letter-scroller/common/empty-view';
import {actionFabriqueFromBank} from './action-fabrique-from-bank';
import {
    TableViewFromBank,
    QuickViewFromBank,
    FilterViewFromBank,
    FooterViewFromBank
} from '../scroller-parts';
import {LetterScrollerProps, PropsType} from '../../flow-types';
import {StoreType} from '../../../../store/root-selector';

export const ConnectedLetterScroller = connect(
    (state: StoreType, ownProps: PropsType) => ({
        showEmptyView: Scroller.selectors.getEmptyState(state, ownProps.scrollerName),
        quickViewIsActive: Scroller.selectors.getQuickView(state, ownProps.scrollerName),
        overlayVisible: Scroller.selectors.getOverlayVisibility(state, ownProps.scrollerName)
    }),
    actionFabriqueFromBank
)(Scroller.Module);

export const initialParams = {
    ...LETTER_SCROLLER_INITIAL_PARAMS,
    ...{filters: {statusCategory: head(fromBankEmployeeStatusFilters).query}}
};

export class LetterScrollerFromBank extends PureComponent<LetterScrollerProps> {
    render() {
        return (
            <ConnectedLetterScroller
                scrollerName={LETTER_SCROLLER_NAME_FROM_BANK}
                initParams={initialParams}
                currentParams={this.props.location.state}
                actionBarView={<ConnectedActionBarView
                    {...this.props}
                    letterDirection={FROM_BANK}
                />}
                tableView={<TableViewFromBank
                    {...this.props}
                    scrollerName={LETTER_SCROLLER_NAME_FROM_BANK}
                />}
                quickViewView={<QuickViewFromBank {...this.props} />}
                filterView={<FilterViewFromBank {...this.props} />}
                footerView={<FooterViewFromBank />}
                showEmptyView={this.props.showEmptyView}
                emptyView={<EmptyView />}
            />
        );
    }
}
