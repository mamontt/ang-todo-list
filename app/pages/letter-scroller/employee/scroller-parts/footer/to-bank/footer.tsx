/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {LETTER_SCROLLER_NAME_TO_BANK} from '../../../../../../pages/letter-scroller/constants';
import {getCommonFooterView} from '../../../../../../pages/letter-scroller/common/footer';
import {actionFabriqueToBank} from '../../../../../../pages/letter-scroller/employee/letter-scroller-to-bank/action-fabrique-to-bank';

export const FooterViewToBank = getCommonFooterView(LETTER_SCROLLER_NAME_TO_BANK, actionFabriqueToBank);
