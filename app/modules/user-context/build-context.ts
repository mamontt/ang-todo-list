/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {UserType, EMPLOYEE} from './constants/user-types';

let buildUserContext: UserType = EMPLOYEE;

export function setBuildUserContext(context: UserType) {
    buildUserContext = context;
}

export function getBuildUserContext() {
    return buildUserContext;
}
