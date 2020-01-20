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
    DOCUMENT_ASSIGN_FORM_NAME,
    DocumentAssignPopup,
    FORM_WITH_COMMENT,
    FormWithCommentContainer,
    DOCUMENT_EXECUTION_FORM_NAME,
    DocumentExecutionFormContainer
} from './modules/popups';
import {GROUP_MODAL, GroupModalContainer} from './modules/popups/group-modal';
import {
    LETTER_PAGE_NAME,
    LetterPageOfficial
} from './pages/letter-page';
import {DictionaryModal} from './modules/dictionary-new';
import {LetterTypeFromBankModal, LetterTypeToBankModal} from './modules/dictionary-new/letter-type-dictionary';
import {OfficialsModal} from './modules/dictionary-new/officials-dictionary';
import {ConfirmPopup, CONFIRM_MODAL_NAME} from './modules/confirm';
import {ValidationPopup, VALIDATION_MODAL_NAME} from './modules/validation';

import {withModalParams} from './utils/modals';
import {MODAL_LARGE} from './constants/size';
import {FormTemplatesModals} from './modules/templates';
import {EXPORT_MODAL} from './modules/export';

export const modals = [
    {
        view: FORM_WITH_COMMENT,
        type: SHOW_CENTER,
        component: FormWithCommentContainer,
        closable: false
    },
    {
        view: DOCUMENT_EXECUTION_FORM_NAME,
        type: SHOW_CENTER,
        component: DocumentExecutionFormContainer,
        closable: false
    },
    {
        view: DOCUMENT_ASSIGN_FORM_NAME,
        type: SHOW_CENTER,
        component: DocumentAssignPopup,
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
        component: withModalParams(LetterPageOfficial),
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
    DictionaryModal,
    LetterTypeFromBankModal,
    LetterTypeToBankModal,
    OfficialsModal,
    EXPORT_MODAL,
    ...FormTemplatesModals,
    ...Signature2.modals,
    ...changeHistoryModals,
    ...Scroller.modals,
    ...GroupActionModal
];
