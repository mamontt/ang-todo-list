/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {letter} from './../../../../../../api/letter';
import {FROM_BANK, TO_BANK} from './../../../../../../modules/define-letter-direction';
import {LETTER_SCROLLER_NAME_FROM_BANK} from '../../../../../../pages/letter-scroller/constants';
import {STATUSES} from './../../../../../../constants/statuses';
import {mapToTranslate} from './../../../../../../utils/translate';
import {actionFabriqueFromBank} from '../../../../../../pages/letter-scroller/employee/letter-scroller-from-bank/action-fabrique-from-bank';
import {getCommonFilterView} from '../../../../../../pages/letter-scroller/common/filter';
import {fromBankEmployeeStatusFilters, FormCounterparts} from './filter-options';
import {EMPLOYEE} from '../../../../../../modules/user-context';

const statusItems = mapToTranslate('ef', [
    STATUSES.OBTAINED_BY_CLIENT, //  Поступил от Банка
    STATUSES.EXECUTED, // Обработан
    STATUSES.DETAILS_ERROR, // Ошибка реквизитов
    STATUSES.WRONG_E_SIGNATURE // ЭП неверна
]);

export const FilterViewFromBank = getCommonFilterView({
    scrollerName: LETTER_SCROLLER_NAME_FROM_BANK,
    actions: actionFabriqueFromBank,
    resource: letter(TO_BANK), // TODO: ?
    tabs: fromBankEmployeeStatusFilters,
    statusItems,
    formCounterparts: FormCounterparts,
    letterDirection: FROM_BANK,
    userContext: EMPLOYEE
});
