/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2018 VTB Group. All rights reserved.
 */
import request from '@vtb/services/request';
import {AnyAction, Dispatch} from 'redux';
import {change} from 'redux-form';
import {get, isObject} from 'lodash';
import {GET} from '../../../../constants/request-types-big';
import {DICTIONARY_OFFICIALS_URL} from '../../../../api/dictionaries';
import {LETTER_PAGE_NAME} from '../../letter-page-constants';
import {OfficialCommonDto} from '../../../../modules/dictionary-new';

type Response ={
    data: {
        data: Array<OfficialCommonDto>;
    };
}

export const setDefaultOfficers = (
    branchId: number,
    userNameSelector: string
) => (dispatch: Dispatch<AnyAction>) => {
    request({
        GET,
        params: {
            branchId,
            size: 10000
        },
        url: DICTIONARY_OFFICIALS_URL
    }).then((response: Response) => {
        const data = get(response, 'data.data', []);
        const defaultOfficial = data.filter((item: OfficialCommonDto) => item.userRef === userNameSelector);
        if (defaultOfficial.length) {
            const {fio = '', phone = ''} = defaultOfficial[0] || {};
            const onlyNumbers = isObject(phone) ? (phone.phoneNumber || '') :
                phone.replace(/[^\d]/g, '');
            const phoneNumber = onlyNumbers && onlyNumbers.slice(-10);
            const phoneCode = isObject(phone) ? (phone.phoneCode || '7') :
                (onlyNumbers && onlyNumbers.replace(phoneNumber, '')) || '7';

            dispatch(change(LETTER_PAGE_NAME, 'bankResponsibleOfficer.name', fio));
            dispatch(change(LETTER_PAGE_NAME, 'bankResponsibleOfficer.phone', {
                phoneCode,
                phoneNumber
            }));
        } else {
            dispatch(change(LETTER_PAGE_NAME, 'bankResponsibleOfficer', null));
        }
    });
};
