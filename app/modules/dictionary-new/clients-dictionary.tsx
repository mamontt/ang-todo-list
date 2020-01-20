/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {createColumnsTranslator, createSimpleDictionary} from '@vtb/fe-bi-dictionary';
import {SHOW_RIGHT, MODAL_SIZES} from '@vtb/fe-ui-dialog';
import {translate} from './../../utils/translate';
import {DICTIONARY_CLIENT_OFFICIALS_URL} from './../../api/dictionaries';
import {TranslateDictionaryTitle} from './translate-dictionary-title';

const MODAL_NAME = 'authorizedPersonModule/DICTIONARY_MODAL_ID';
const SCROLLER_COLUMNS = [
    {
        name: 'fullName',
        label: () => translate('dictionary.fio'),
        sortable: true,
        resizable: true,
        width: 250,
        joinWith: 'jobTitle'
    },
    {
        name: 'jobTitle',
        label: () => translate('dictionary.job-title'),
        width: 150,
        sortable: true
    },
    {
        name: 'phoneNumber',
        label: () => translate('column.phone'),
        sortable: true,
        width: 125,
        joinWith: 'email',
        stretch: true
    },
    {
        name: 'email',
        label: () => translate('column.email'),
        width: 100,
        sortable: true,
        stretch: true
    }
];

const ClientsOfficialsDictionary = createSimpleDictionary({
    name: MODAL_NAME,
    getColumns: createColumnsTranslator(SCROLLER_COLUMNS),
    title: <TranslateDictionaryTitle title="dictionary.clients.officials.title" />,
    url: DICTIONARY_CLIENT_OFFICIALS_URL,
    withSearch: true,
    countPageKey: 'size'
});

export const ClientsOfficialsModal = {
    view: MODAL_NAME,
    type: SHOW_RIGHT,
    component: ClientsOfficialsDictionary,
    params: {width: MODAL_SIZES.MEDIUM},
    closable: true
};
