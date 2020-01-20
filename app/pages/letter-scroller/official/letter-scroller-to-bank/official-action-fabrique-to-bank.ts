/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {Scroller} from '@vtb/fe-ui-table';
import {
    OFFICIAL_FETCH_LETTER_SCROLLER_URL, OFFICIAL_CAPABILITIES_URL,
    OFFICIAL_LETTER_SCROLLER_COUNTERS
} from './../../../../api/urls';
import {LETTER_SCROLLER_NAME_TO_BANK} from '../../../../pages/letter-scroller/constants';
import {GET, POST} from '../../../../constants/request-types-big';

export const officialActionFabriqueToBank = Scroller.actionFabrique({
    scrollerName: LETTER_SCROLLER_NAME_TO_BANK,
    dataUrl: OFFICIAL_FETCH_LETTER_SCROLLER_URL,
    dataPath: 'data',
    capabilitiesUrl: OFFICIAL_CAPABILITIES_URL,
    capabilitiesKey: 'ids',
    capabilitiesResponseKey: '',
    countersUrl: OFFICIAL_LETTER_SCROLLER_COUNTERS,
    unionCapabilities: true,
    countPageKey: 'count',
    fetchParams: {
        method: GET,
        params: {
            toBank: true
        }
    },
    fetchCountersParams: {
        method: GET,
        params: {
            toBank: true
        }
    },
    capabilitiesFetchParams: {
        method: POST
    },
    restoreItems: []
});
