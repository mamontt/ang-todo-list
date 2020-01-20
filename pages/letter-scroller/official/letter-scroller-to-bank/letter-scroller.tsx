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
import {TO_BANK} from './../../../../modules/define-letter-direction';
import {OfficialConnectedActionBarView} from '../../../../pages/letter-scroller/common/scroller-parts/action-bar/official-action-bar-view';
import {toBankOfficialStatusFilters} from '../../../../pages/letter-scroller/official/scroller-parts/filter/to-bank/filter-options';
import {EmptyView} from '../../../../pages/letter-scroller/common/empty-view';
import {officialActionFabriqueToBank} from './official-action-fabrique-to-bank';
import {LetterScrollerProps, PropsType} from '../../flow-types';
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
        quickViewIsActive: Scroller.selectors.getQuickView(state, ownProps.scrollerName)
    }),
    officialActionFabriqueToBank
)(Scroller.Module);

export const initialParams = {
    ...LETTER_SCROLLER_INITIAL_PARAMS,
    ...{filters: {statusCategory: head(toBankOfficialStatusFilters).query}}
};

export class OfficialLetterScrollerToBank extends PureComponent<LetterScrollerProps> {
    render() {
        return (
            <ConnectedLetterScroller
                scrollerName={LETTER_SCROLLER_NAME_TO_BANK}
                initParams={initialParams}
                currentParams={this.props.location.state}
                actionBarView={<OfficialConnectedActionBarView
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
