/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {combineReducers} from 'redux';
import fetchableReducer from './../../utils/fetchable';
import INITIAL_VALUES from './../../constants/data-structures/letter';
import {CLEAR_FORM, SET_ACTIVE_TAB} from './actions';
import {LETTER_PAGE_FETCH_NAMESPACE} from './letter-page-constants';
import {StoreType} from '../../store/root-selector';
import {ApiMethod} from '../../utils/fetchable';

type Props = {
    type: string;
    payload: {
        activeTab: string;
    };
}

export function formClear(state = INITIAL_VALUES, {type}: Props) {
    switch (type) {
        case CLEAR_FORM:
            return INITIAL_VALUES;
        default:
            return state;
    }
}

// TODO: VTBDBODSF-311, VTBDBODSF-312: added requests actions and document info when changing the tab
export function setActiveTab(state = {activeTab: 0}, {type, payload}: Props) {
    switch (type) {
        case SET_ACTIVE_TAB:
            return {...state, activeTab: payload.activeTab};
        default:
            return state;
    }
}


export default combineReducers({
    initialValues: queueReducers(
        fetchableReducer(LETTER_PAGE_FETCH_NAMESPACE, {initialState: INITIAL_VALUES}),
        formClear
    ),
    tabs: setActiveTab
} as any);

export function queueReducers(...reducers: Array<any>) {
    return (state: StoreType, action: ApiMethod) =>
        reducers.reduce((s, reducer: Function) => reducer(s, action), state);
}
