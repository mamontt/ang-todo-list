/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {Fragment} from 'react';
import {get} from 'lodash';
import {QuickView} from '@vtb/fe-bi-quick-view';
import {QuickViewComponentProps} from '../../../../../pages/letter-scroller/flow-types';
import {NumberDateStatus} from './number-date-status';
import {TopicAndContent} from './topic-and-content';
import {Branch} from './branch';
import {Client} from './client';
import {Attachments} from './attachments';
import {CancelRequestReason} from './cancel-request-reason';

const BranchAndClient = ({documentValues}: QuickViewComponentProps) => (documentValues.toBank ?
    (
        <Fragment>
            <Client documentValues={documentValues} />
            <Branch documentValues={documentValues} />
        </Fragment>
    ) : (
        <Fragment>
            <Branch documentValues={documentValues} />
            <Client documentValues={documentValues} />
        </Fragment>
    )
);

const RenderCancelRequestReason = ({documentValues}: QuickViewComponentProps) => {
    const cancelReason = get(documentValues, 'cancelReq.reason');
    return cancelReason ? <CancelRequestReason cancelReason={cancelReason} /> : null;
};

export const LetterQuickView = ({documentValues, userContext, recallAction}: QuickViewComponentProps) => (
    <QuickView.Layout>
        <NumberDateStatus
            documentValues={documentValues}
            recallAction={recallAction}
            userContext={userContext}
        />
        <RenderCancelRequestReason documentValues={documentValues} />
        <BranchAndClient documentValues={documentValues} />
        <TopicAndContent
            documentValues={documentValues}
            userContext={userContext}
        />
        <Attachments documentValues={documentValues} />
    </QuickView.Layout>
);
