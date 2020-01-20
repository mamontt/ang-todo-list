/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {letterOfficial} from './../../../../../../api/letter';
import {TO_BANK} from './../../../../../../modules/define-letter-direction';
import {LETTER_SCROLLER_NAME_TO_BANK} from '../../../../../../pages/letter-scroller/constants';
import {STATUSES} from './../../../../../../constants/statuses';
import {mapToTranslate} from './../../../../../../utils/translate';
import {officialActionFabriqueToBank} from '../../../../../../pages/letter-scroller/official/letter-scroller-to-bank/official-action-fabrique-to-bank';
import {getCommonFilterView} from '../../../../../../pages/letter-scroller/common/filter';
import {
    searcherFields,
    searcherGroups,
    getCommonSearcher
} from '../../../../../../pages/letter-scroller/official/scroller-parts/common-searcher-view';
import {toBankOfficialStatusFilters, FormCounterparts} from './filter-options';
import {OFFICIAL} from '../../../../../../modules/user-context';

const statusItems = mapToTranslate('ot', [
    STATUSES.OBTAINED_BY_BANK, // Принят
    STATUSES.EXECUTED, // Обработан
    STATUSES.RECALLED, // Отозван
    STATUSES.DETAILS_ERROR, // Ошибка реквизитов
    STATUSES.WRONG_E_SIGNATURE, // ЭП неверна
    STATUSES.REJECTED, // Отказан
    STATUSES.DELIVERED, // Доставлен,
    STATUSES.IN_PROCESS, // В обработке
    STATUSES.DELIVERED, // Отправлен
    STATUSES.IN_PROCESS // В обработке
]);

const SearcherView = getCommonSearcher({
    actions: officialActionFabriqueToBank,
    searcherFields,
    searcherGroups,
    scrollerName: LETTER_SCROLLER_NAME_TO_BANK
});

export const FilterViewToBank = getCommonFilterView({
    scrollerName: LETTER_SCROLLER_NAME_TO_BANK,
    actions: officialActionFabriqueToBank,
    resource: letterOfficial(TO_BANK),
    tabs: toBankOfficialStatusFilters,
    statusItems,
    formCounterparts: FormCounterparts,
    SearcherView,
    letterDirection: TO_BANK,
    userContext: OFFICIAL
});
