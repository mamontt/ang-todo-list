/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2018 VTB Group. All rights reserved.
 */
import {createSelector} from 'reselect';
import {get, isNil} from 'lodash';
import {formValueSelector} from 'redux-form';
import {payloadSelector} from '@vtb/services/auth';
import {ASSIGN, ASSIGN_SELF, ASSIGN_ANY, NOT_APPLICABLE} from './../../../constants/document-action-capabilities';
import {getDictionary, OFFICIALS_ASSIGN} from '../../../modules/dictionary-new';
import {StoreType} from './../../../store/root-selector';

type UserRef = string | number

export type UserType = {
    fio: string,
    id: number,
    userRef?: UserRef
}

export const getFormValue = (state: StoreType, form: string, field: string): string =>
    (isNil(form) && isNil(field) ? undefined : formValueSelector(form)(state, field));

export const userNameSelector = createSelector(payloadSelector, payload => get(payload, 'uid', null));

export const getOfficials = (state: StoreType) => getDictionary(OFFICIALS_ASSIGN)(state);

export const getNameUser = (fio: string, ref: UserRef) => ((!isNil(fio) && fio !== NOT_APPLICABLE) ? fio : ref);

export const getCapability = createSelector(
    (capabilities: Array<string>) => capabilities.find(elem => ASSIGN.includes(elem)),
    capability => (capability || undefined)
);

const getUser = (officials: Array<Object>, id: number) =>
    officials.find(({userRef}: UserType) => userRef === id);

export const getUserSelector = createSelector(
    getOfficials,
    userNameSelector,
    (officials, userId) => getUser(officials, userId)
);

export const getInitialValues = (capabilities: Array<string>) => createSelector(
    getOfficials,
    userNameSelector,
    (officials, userId) => {
        const user: {id?: number} = getUser(officials, userId);
        const capability = getCapability(capabilities) || ASSIGN_ANY;
        return ((capability === ASSIGN_SELF || capability === ASSIGN_ANY) && user)
            ? {userId: user.id}
            : {userId: null};
    }
);

export const officialsMap = createSelector(
    officials => officials,
    (officials: Array<Object>) =>
        officials.map(({ id, fio, userRef }: UserType) => ({ value: id, title: getNameUser(fio, userRef) }))
);

export const officialsMapWithOutUser = createSelector(
    (officials: Array<Object>, userId: number) => ({officials, userId}),
    ({officials, userId}) => officialsMap(
        officials.filter(({ id }: UserType) => id !== userId)
    )
);

