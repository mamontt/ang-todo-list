/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {LETTER_SCROLLER_NAME_FROM_BANK} from '../../../../../../pages/letter-scroller/constants';
import {officialActionFabriqueFromBank} from '../../../../../../pages/letter-scroller/official/letter-scroller-from-bank/official-action-fabrique-from-bank';
import {getCommonQuickView} from '../../../../../../pages/letter-scroller/common/quick-view';

export const QuickViewFromBank = getCommonQuickView(LETTER_SCROLLER_NAME_FROM_BANK, officialActionFabriqueFromBank);
