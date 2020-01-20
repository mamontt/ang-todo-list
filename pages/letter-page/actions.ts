/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {change, clearFields} from 'redux-form';
import {AnyAction, Dispatch} from 'redux';
import {get, sortBy} from 'lodash';
import {addNotification, notificationTypes} from '@vtb/fe-ui-alert';
import {clients} from './../../api/letter';
import {LetterDirection} from './../../modules/define-letter-direction';
import {LETTER_PAGE_FETCH_NAMESPACE, LETTER_PAGE_NAME} from '../../pages/letter-page/letter-page-constants';
import {doFetch} from './../../utils/fetchable';
import {NOTIFICATION_LOAD_FAILURE} from './../../modules/dictionary-new';
import {Client} from '../../common-types';
import {fetchLetterTypes, letterTypeNormalize} from '../../modules/dictionary-new';
import {LetterType} from '../../modules/dictionary-new/dictionary-modal/dictionary-modal';
import {PhoneByCode} from '../letter-scroller/common/quick-view/letter-quick-view/selector';

export const CLEAR_FORM = `${LETTER_PAGE_NAME}/CLEAR_FORM`;
// TODO: VTBDBODSF-311, VTBDBODSF-312: added requests actions and document info when changing the tab
export const SET_ACTIVE_TAB = `${LETTER_PAGE_NAME}/SET_ACTIVE_TAB`;

export const clearForm = () => ({type: CLEAR_FORM});

// TODO [Evgenii Kvasiuk] this action must be imported from redux-form, but they have forgotten to export yet  :(
export const updateSyncErrors = (form: string) => ({
    type: '@@redux-form/UPDATE_SYNC_ERRORS',
    meta: {form},
    payload: {syncErrors: {}, error: {}}
});

type Response = {
    data: Array<LetterType>;
}

export const presetLetterType = (letterDirection) => (dispatch: Dispatch<AnyAction>) => {
    fetchLetterTypes(letterDirection)('').then((response: Response) => {
        const type = letterTypeNormalize(sortBy(response.data, d => d.id)[0]);
        dispatch(change(LETTER_PAGE_NAME, 'letterType', type));
        dispatch(change(LETTER_PAGE_NAME, 'dsfTypeDto', type));
    }).catch(() => dispatch(addNotification(NOTIFICATION_LOAD_FAILURE())));
};

export const fetchDocumentNumber = (
    letterDirection: LetterDirection,
    clientSnapshot: Client
) => (dispatch: Function) => {
    const id = (clientSnapshot && clientSnapshot.id) || -1;
    const resource = clients(letterDirection, id);
    dispatch(doFetch(LETTER_PAGE_FETCH_NAMESPACE)(resource.get))
        .then(({result: {value}}:{result:{value: string}}) => {
            dispatch(change(LETTER_PAGE_NAME, 'documentNumber', value));
        });
};

export const disableSave = () => (dispatch: Dispatch<AnyAction>) =>
    dispatch(change(LETTER_PAGE_NAME, 'processing', true));

export const enableSave = () => (dispatch: Dispatch<AnyAction>) =>
    dispatch(change(LETTER_PAGE_NAME, 'processing', false));

type NotificationConfigType = {
    title: string;
    content: (type: string, fileName: string) => string | string;
}

export const rejectedFile = (
    fileName: string,
    type: string,
    notificationConfig: NotificationConfigType
) => (dispatch: Function) => {
    dispatch(enableSave());
    if (!notificationConfig) return;
    const notification = {
        title: notificationConfig.title,
        content: notificationConfig.content(type, fileName),
        type: notificationTypes.error
    };
    dispatch(addNotification(notification));
};

// TODO: VTBDBODSF-311, VTBDBODSF-312: added requests actions and document info when changing the tab
export const setActiveTab = (activeTab: string) => ({
    type: SET_ACTIVE_TAB,
    payload: {activeTab}
});

const clearResponsibleOfficer = (field: string) => (dispatch: Dispatch<AnyAction>) =>
    dispatch(clearFields(LETTER_PAGE_NAME, false, false, field));

export const clearClientResponsibleOfficer = () => clearResponsibleOfficer('clientResponsibleOfficer');

export type ResponsibleOfficerType = {
    phoneNumber?: string;
    phoneCountryCode?: string;
    getValue: (code: string) => string;
    getPhone: (code: string) => PhoneByCode;
}

const presetResponsibleOfficerPhone = (field: string) =>
    ({phoneNumber, phoneCountryCode: phoneCode}: ResponsibleOfficerType) =>
        (dispatch: Dispatch<AnyAction>) => {
            if (phoneNumber && phoneCode) {
                const value = {
                    phoneCode,
                    phoneNumber
                };
                dispatch(change(LETTER_PAGE_NAME, field, value));
            } else {
                dispatch(change(LETTER_PAGE_NAME, field, null));
            }
        };

export const presetClientResponsibleOfficerPhone = presetResponsibleOfficerPhone('clientResponsibleOfficer.phone');

export const presetBankResponsibleOfficerPhone = presetResponsibleOfficerPhone('bankResponsibleOfficer.phone');
