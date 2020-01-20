/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {isNumber} from 'lodash';
import request from '@vtb/services/request';
import {getDictionaryUrl} from './../../../modules/dictionary-new';
import {GET} from '../../../constants/request-types-big';

type ResponseType = {
    data: {
        data: any;
    };
}

export const fetchItems = (clientId?: number) => (fullTextQuery: string) => {
    if (!isNumber(clientId)) {
        return Promise.resolve([]);
    }

    return (request({
        method: GET,
        params: {
            fullTextQuery,
            page: 0,
            size: 999,
            clientId
        },
        url: getDictionaryUrl({service: 'client-employee', endPoint: 'client-employees'})
    }).then((response: ResponseType) => response.data));
};

export const fetchDictionaryItems = (url: string, method = GET) => (fullTextQuery: string) => (request({
    method,
    params: {
        fullTextQuery
    },
    url
}).then((response: ResponseType) => response.data));
