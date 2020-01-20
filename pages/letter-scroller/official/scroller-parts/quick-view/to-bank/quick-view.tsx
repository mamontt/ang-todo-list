/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {LETTER_SCROLLER_NAME_TO_BANK} from '../../../../../../pages/letter-scroller/constants';
import {officialActionFabriqueToBank} from '../../../../../../pages/letter-scroller/official/letter-scroller-to-bank/official-action-fabrique-to-bank';
import {getCommonQuickView} from '../../../../../../pages/letter-scroller/common/quick-view';

export const QuickViewToBank = getCommonQuickView(LETTER_SCROLLER_NAME_TO_BANK, officialActionFabriqueToBank);
