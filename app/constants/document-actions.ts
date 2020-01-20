/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
export const SEND = 'send';
export const RECALL = 'recall';
export const ASSIGN = 'assign';
export const REJECT = 'reject';
export const DELETE = 'delete';
export const COPY = 'copy';
export const RETURN = 'return';
export const EXECUTE = 'execute';
export const PROCESS_COMPLETE = 'process-complete';
export const READ = 'read';
export const CHECK_SIGN = 'check_sign';

export const ACTION_ROUTES: {[key: string]: string} = {
    SEND,
    RECALL,
    ASSIGN,
    REJECT,
    DELETE,
    COPY,
    RETURN,
    EXECUTE,
    PROCESS_COMPLETE,
    READ,
    CHECK_SIGN
};
