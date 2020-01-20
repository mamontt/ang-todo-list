/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2018 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {ComponentType} from 'react';
import {connect} from 'react-redux';
import {isDirty} from 'redux-form';
import {isNil, get, omit} from 'lodash';
import {addNotification} from '@vtb/fe-ui-alert';
import {closeModal as close} from '@vtb/fe-ui-dialog';
import {flowRight} from './../../utils/flow-right';
import {showConfirmModal} from '../../modules/confirm';
import {translate} from './../../utils/translate';
import {GoTo} from './../../utils/routing';
import {Branch, Client, Letter, TargetEvent} from '../../common-types';
import {NOTIFICATION_SAVE_BRANCH_FAILURE, NOTIFICATION_SAVE_CLIENT_FAILURE} from '../notifications';
import {saveDocumentAction} from '../document-actions/document-actions';
import {letter, letterOfficial} from '../../api/letter';
import {LetterDirection, TO_BANK} from '../define-letter-direction';
import {LETTER_PAGE_NAME} from '../../pages/letter-page';
import {StoreType} from '../../store/root-selector';
import {ConfirmModalProps} from '../confirm/confirm-modal';

type PropsType = {
    showConfirmModal: (title: string, params: ConfirmModalProps) => void;
    saveDocument: () => void;
    closeModal: () => void;
    onDocumentChange: (id: number, toBank: boolean) => void;
    dispatch: any;
    getState: () => StoreType;
    goTo: GoTo;
    documentId: number;
    dirty: boolean;
    isDirtyForm: boolean;
    anyTouched: boolean;
    initialValues: Letter;
    clientSnapshot: Client;
    branchSnapshot: Branch;
    clients: Array<Client>;
    form: string;
    letterDirection: LetterDirection;
}

export const notifyUnsavedChangesOnClose = flowRight(
    connect((state: StoreType) => ({
        isDirtyForm: isDirty(LETTER_PAGE_NAME)(state)
    }), {
        showConfirmModal,
        closeModal: close,
        saveDocumentAction
    }),
    (WrapperComponent: ComponentType<any>) =>
        class WithOnClose extends React.Component<PropsType> {
            handleConfirm = () => {
                const {
                    dispatch,
                    goTo,
                    clientSnapshot,
                    branchSnapshot,
                    clients,
                    onDocumentChange,
                    form,
                    letterDirection: direction
                } = this.props;
                const clientSnapshotId = get(clientSnapshot, 'id', null);
                const branchSnapshotId = get(branchSnapshot, 'id', null);
                const hasClients = clients && clients.length;
                if (!clientSnapshotId && !hasClients) {
                    dispatch(addNotification(NOTIFICATION_SAVE_CLIENT_FAILURE()));
                    this.handleCloseModal();
                } else if (!branchSnapshotId) {
                    dispatch(addNotification(NOTIFICATION_SAVE_BRANCH_FAILURE()));
                    this.handleCloseModal();
                } else {
                    const resource = direction === TO_BANK ? letter(direction) : letterOfficial(direction);
                    dispatch(saveDocumentAction({
                        formName: form,
                        goTo,
                        beforeSaveTransducer: ((document: Object) => ({...document})),
                        disableValidation: false,
                        pathResponse: null,
                        onDocumentChange,
                        resource,
                        fetchNamespace: 'letters',
                        isSidebar: false,
                        closeModal: this.handleSaveCloseModal
                    }));
                }
            };

            handleSaveCloseModal = () => {
                const {goTo, closeModal} = this.props;
                closeModal();
                goTo.scroller();
            };

            handleCloseModal = (event?: TargetEvent) => {
                const {goTo, closeModal} = this.props;
                const textContent = get(event, 'target.textContent', '');
                closeModal();
                if (textContent) {
                    goTo.scroller();
                }
            };

            handleClose = () => {
                const {
                    showConfirmModal, // eslint-disable-line no-shadow
                    goTo,
                    documentId,
                    isDirtyForm,
                    initialValues
                } = this.props;
                if (isDirtyForm || isJustCopied(documentId, initialValues)) {
                    showConfirmModal(translate('modals.closeWOSaveModalText'), {
                        title: translate('actions.title.actionClose'),
                        confirmButtonText: translate('buttons.exit'),
                        cancelButtonText: translate('buttons.abolish'),
                        afterConfirm: this.handleConfirm,
                        afterCancel: this.handleCloseModal
                    });
                } else {
                    goTo.scroller();
                }
            };

            render() {
                return (
                    <WrapperComponent
                        onClose={this.handleClose}
                        {...omit(this.props, ['showConfirmModal', 'closeGroupModal'])}
                    />
                );
            }
        }
);

function isJustCopied(documentId: number, initialValues: Letter) {
    return (isNil(documentId) && get(initialValues, '@@copied'));
}
