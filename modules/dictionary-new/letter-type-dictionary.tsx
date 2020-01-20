/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {createColumnsTranslator, createSimpleDictionary} from '@vtb/fe-bi-dictionary';
import {SHOW_RIGHT, MODAL_SIZES} from '@vtb/fe-ui-dialog';
import {translate} from './../../utils/translate';
import {DICTIONARY_LETTER_TYPE_URL} from './../../api/dictionaries';
import {TranslateDictionaryTitle} from './translate-dictionary-title';

export const LETTER_TYPE_FROM_BANK_MODAL_NAME = 'fe-dictionaries/LetterTypeFromBank';
export const LETTER_TYPE_TO_BANK_MODAL_NAME = 'fe-dictionaries/LetterTypeToBank';

const SCROLLER_COLUMNS = [
    {
        name: 'dsfSubTypeDto.subNameTypeDbo',
        label: () => translate('dictionary.letter-type'),
        sortable: false,
        width: 636
    }
];

const getLetterTypeDictionary = (name: string, codeTypeDbo: number) => createSimpleDictionary({
    name,
    getColumns: createColumnsTranslator(SCROLLER_COLUMNS),
    title: <TranslateDictionaryTitle title="dictionary.letter-type.title" />,
    url: DICTIONARY_LETTER_TYPE_URL,
    filters: {
        locale: 'ru_RU',
        codeTypeDbo,
        isDeleted: false,
        active: true
    },
    withSearch: true,
    countPageKey: 'size'
});

const getLetterTypeModal = (name: string, codeTypeDbo: number) => ({
    view: name,
    type: SHOW_RIGHT,
    component: getLetterTypeDictionary(name, codeTypeDbo),
    params: {width: MODAL_SIZES.MEDIUM},
    closable: true
});

export const LetterTypeFromBankModal = getLetterTypeModal(LETTER_TYPE_FROM_BANK_MODAL_NAME, 2);
export const LetterTypeToBankModal = getLetterTypeModal(LETTER_TYPE_TO_BANK_MODAL_NAME, 1);
