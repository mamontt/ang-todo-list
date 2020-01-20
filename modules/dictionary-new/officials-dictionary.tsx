/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {createColumnsTranslator, createSimpleDictionary} from '@vtb/fe-bi-dictionary';
import {SHOW_RIGHT, MODAL_SIZES} from '@vtb/fe-ui-dialog';
import {translate} from './../../utils/translate';
import {DICTIONARY_OFFICIALS_URL} from './../../api/dictionaries';
import {TranslateDictionaryTitle} from './translate-dictionary-title';

const MODAL_NAME = 'fe-dictionaries/Officials';
const SCROLLER_COLUMNS = [
    {
        name: 'fio',
        label: () => translate('dictionary.fio'),
        sortable: true,
        width: 230
    },
    {
        name: 'jobTitle',
        label: () => translate('dictionary.job-title'),
        sortable: true,
        width: 200
    },
    {
        name: 'branch.shortName',
        label: () => translate('dictionary.branch'),
        sortable: true,
        width: 200
    }
];

const OfficialsDictionary = createSimpleDictionary({
    name: MODAL_NAME,
    getColumns: createColumnsTranslator(SCROLLER_COLUMNS),
    title: <TranslateDictionaryTitle title="dictionary.officials.title" />,
    url: DICTIONARY_OFFICIALS_URL,
    withSearch: true,
    countPageKey: 'size'
});

export const OfficialsModal = {
    view: MODAL_NAME,
    type: SHOW_RIGHT,
    component: OfficialsDictionary,
    params: {width: MODAL_SIZES.MEDIUM},
    closable: true
};
