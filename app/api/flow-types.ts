/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import * as ResponseCodes from './response-codes';

export type $Values<O extends object> = O[keyof O];
export type ResponseDataType = Object;
export type ResponseType = {
    status?: $Values<typeof ResponseCodes>,
    data?: ResponseDataType
}
