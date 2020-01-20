/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {cloneDeep} from 'lodash';
import {
    SET_CAPABILITIES,
    CLEAR_CAPABILITIES
} from './capabilities-actions';

type CapabilitiesReducerType = {
    type: string;
    payload: Array<string>;
    meta: MetaType;
}

type MetaType = {
    documentName?: string;
}

export const capabilitiesReducer = (state = {}, {type, payload, meta = {}}: CapabilitiesReducerType) => {
    const {documentName}: MetaType = meta;

    switch (type) {
        case SET_CAPABILITIES:
            return {
                ...state,
                current: null,
                [documentName]: cloneDeep(payload)
            };

        case CLEAR_CAPABILITIES:
            return {
                ...state,
                current: null,
                [documentName]: []
            };

        default:
            return state;
    }
};
