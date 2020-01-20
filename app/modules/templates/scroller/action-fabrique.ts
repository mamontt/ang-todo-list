/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2018 VTB Group. All rights reserved.
 */
import {Scroller} from '@vtb/fe-ui-table';
import {POST} from '../../../constants/request-types-big';
import {buildScrollerName} from './utils';
import {TEMPLATES_DESCRIPTORS} from '../template-descriptors';
import {SEARCH} from '../constants';

export const actionFabrique = (
    {clientId, docTypeId}: {clientId?: number, docTypeId: number}
) => Scroller.actionFabrique({
    scrollerName: buildScrollerName(docTypeId),
    dataUrl: `${TEMPLATES_DESCRIPTORS[docTypeId].url}/${SEARCH}`,
    dataPath: 'data',
    countPageKey: 'size',
    fetchParams: {
        method: POST,
        params: {
            docTypeId
        }
    },
    restoreItems: []
});
