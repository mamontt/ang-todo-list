/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2018 VTB Group. All rights reserved.
 */
import {resource} from '../../modules/resource';
import {GET} from '../../constants/request-types';
import {getDictionaryUrl, PatchAdapter} from './urls';
import {DEFAULT_DATA_PATH} from './constants';
import {DICTIONARY_DESCRIPTORS} from './dictionary-descriptors';
import {QueryParamsType, DictionaryNameType} from './flow-types';

type fetchDictionaryType = {
    name: DictionaryNameType;
    fetchParams?: QueryParamsType;
    pathAdapter?: PatchAdapter;
}

type ResponseType = {
    [data: string]: any;
    total: number;
}

export const fetchDictionary = <D>({
    name,
    fetchParams = {method: GET, params: {}},
    pathAdapter
}: fetchDictionaryType): Promise<Array<D>> => {
    return resource(
        getDictionaryUrl(DICTIONARY_DESCRIPTORS[name], pathAdapter, fetchParams.queryParams)
    )[fetchParams.method]({...fetchParams.params})
        .then((response: ResponseType) => response[DICTIONARY_DESCRIPTORS[name].dataPath || DEFAULT_DATA_PATH]);
};
