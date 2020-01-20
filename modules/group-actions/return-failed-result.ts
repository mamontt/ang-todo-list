/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {GenericDocument} from './generic-document';

export const returnFailedResult = (document: GenericDocument) => (message?: string) => ({
    document,
    result: {
        error: true,
        message
    }
});
