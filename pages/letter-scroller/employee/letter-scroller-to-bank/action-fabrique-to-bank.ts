/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {Scroller} from '@vtb/fe-ui-table';
import {log} from '@vtb/services/logger';
import {
    EMPLOYEE_FETCH_LETTER_SCROLLER_URL,
    EMPLOYEE_CAPABILITIES_URL,
    EMPLOYEE_LETTER_SCROLLER_COUNTERS
} from './../../../../api/urls';
import {LETTER_SCROLLER_NAME_TO_BANK} from '../../../../pages/letter-scroller/constants';
import {GET, POST} from '../../../../constants/request-types-big';

log.log('Scroller', Scroller);

export const actionFabriqueToBank = Scroller.actionFabrique({
    scrollerName: LETTER_SCROLLER_NAME_TO_BANK,
    dataUrl: EMPLOYEE_FETCH_LETTER_SCROLLER_URL,
    // dataPath: 'data',
    capabilitiesUrl: EMPLOYEE_CAPABILITIES_URL,
    capabilitiesKey: 'ids',
    // capabilitiesResponseKey: '',
    countersUrl: EMPLOYEE_LETTER_SCROLLER_COUNTERS,
    unionCapabilities: true,
    countPageKey: 'count',
    capabilitiesFetchParams: {
        method: POST
    },
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
    restoreItems: []
});
