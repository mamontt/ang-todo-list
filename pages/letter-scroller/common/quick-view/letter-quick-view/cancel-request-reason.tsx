/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {QuickView} from '@vtb/fe-bi-quick-view';
import {translate} from './../../../../../utils/translate';

type CancelRequestReasonProps = {
    cancelReason: string;
}

export const CancelRequestReason = ({cancelReason}: CancelRequestReasonProps) => (
    <QuickView.Block>
        <QuickView.Line label={translate('common.recallReason')}>
            <QuickView.SimpleValue>
                {cancelReason}
            </QuickView.SimpleValue>
        </QuickView.Line>
    </QuickView.Block>
);
