/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2018 VTB Group. All rights reserved.
 */
import {without} from 'lodash';
import url from 'url';
import {API_URL} from './../../api';
import {makeUrlObj} from '../resource/resource';
import * as dictionaryNames from './dictionary-names';
import {QueryParams} from './flow-types';

const DICTIONARY_URL = 'ui/dictionaries';

type $Values<O extends object> = O[keyof O];
type UrlParams = {
    service: string;
    endPoint?: $Values<typeof dictionaryNames> | string;
    dictionaryUrl?: string;
    urlParams?: string;
};
export type PatchAdapter = (params: UrlParams) => string;

export const getDictionaryUrl = ({
    service,
    endPoint,
    urlParams,
    dictionaryUrl = DICTIONARY_URL
}: UrlParams, pathAdapter?: PatchAdapter, params?: QueryParams) => {
    const queryParams = params ? url.format(makeUrlObj(params)) : '';
    return (
        pathAdapter
            ? pathAdapter({
                service, endPoint, dictionaryUrl, urlParams
            })
            : without([API_URL, service, dictionaryUrl, endPoint, queryParams], undefined).join('/')
    );
};
