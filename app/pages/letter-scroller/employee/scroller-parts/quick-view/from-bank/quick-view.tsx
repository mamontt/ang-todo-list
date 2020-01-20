/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {LETTER_SCROLLER_NAME_FROM_BANK} from '../../../../../../pages/letter-scroller/constants';
import {actionFabriqueFromBank} from '../../../../../../pages/letter-scroller/employee/letter-scroller-from-bank/action-fabrique-from-bank';
import {getCommonQuickView} from '../../../../../../pages/letter-scroller/common/quick-view';

export const QuickViewFromBank = getCommonQuickView(LETTER_SCROLLER_NAME_FROM_BANK, actionFabriqueFromBank);
