/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {
    CONFIRM_VIEW,
    COPY,
    DELETE,
    DELETE_FAVORITE,
    EXPORT,
    EXPORT_RECEIPT,
    EXPORT_VERIFY,
    FAVORITE,
    PRINT,
    RECALL,
    REMOVE_SIGN,
    SEND,
    SIGN,
    SIGN_AND_SEND,
    CHECK_SIGN
} from './scroller-parts/action-bar/header-actions';

export const buttonsPerCategoriesToBankEmployee = {
    //  В работе
    'filters.clientInprocess': [
        COPY, DELETE, SIGN, SIGN_AND_SEND, FAVORITE, DELETE_FAVORITE, PRINT, EXPORT
    ],
    // На подпись
    'filters.tosign': [
        COPY, SIGN, SIGN_AND_SEND, CHECK_SIGN, REMOVE_SIGN, FAVORITE, DELETE_FAVORITE, PRINT, EXPORT
    ],
    // К отправке
    'filters.signed': [
        COPY, SEND, CHECK_SIGN, REMOVE_SIGN, FAVORITE, DELETE_FAVORITE, PRINT, EXPORT
    ],
    // В обработке
    'filters.inprocess': [
        COPY, CHECK_SIGN, RECALL, CONFIRM_VIEW, FAVORITE, DELETE_FAVORITE, PRINT, EXPORT, EXPORT_RECEIPT, EXPORT_VERIFY
    ],
    // Завершенные
    'filters.executed': [
        COPY, CHECK_SIGN, CONFIRM_VIEW, FAVORITE, DELETE_FAVORITE, PRINT, EXPORT, EXPORT_RECEIPT, EXPORT_VERIFY
    ],
    // Избранное
    'filters.favorite': [
        COPY,
        DELETE,
        SIGN,
        SEND,
        SIGN_AND_SEND,
        CHECK_SIGN,
        REMOVE_SIGN,
        RECALL,
        CONFIRM_VIEW,
        DELETE_FAVORITE,
        PRINT,
        EXPORT,
        EXPORT_RECEIPT,
        EXPORT_VERIFY
    ],
    'filters.all': [
        COPY,
        DELETE,
        SIGN,
        SEND,
        SIGN_AND_SEND,
        CHECK_SIGN,
        REMOVE_SIGN,
        RECALL,
        CONFIRM_VIEW,
        FAVORITE,
        DELETE_FAVORITE,
        PRINT,
        EXPORT,
        EXPORT_RECEIPT,
        EXPORT_VERIFY
    ]
};

export const buttonsPerCategoriesFromBankEmployee = {
    'filters.new': [
        CHECK_SIGN,
        CONFIRM_VIEW,
        FAVORITE,
        DELETE_FAVORITE,
        PRINT,
        EXPORT,
        EXPORT_RECEIPT,
        EXPORT_VERIFY
    ],
    'filters.wereRead': [
        CHECK_SIGN,
        FAVORITE,
        DELETE_FAVORITE,
        PRINT,
        EXPORT,
        EXPORT_RECEIPT,
        EXPORT_VERIFY
    ],
    'filters.calledBackByBank': [
        CHECK_SIGN,
        CONFIRM_VIEW,
        FAVORITE,
        DELETE_FAVORITE,
        PRINT,
        EXPORT,
        EXPORT_RECEIPT,
        EXPORT_VERIFY
    ],
    'filters.favorite': [
        CHECK_SIGN,
        CONFIRM_VIEW,
        DELETE_FAVORITE,
        PRINT,
        EXPORT,
        EXPORT_RECEIPT,
        EXPORT_VERIFY
    ],
    'filters.all': [
        CHECK_SIGN,
        CONFIRM_VIEW,
        FAVORITE,
        DELETE_FAVORITE,
        PRINT,
        EXPORT,
        EXPORT_RECEIPT,
        EXPORT_VERIFY
    ]
};
