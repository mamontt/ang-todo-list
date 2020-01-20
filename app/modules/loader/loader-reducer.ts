/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {SimpleAction} from './../../utils/common-flow-types';
import {START, DONE, ERROR, FINISHED} from './loader-constants';

type State = { [str: string]: boolean };

export const loaderReducer = (state: State = {}, action: SimpleAction): State => {
    // If successfully done
    if (action.type.match(START)) {
        return {...state, [action.meta.namespace]: true};
    } else if (
        action.type.match(DONE) ||
        action.type.match(ERROR) ||
        action.type.match(FINISHED)
    ) {
        return {...state, [action.meta.namespace]: false};
    }
    return state;
};
