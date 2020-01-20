/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {showModal} from '@vtb/fe-ui-dialog';
import {modalNameWithRootNamespace} from './../../utils/modals';
import {ConfirmModalProps} from './confirm-modal';

export const CONFIRM_MODAL_NAME = modalNameWithRootNamespace('confirm');
export const showConfirmModal = (labelText: string, extras: ConfirmModalProps) =>
    showModal(CONFIRM_MODAL_NAME, {
        labelText, ...extras
    });
