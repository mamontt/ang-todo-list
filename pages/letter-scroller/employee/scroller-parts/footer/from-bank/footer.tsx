/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {LETTER_SCROLLER_NAME_FROM_BANK} from '../../../../../../pages/letter-scroller/constants';
import {getCommonFooterView} from '../../../../../../pages/letter-scroller/common/footer';
import {actionFabriqueFromBank} from '../../../../../../pages/letter-scroller/employee/letter-scroller-from-bank/action-fabrique-from-bank';

export const FooterViewFromBank = getCommonFooterView(LETTER_SCROLLER_NAME_FROM_BANK, actionFabriqueFromBank);
