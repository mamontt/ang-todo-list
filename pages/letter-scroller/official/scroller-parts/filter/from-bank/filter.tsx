/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {letterOfficial} from './../../../../../../api/letter';
import {FROM_BANK, TO_BANK} from './../../../../../../modules/define-letter-direction';
import {LETTER_SCROLLER_NAME_FROM_BANK} from '../../../../../../pages/letter-scroller/constants';
import {STATUSES} from './../../../../../../constants/statuses';
import {mapToTranslate} from './../../../../../../utils/translate';
import {officialActionFabriqueFromBank} from '../../../../../../pages/letter-scroller/official/letter-scroller-from-bank/official-action-fabrique-from-bank';
import {getCommonFilterView} from '../../../../../../pages/letter-scroller/common/filter';
import {
    searcherFields,
    searcherGroups,
    getCommonSearcher
} from '../../../../../../pages/letter-scroller/official/scroller-parts/common-searcher-view';
import {fromBankOfficialStatusFilters, FormCounterparts} from './filter-options';
import {OFFICIAL} from '../../../../../../modules/user-context';

const statusItems = mapToTranslate('of', [
    STATUSES.DRAFT, // Черновик
    STATUSES.NEW, // Новый
    STATUSES.PARTLY_SIGNED_BY_BANK, // Частично подписан Банком
    STATUSES.SIGNED_BY_BANK, // Подписан Банком
    STATUSES.SENDING, // К отправке
    STATUSES.OBTAINED_BY_CLIENT, // Получен клиентом
    STATUSES.EXECUTED, // Обработан клиентом
    STATUSES.RECALLED_BY_BANK, // Отозван Банком
    STATUSES.DETAILS_ERROR, // Ошибка реквизитов
    STATUSES.WRONG_E_SIGNATURE // ЭП неверна
]);

const SearcherView = getCommonSearcher({
    actions: officialActionFabriqueFromBank,
    searcherFields,
    searcherGroups,
    scrollerName: LETTER_SCROLLER_NAME_FROM_BANK
});

export const FilterViewFromBank = getCommonFilterView({
    scrollerName: LETTER_SCROLLER_NAME_FROM_BANK,
    actions: officialActionFabriqueFromBank,
    resource: letterOfficial(TO_BANK),
    tabs: fromBankOfficialStatusFilters,
    statusItems,
    formCounterparts: FormCounterparts,
    SearcherView,
    letterDirection: FROM_BANK,
    userContext: OFFICIAL
});
