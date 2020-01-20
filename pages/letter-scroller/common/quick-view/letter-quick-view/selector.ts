/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {get} from 'lodash';
import {MDASH} from './../../../../../constants/default-values';
import {DocumentValues} from '../../../../../pages/letter-scroller/flow-types';

export const getValueByCode = (document: DocumentValues, valueCode: string): string =>
    get(document, valueCode) || MDASH;

export type PhoneByCode = {
    phoneNumber: string;
    phoneCode: string;
}

// TODO wrap to imemoizeLast from mport {memoizeLast} from '@vtb/services/utils';
export const getPhoneByCode = (document: DocumentValues, valueCode: string): PhoneByCode => (
    !(get(document, `${valueCode}.phoneNumber`) ||
    get(document, `${valueCode}.phoneCode`)) ?
        null :
        {
            phoneNumber: get(document, `${valueCode}.phoneNumber`),
            phoneCode: get(document, `${valueCode}.phoneCode`)
        }
);
