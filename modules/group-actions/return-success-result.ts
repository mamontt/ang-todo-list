/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {GenericDocument} from './generic-document';

export const returnSuccessResult = (document: GenericDocument) => (data?: any) => ({
    document,
    result: {
        error: false,
        data
    }
});
