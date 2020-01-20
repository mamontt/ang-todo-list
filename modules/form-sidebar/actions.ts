/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import * as CAPABILITIES from './../../constants/document-action-capabilities';

export const SAVE = 'SAVE';
export const {CORRECTION} = CAPABILITIES;
export const {COPY} = CAPABILITIES;
export const {SIGN} = CAPABILITIES;
export const {SEND} = CAPABILITIES;
export const {SIGN_AND_SEND} = CAPABILITIES;
export const {PRINT} = CAPABILITIES;
export const {EXPORT} = CAPABILITIES;
export const {DELETE} = CAPABILITIES;
export const {RECALL} = CAPABILITIES;
export const {REMOVE_SIGNATURE} = CAPABILITIES;
export const {FAVORITE} = CAPABILITIES;
export const MISC = 'MISC'; // stub
export const {CLIENT_SIGN} = CAPABILITIES;
export const {SAVE_TEMPLATE} = CAPABILITIES;
export const {CREATE_BY_TEMPLATE} = CAPABILITIES;

// bank side
export const {REJECT} = CAPABILITIES;
export const {TAKE_IN_PROCESS} = CAPABILITIES;
export const {RETURN} = CAPABILITIES;
export const {EXECUTE} = CAPABILITIES;
export const {PROCESS_COMPLETE} = CAPABILITIES;

// cancellation
export const {CANCELLATION} = CAPABILITIES;
