/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {EMPLOYEE} from './../../../modules/user-context';
import {FORM_SIDEBAR_ACTIONS} from './../../../modules/form-sidebar';
import {LetterDirection, FROM_BANK} from './../../../modules/define-letter-direction';

export const getButtonsDescriptors = (letterDirection: LetterDirection) => () => {
    if (letterDirection === FROM_BANK) {
        return ({
            [EMPLOYEE]: [
                FORM_SIDEBAR_ACTIONS.PRINT,
                FORM_SIDEBAR_ACTIONS.FAVORITE,
                FORM_SIDEBAR_ACTIONS.EXPORT
            ]
        });
    }
    return ({
        [EMPLOYEE]: [
            FORM_SIDEBAR_ACTIONS.SAVE,
            FORM_SIDEBAR_ACTIONS.COPY,
            FORM_SIDEBAR_ACTIONS.SIGN,
            FORM_SIDEBAR_ACTIONS.SIGN_AND_SEND,
            FORM_SIDEBAR_ACTIONS.SEND,
            FORM_SIDEBAR_ACTIONS.RECALL,
            FORM_SIDEBAR_ACTIONS.DELETE,
            FORM_SIDEBAR_ACTIONS.PRINT,
            FORM_SIDEBAR_ACTIONS.EXPORT,
            FORM_SIDEBAR_ACTIONS.FAVORITE,
            FORM_SIDEBAR_ACTIONS.CREATE_BY_TEMPLATE,
            FORM_SIDEBAR_ACTIONS.SAVE_TEMPLATE
        ]
    });
};
