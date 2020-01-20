/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {combineReducers} from 'redux';
import {changesHistoryReducer, CHANGES_HISTORY_STORE_KEY} from '@vtb/fe-bi-changes-history';
import {LinkedDocuments as LINKED_DOCUMENTS} from '@vtb/fe-bi-linked-documents';
import {documentSignaturesReducer, DOCUMENT_SIGNATURES_STORE_KEY} from '@vtb/fe-bi-signatures-list';
import {DICTIONARY_STORE_KEY, dictionaryReducer} from './../modules/dictionary-new';
import {LOADER_STORE_KEY, loaderReducer} from './../modules/loader';
import {CAPABILITIES_STORE_KEY, capabilitiesReducer} from './../modules/capabilities';
import {LETTER_PAGE_STORE_KEY, reducer as letterReducer} from './../pages/letter-page';
import {DOCUMENT_STACK_COUNT_STORE_KEY} from './../modules/documents-required-attention-counter/constants';
import {documentStackReducer} from './../modules/documents-required-attention-counter/reducer';

export const rootReducer = combineReducers({
    [DICTIONARY_STORE_KEY]: dictionaryReducer,
    [CAPABILITIES_STORE_KEY]: capabilitiesReducer,
    [LETTER_PAGE_STORE_KEY]: letterReducer,
    [LOADER_STORE_KEY]: loaderReducer,
    [CHANGES_HISTORY_STORE_KEY]: changesHistoryReducer,
    [DOCUMENT_SIGNATURES_STORE_KEY]: documentSignaturesReducer,
    [LINKED_DOCUMENTS.name]: LINKED_DOCUMENTS.reducer,
    [DOCUMENT_STACK_COUNT_STORE_KEY]: documentStackReducer
});
