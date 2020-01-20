/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
export type LettersApiCallsType =
    'letters/LettersToBank' |
    'letters/LettersFromBank' |
    'letters/CreateLetter' |
    'letters/EditLetter' |
    'letters/ShowLetter' |
    'letters/showCancelRequest' |
    'letters/CreateStreamLetter' |
    'cancel-requests/quick-view/letters' |
    'cancel-requests/modal-view/letters';

type ScrollerType = {
    filters: Object,
    sorting: Object,
    quickViewIsActive: boolean
}

export type LettersApiOptionsType = {
    scroller?: ScrollerType,
    id?: number | string,
    setMapper: Function,
    noRedirects?: boolean
}

export type LettersApiType = (id: LettersApiCallsType, options: LettersApiOptionsType) => void
