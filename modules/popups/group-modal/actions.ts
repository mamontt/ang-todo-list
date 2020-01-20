/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {showModal, closeModal, changeModalParams} from '@vtb/fe-ui-dialog';
import {modalNameWithRootNamespace} from './../../../utils/modals';
import {createInfoContent, createResultContent} from './utils';

type TypeShowModal = {
    documents?: Array<Object>,
    total?: number,
    onConfirm: Function,
    onCancel: Function,
    confirmButtonText?: string,
    cancelButtonText?: string,
    title: string,
    namespace: string,
    actionText?: string,
    executedDocuments?: Array<Object>,
    erroredDocuments?: Array<Object>,
    results?: Array<Object>,
    disabledSubmitButton?: boolean
}

export const GROUP_MODAL = modalNameWithRootNamespace('group-modal');
export const showInfoModal = ({
    documents, total, onConfirm, onCancel, confirmButtonText, cancelButtonText, title, namespace
}: any) => showModal(GROUP_MODAL, {
    content: createInfoContent(documents, total),
    onConfirm,
    onCancel,
    confirmButtonText,
    cancelButtonText,
    title,
    namespace
});

export const changeInfoModalParams = (params: Object) => changeModalParams(GROUP_MODAL, params);

export const showResultModal = ({
    onConfirm, onCancel, actionText, title, namespace, executedDocuments, erroredDocuments
}: TypeShowModal) => showModal(GROUP_MODAL, {
    content: createResultContent(actionText, executedDocuments, erroredDocuments),
    onConfirm,
    onCancel,
    title,
    namespace
});

export const closeGroupModal = () => closeModal(GROUP_MODAL);
