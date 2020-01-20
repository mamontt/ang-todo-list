/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2018 VTB Group. All rights reserved.
 */
import {
    EDIT,
    DELETE,
    EXPORT,
    FAVOURITE,
    PRINT,
    RECALL,
    SAVE,
    SEND,
    SIGN,
    SIGN_AND_SEND
} from './../../../constants/document-action-capabilities';

export type Descriptor = {
    onClick: () => void,
    actionCreator: () => void,
    text: string,
    group: number,
    icon: (name: string) => string,
    disabled: boolean
}

export type Keys = typeof EDIT | typeof DELETE | typeof EXPORT | typeof FAVOURITE | typeof PRINT |
    typeof RECALL | typeof SAVE | typeof SEND | typeof SIGN | typeof SIGN_AND_SEND
