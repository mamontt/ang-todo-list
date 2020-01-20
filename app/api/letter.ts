/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {keys, memoize} from 'lodash';
import {resource} from './../modules/resource';
import * as ResourceMethods from './../constants/request-types';
import {GET} from './../constants/request-types-big';
import {LetterDirection, TO_BANK} from './../modules/define-letter-direction';
import {LT_API_URL, OFFICIAL_NAMESPACE} from './urls';
import {EMPLOYEE} from '../modules/user-context';

type LetterDirectionType = {
    params: Object,
    method: string
}

const letterDirectionInterceptor = (letterDirection: LetterDirection) => ({
    params = {},
    method,
    ...otherParams
}: LetterDirectionType) =>
    ({
        method,
        ...otherParams,
        params: {
            ...params,
            ...method === GET ? {toBank: letterDirection === TO_BANK} : {}
        }
    });

export const getDocumentCheckUrl = (
    letterDirection: LetterDirection,
    documentId: number | string,
    typeOfUser: string
) => {
    return typeOfUser === EMPLOYEE
        ? `${LT_API_URL}/letters/${documentId}/checks`
        : `${LT_API_URL}/${OFFICIAL_NAMESPACE}/letters/${documentId}/checks`;
};

export const letter = memoize((letterDirection: LetterDirection) =>
    resource(`${LT_API_URL}/letters`, keys(ResourceMethods), letterDirectionInterceptor(letterDirection)));

export const letterOfficial = memoize((letterDirection: LetterDirection) =>
    resource(`${LT_API_URL}/${OFFICIAL_NAMESPACE}/letters`, keys(ResourceMethods), letterDirectionInterceptor(letterDirection)));

export const clientApi = '/api/letters/api/clients/';

export const clients = (letterDirection: LetterDirection, id: number) =>
    resource(letterDirection === TO_BANK
        ? `${clientApi}${id}/numbers/LETTER_TO_BANK`
        : `${clientApi}${id}/numbers/LETTER_FROM_BANK`, keys(ResourceMethods));

export const clientsFromBank = (id: number) =>
    resource(`${clientApi}${id}/numbers/LETTER_FROM_BANK`, keys(ResourceMethods));

export const TEMPLATE_URL = `${LT_API_URL}/ui/templates`;
