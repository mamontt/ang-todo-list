/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {mapValues} from 'lodash';

export const dictionaryAdapter = (dictionary: any, i18n: (key: string, params?: any) => string) =>
    mapValues(dictionary.ru, (value: any, key: string) => (params: any) => i18n(key, params));
