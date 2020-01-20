/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {Component, ComponentType} from 'react';
import {connect} from 'react-redux';
import {Scroller} from '@vtb/fe-ui-table';
import {QuickView} from '@vtb/fe-bi-quick-view';
import {UserContext} from './../../../../modules/user-context';
import {LetterQuickView} from './letter-quick-view';
import {recallAction as callRecallAction} from '../../../../modules/cancel-request';
import {DocumentValues} from '../../flow-types';

export type QuickViewProps = {
    documentValues?: DocumentValues;
    userContext?: UserContext;
    component: ComponentType<any>;
    recallAction?: (action: any) => void;
}

export const getCommonQuickView = (scrollerName: string, actions: Array<string>) => {
    class QuickViewComponent extends Component<QuickViewProps> {
        render() {
            const {documentValues, userContext, recallAction} = this.props;
            return (
                <QuickViewContainer
                    component={LetterQuickView}
                    documentValues={documentValues}
                    userContext={userContext}
                    recallAction={recallAction}
                />
            );
        }
    }
    return connect(
        state => ({
            isLoading: Scroller.selectors.getLoadingState(state, scrollerName),
            documentValues: Scroller.selectors.getActiveRow(state, scrollerName)
        }),
        {
            ...actions,
            recallAction: callRecallAction
        }
    )(QuickViewComponent);
};

const QuickViewContainer = (props: QuickViewProps) => {
    const {component: WrappedComponent, documentValues} = props;
    return (WrappedComponent && documentValues
        ? <WrappedComponent {...props} />
        : <QuickView.SelectDocument />);
};
