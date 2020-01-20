/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {SHOW_RIGHT, SHOW_CENTER} from '@vtb/fe-ui-dialog';
import {Scroller} from '@vtb/fe-ui-table';
import {Signature2} from '@vtb/fe-bi-signature';
import {changeHistoryModals} from '@vtb/fe-bi-changes-history';
import {GroupActionModal} from '@vtb/fe-bi-group-modals';
import {
    FORM_WITH_COMMENT,
    FormWithCommentContainer
} from './modules/popups';
import {GROUP_MODAL, GroupModalContainer} from './modules/popups/group-modal';
import {
    LETTER_PAGE_NAME,
    LetterPageEmployee
} from './pages/letter-page';

import {DictionaryModal} from './modules/dictionary-new';
import {LetterTypeToBankModal, LetterTypeFromBankModal} from './modules/dictionary-new/letter-type-dictionary';
import {OfficialsModal} from './modules/dictionary-new/officials-dictionary';
import {ConfirmPopup, CONFIRM_MODAL_NAME} from './modules/confirm';
import {ValidationPopup, VALIDATION_MODAL_NAME} from './modules/validation';

import {withModalParams} from './utils/modals';
import {MODAL_LARGE} from './constants/size';
import {FormTemplatesModals} from './modules/templates';
import {EXPORT_MODAL} from './modules/export';
import {createCancelRequestModal} from './modules/group-actions/create-cancel-request';

export const modals = [
    {
        view: FORM_WITH_COMMENT,
        type: SHOW_CENTER,
        component: FormWithCommentContainer,
        closable: false
    },
    {
        view: CONFIRM_MODAL_NAME,
        type: SHOW_CENTER,
        component: ConfirmPopup
    },
    {
        view: VALIDATION_MODAL_NAME,
        type: SHOW_CENTER,
        component: ValidationPopup,
        closable: false
    },
    {
        view: LETTER_PAGE_NAME,
        type: SHOW_RIGHT,
        component: withModalParams(LetterPageEmployee),
        params: {
            width: MODAL_LARGE
        },
        closable: true
    },
    {
        view: GROUP_MODAL,
        type: SHOW_CENTER,
        component: GroupModalContainer,
        closable: false
    },
    ...FormTemplatesModals,
    DictionaryModal,
    LetterTypeToBankModal,
    LetterTypeFromBankModal,
    OfficialsModal,
    EXPORT_MODAL,
    ...Signature2.modals,
    ...changeHistoryModals,
    ...Scroller.modals,
    ...GroupActionModal,
    createCancelRequestModal
];
