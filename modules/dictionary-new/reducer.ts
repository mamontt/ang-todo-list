/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2018 VTB Group. All rights reserved.
 */
import {handleActions} from '@vtb/services/redux-actions';
import {ROOT_NAMESPACE} from './../../constants/root-namspace';
import {loadDictionary} from './actions';

const dictionaryHandleActions = handleActions(ROOT_NAMESPACE);
const defaultState: Array<Object> = [];

type PropsType = {
    payload: {
        dictionary: Array<Object>,
        meta: {
            name: string,
            force: boolean
        }
    }
}

type StateType = {
    parametricDictionaries?: Array<Object>
}

export const dictionaryReducer = dictionaryHandleActions({
    [loadDictionary]: (state: StateType = {}, {
        payload: {dictionary, meta: {name: dictionaryName, force}}
    }: PropsType) => (force
        ? ({
            ...state,
            parametricDictionaries: {
                ...state.parametricDictionaries,
                [dictionaryName]: dictionary
            }
        })
        : ({
            ...state,
            [dictionaryName]: dictionary
        })
    )
}, defaultState);
