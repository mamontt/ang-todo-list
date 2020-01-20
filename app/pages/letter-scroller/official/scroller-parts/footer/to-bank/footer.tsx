/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {LETTER_SCROLLER_NAME_TO_BANK} from '../../../../../../pages/letter-scroller/constants';
import {getCommonFooterView} from '../../../../../../pages/letter-scroller/common/footer';
import {officialActionFabriqueToBank} from '../../../../../../pages/letter-scroller/official/letter-scroller-to-bank/official-action-fabrique-to-bank';

export const FooterViewToBank = getCommonFooterView(LETTER_SCROLLER_NAME_TO_BANK, officialActionFabriqueToBank);
