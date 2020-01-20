/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2018 VTB Group. All rights reserved.
 */
import {Scroller} from '@vtb/fe-ui-table';
import {createSelector} from 'reselect';
import {get, memoize} from 'lodash';
import {getDomain} from './../../store/root-selector';
import {DICTIONARY_STORE_KEY, DICTIONARY_COMMON_SCROLLER} from './constants';
import {CLIENTS, CLIENT_GROUPS} from './dictionary-names';
import {StoreType} from '../../store/root-selector';

const DEFAULT_DICTIONARIES_STATE = {};
const DEFAULT_DICTIONARIES_ITEMS: Array<Object> = [];

const dictionaryDomain = getDomain(DICTIONARY_STORE_KEY, DEFAULT_DICTIONARIES_STATE);

export const getDictionary = memoize(
    (name: string, parametricDictionaries?: boolean) => createSelector(
        dictionaryDomain,
        allDictionaries => (parametricDictionaries
            ? get(allDictionaries, `parametricDictionaries.${name}`, DEFAULT_DICTIONARIES_ITEMS)
            : get(allDictionaries, name, DEFAULT_DICTIONARIES_ITEMS))
    ),
    (name, parametricDictionaries) => (parametricDictionaries ? `${name}/parametric` : `${name}/simple`)
);

export const getLoadingState = (state: StoreType): boolean => Scroller.selectors.getLoadingState(state) || false;
export const getFilters = (state: StoreType) => Scroller.selectors.getFilters(state, DICTIONARY_COMMON_SCROLLER);
export const getNotExistInns = (state: StoreType) => Scroller.selectors.getData(state, DICTIONARY_COMMON_SCROLLER, 'notExistInns');
export const getTotalInns = (state: StoreType) => Scroller.selectors.getTotalRecords(
    state,
    DICTIONARY_COMMON_SCROLLER
);
export const getDictionaryClients = getDictionary(CLIENTS);
export const getDictionaryClientGroups = getDictionary(CLIENT_GROUPS);
