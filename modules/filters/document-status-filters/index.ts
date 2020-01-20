/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import * as COMMON from './common';
import * as CLIENT from './client';
import * as EMPLOYEE from './employee';

export const DOCUMENT_STATUS_FILTERS = {
    ...COMMON,
    ...CLIENT,
    ...EMPLOYEE
};
