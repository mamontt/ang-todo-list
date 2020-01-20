/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {get} from 'lodash';
import {QuickView} from '@vtb/fe-bi-quick-view';
import {translate} from './../../../../../utils/translate';
import {OFFICIAL} from './../../../../../modules/user-context';
import {MDASH} from './../../../../../constants/default-values';
import {QuickViewComponentProps} from '../../../../../pages/letter-scroller/flow-types';

const MAX_CONTENT_SIZE = 160;
const ELLIPSIS_TEXT = '...';

const getContent = (content: string) => (content.length > MAX_CONTENT_SIZE ? `${content.substring(0, 157)}${ELLIPSIS_TEXT}` : content);

export const TopicAndContent = ({documentValues, userContext}: QuickViewComponentProps) => {
    const userContextType = get(userContext, 'type');
    return (
        <QuickView.Block title={translate('common.letter')}>
            <QuickView.Line label={translate('common.subject')} vertical>
                <QuickView.SimpleValue>{get(documentValues, 'topic') || MDASH}</QuickView.SimpleValue>
            </QuickView.Line>

            <QuickView.Line label={translate('common.message')} vertical>
                <QuickView.SimpleValue>
                    {getContent(get(documentValues, 'content') || MDASH)}
                </QuickView.SimpleValue>
            </QuickView.Line>

            {(documentValues.toBank && userContextType === OFFICIAL) &&
            <QuickView.Line label={translate('common.official')} vertical>
                <QuickView.SimpleValue>
                    {get(documentValues, 'official.fio') || MDASH}
                </QuickView.SimpleValue>
            </QuickView.Line>
            }
        </QuickView.Block>
    );
};
