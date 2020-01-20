/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {
    ADD_COMMENT,
    CHECK_REQUISITES,
    COPY,
    DELETE,
    EXPORT,
    PRINT,
    PROCESS,
    PROCESS_COMPLETE,
    RECALL,
    REJECT,
    REMOVE_SIGN,
    SEND,
    SIGN,
    SIGN_AND_SEND,
    CHECK_SIGN,
    START_SIGN_CHECKS,
    TAKE_IN_PROCESS
} from './scroller-parts/action-bar/header-actions';

export const buttonsPerCategoriesFromBankOfficial = {
    //  В работе
    'filters.bankInprocess': [
        COPY,
        DELETE,
        SIGN,
        SIGN_AND_SEND,
        SEND,
        CHECK_SIGN,
        PRINT,
        EXPORT
    ],
    // На подпись
    'filters.tosign': [
        COPY,
        SIGN,
        SIGN_AND_SEND,
        SEND,
        CHECK_SIGN,
        REMOVE_SIGN,
        PRINT,
        EXPORT
    ],
    // К отправке
    'filters.signedOfficial': [
        COPY,
        SEND,
        CHECK_SIGN,
        REMOVE_SIGN,
        PRINT,
        EXPORT
    ],
    // В обработке
    'filters.in_process': [
        COPY,
        CHECK_SIGN,
        PRINT,
        EXPORT
    ],
    // Завершенные
    'filters.executedOfficial': [
        COPY,
        CHECK_SIGN,
        PRINT,
        EXPORT
    ],
    'filters.all': [
        COPY,
        DELETE,
        SIGN,
        SIGN_AND_SEND,
        SEND,
        CHECK_SIGN,
        REMOVE_SIGN,
        PRINT,
        EXPORT
    ]
};

export const buttonsPerCategoriesToBankOfficial = {
    'filters.received': [
        CHECK_SIGN,
        TAKE_IN_PROCESS,
        REJECT,
        PRINT,
        EXPORT
    ],
    'filters.in_process': [
        CHECK_SIGN,
        TAKE_IN_PROCESS,
        PROCESS_COMPLETE,
        REJECT,
        PRINT,
        EXPORT
    ],
    'filters.executedOfficial': [
        CHECK_SIGN,
        PRINT,
        EXPORT
    ],
    'filters.problem': [
        CHECK_SIGN,
        CHECK_REQUISITES,
        START_SIGN_CHECKS,
        PROCESS,
        REJECT,
        PRINT,
        EXPORT
    ],
    'filters.all': [
        CHECK_SIGN,
        TAKE_IN_PROCESS,
        CHECK_REQUISITES,
        START_SIGN_CHECKS,
        PROCESS,
        PROCESS_COMPLETE,
        REJECT,
        PRINT,
        EXPORT
    ]
};
