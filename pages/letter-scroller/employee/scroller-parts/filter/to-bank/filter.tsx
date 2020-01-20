/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {letter} from './../../../../../../api/letter';
import {TO_BANK} from './../../../../../../modules/define-letter-direction';
import {LETTER_SCROLLER_NAME_TO_BANK} from '../../../../../../pages/letter-scroller/constants';
import {STATUSES} from './../../../../../../constants/statuses';
import {mapToTranslate} from './../../../../../../utils/translate';
import {actionFabriqueToBank} from '../../../../../../pages/letter-scroller/employee/letter-scroller-to-bank/action-fabrique-to-bank';
import {getCommonFilterView} from '../../../../../../pages/letter-scroller/common/filter';
import {toBankEmployeeStatusFilters, FormCounterparts} from './filter-options';
import {EMPLOYEE} from '../../../../../../modules/user-context';

const statusItems = mapToTranslate('et', [
    STATUSES.DRAFT, // Черновик
    STATUSES.NEW, // Новый
    STATUSES.PARTLY_SIGNED, // Частично подписан
    STATUSES.SIGNED, // Подписан
    STATUSES.OBTAINED_BY_BANK, // Получен Банком
    STATUSES.EXECUTED, // Обработан
    STATUSES.RECALLED, // Отозван
    STATUSES.DETAILS_ERROR, // Ошибка реквизитов
    STATUSES.WRONG_E_SIGNATURE, // ЭП неверна
    STATUSES.REJECTED, // Отказан
    STATUSES.DELIVERED, // Отправлен
    STATUSES.IN_PROCESS // В обработке
]);

export const FilterViewToBank = getCommonFilterView({
    scrollerName: LETTER_SCROLLER_NAME_TO_BANK,
    actions: actionFabriqueToBank,
    resource: letter(TO_BANK),
    tabs: toBankEmployeeStatusFilters,
    statusItems,
    formCounterparts: FormCounterparts,
    letterDirection: TO_BANK,
    userContext: EMPLOYEE
});
