/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {Scroller} from '@vtb/fe-ui-table';
import {
    EMPLOYEE_FETCH_LETTER_SCROLLER_URL, EMPLOYEE_CAPABILITIES_URL,
    EMPLOYEE_LETTER_SCROLLER_COUNTERS
} from './../../../../api/urls';
import {LETTER_SCROLLER_NAME_FROM_BANK} from '../../../../pages/letter-scroller/constants';
import {GET, POST} from '../../../../constants/request-types-big';

export const actionFabriqueFromBank = Scroller.actionFabrique({
    scrollerName: LETTER_SCROLLER_NAME_FROM_BANK,
    dataUrl: EMPLOYEE_FETCH_LETTER_SCROLLER_URL,
    dataPath: 'data',
    capabilitiesUrl: EMPLOYEE_CAPABILITIES_URL,
    unionCapabilities: true,
    capabilitiesKey: 'ids',
    capabilitiesResponseKey: '',
    countersUrl: EMPLOYEE_LETTER_SCROLLER_COUNTERS,
    countPageKey: 'count',
    fetchParams: {
        method: GET,
        params: {
            toBank: false
        }
    },
    capabilitiesFetchParams: {
        method: POST
    },
    fetchCountersParams: {
        method: GET,
        params: {
            toBank: false
        }
    },
    restoreItems: []
});
