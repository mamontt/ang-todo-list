/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {AxiosError} from 'axios';
import {GenericDocument} from './generic-document';

export const defaultFormatMessage = (result: AxiosError) => result.response.data.message || result.response.statusText;

export const catchGroupError = (document: GenericDocument, formatMessage = defaultFormatMessage) =>
    (result: AxiosError) => ({
        document,
        result: {
            error: true,
            message: formatMessage(result)
        }
    });
