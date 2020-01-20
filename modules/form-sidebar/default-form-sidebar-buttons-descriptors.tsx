/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import React from 'react';
import {get, merge, omit} from 'lodash';
import {addNotification, notificationTypes, NOTIFICATION_LIFETIME} from '@vtb/fe-ui-alert';
import {Icons} from '@vtb/fe-ui-icon';
import {NOTIFICATION_DELETE_SUCCESS, NOTIFICATION_DONE_SUCCESS} from '../../modules/notifications';
import {translate} from './../../utils/translate';
import {EMPLOYEE, OFFICIAL} from '../../modules/user-context';
import {getExportUrl} from './../../api';
import {LETTER_PAGE_NAME, LETTER_PAGE_FETCH_NAMESPACE} from './../../pages/letter-page';
import {LETTER_TYPE_CODE} from './../../constants/doc-types';
import {getIdFromSnapshot} from './../../pages/letter-page/utils';
import * as FORM_SIDEBAR_ACTIONS from './actions';
import {TO_BANK} from '../define-letter-direction';
import {FormSidebarWithButtonHandlersProps} from './form-sidebar-with-button-handlers';
import {BeforeSaveTransducer} from './form-sidebar-actions';

const DESCRIPTOR_GROUPS = {
    GROUP_1: 1,
    GROUP_2: 2,
    GROUP_3: 3,
    GROUP_4: 4
};

const COMMON_FORM_SIDEBAR_ACTION_DESCRIPTORS = () => ({
    [FORM_SIDEBAR_ACTIONS.SAVE]: {
        icon: Icons.Save,
        text: translate('sidebar.save'),
        group: DESCRIPTOR_GROUPS.GROUP_2
    },
    [FORM_SIDEBAR_ACTIONS.SIGN]: {
        icon: Icons.Sign,
        text: translate('sidebar.sign')
    },
    [FORM_SIDEBAR_ACTIONS.SIGN_AND_SEND]: {
        icon: Icons.SignSend,
        text: translate('sidebar.sign-and-send')
    },
    [FORM_SIDEBAR_ACTIONS.DELETE]: {
        icon: Icons.Delete,
        text: translate('sidebar.delete'),
        group: DESCRIPTOR_GROUPS.GROUP_3
    },
    [FORM_SIDEBAR_ACTIONS.SEND]: {
        icon: Icons.Send,
        text: translate('sidebar.send')
    },
    [FORM_SIDEBAR_ACTIONS.PRINT]: {
        icon: Icons.Print,
        text: translate('sidebar.print'),
        group: DESCRIPTOR_GROUPS.GROUP_4
    },
    [FORM_SIDEBAR_ACTIONS.RECALL]: {
        icon: Icons.Withdraw,
        text: translate('sidebar.recall')
    },
    [FORM_SIDEBAR_ACTIONS.REMOVE_SIGNATURE]: {
        icon: Icons.Unsign,
        text: translate('sidebar.remove-signature')
    },
    [FORM_SIDEBAR_ACTIONS.REJECT]: {
        icon: Icons.Refuse,
        text: translate('sidebar.reject')
    },
    [FORM_SIDEBAR_ACTIONS.TAKE_IN_PROCESS]: {
        icon: Icons.ToProcessing,
        text: translate('sidebar.take-in-process')
    },
    [FORM_SIDEBAR_ACTIONS.COPY]: {
        icon: Icons.Copy,
        text: translate('sidebar.copy'),
        group: DESCRIPTOR_GROUPS.GROUP_3
    },
    [FORM_SIDEBAR_ACTIONS.RETURN]: {
        icon: Icons.Withdraw,
        text: translate('sidebar.return')
    },
    [FORM_SIDEBAR_ACTIONS.PROCESS_COMPLETE]: {
        icon: Icons.Confirm,
        text: translate('sidebar.process-complete')
    },
    [FORM_SIDEBAR_ACTIONS.EXPORT]: {
        icon: Icons.Export,
        text: translate('sidebar.export'),
        group: DESCRIPTOR_GROUPS.GROUP_4
    },
    [FORM_SIDEBAR_ACTIONS.FAVORITE]: {
        icon: Icons.FavoritesEmpty,
        group: DESCRIPTOR_GROUPS.GROUP_2
    },
    [FORM_SIDEBAR_ACTIONS.CREATE_BY_TEMPLATE]: {
        icon: Icons.SaveTemplate,
        text: translate('sidebar.create-from-template'),
        group: DESCRIPTOR_GROUPS.GROUP_3
    },
    [FORM_SIDEBAR_ACTIONS.SAVE_TEMPLATE]: {
        icon: Icons.AddTemplate,
        text: translate('sidebar.save-template'),
        group: DESCRIPTOR_GROUPS.GROUP_2
    }
});

export const createDescriptorsWithHandlers = (defaultFormSidebarHandlers: Function) =>
    merge(defaultFormSidebarHandlers, COMMON_FORM_SIDEBAR_ACTION_DESCRIPTORS());

export function getDefaultButtonClickHandlers(
    props: FormSidebarWithButtonHandlersProps, beforeSaveTransducer: BeforeSaveTransducer
) {
    const {
        documentId,
        goTo,
        activeTabId,
        edocRefId,
        number,
        direction,
        getSignUrlFunc,
        getSendUrlFunc,
        getChangesHistoryUrl,
        branchId,
        withReload,
        disableValidation,
        onDocumentChange,
        saveDocument,
        signaturesStoreUid,
        changesHistoryNamespace,
        changesHistoryStoreUid,
        capabilities,
        pathCreateResponse,
        recallAction,
        reloadAction,
        userContext,
        initialValues = {favourite: false, cancelReq: null},
        clientSnapshot,
        document,
        closeModal,
        fetchStart,
        fetchDone
    } = props;

    const signDocumentFunc = (signAndSend) => props.signDocument({
        id: documentId,
        getSignUrlFunc,
        getSendUrlFunc,
        activeTabId,
        getChangesHistoryUrl,
        signaturesStoreUid,
        changesHistoryStoreUid,
        changesHistoryNamespace,
        direction,
        signAndSend
    });

    return {
        [FORM_SIDEBAR_ACTIONS.SAVE]: {
            onClick: () =>
                saveDocument(
                    goTo,
                    beforeSaveTransducer,
                    withReload,
                    disableValidation,
                    onDocumentChange,
                    pathCreateResponse
                )
        },

        [FORM_SIDEBAR_ACTIONS.RECALL]: {
            onClick: () => {
                if (initialValues.cancelReq) {
                    props.addNotification({
                        title: translate('cancel-req.title'),
                        content: translate('cancel-req.content'),
                        lifeTime: NOTIFICATION_LIFETIME,
                        type: notificationTypes.error
                    });
                } else {
                    fetchStart(LETTER_PAGE_FETCH_NAMESPACE);
                    recallAction({
                        userRoleType: userContext.type === EMPLOYEE ? 'client' : 'bank',
                        id: null,
                        type: 'LETTER_TO_BANK',
                        applicationName: 'letters',
                        documentInitialData: {
                            cancelEdocCommonFields: {
                                cancelEdocType: translate('letter-employee-to-bank'),
                                cancelEdocTypeId: 1, // document type id
                                cancelEdocNumber: get(initialValues, 'documentNumber', undefined),
                                cancelEdocDate: get(initialValues, 'documentDate', undefined),
                                cancelEdocOrg: get(initialValues, 'clientSnapshot.shortName', undefined),
                                cancelEdocBranch: get(initialValues, 'branchSnapshot.shortName', undefined),
                                cancelEdocRefId: get(initialValues, 'edocRefId', undefined),
                                cancelEdocOrgId: get(initialValues, 'clientSnapshot.id', undefined),
                                docTypeId: 1
                            },
                            cancelEdocAdditionalFields: {
                                letterType: {
                                    name: get(initialValues, 'letterType.name', undefined)
                                },
                                topic: get(initialValues, 'topic', undefined),
                                content: get(initialValues, 'content', undefined)
                            },
                            cancelEdocRefId: edocRefId
                        },
                        onClose: () => {
                            fetchDone(LETTER_PAGE_FETCH_NAMESPACE);
                            reloadAction(documentId);
                        },
                        onUpdate: () => {
                            fetchDone(LETTER_PAGE_FETCH_NAMESPACE);
                            reloadAction(documentId);
                        }
                    });
                }
            }
        },

        [FORM_SIDEBAR_ACTIONS.SIGN_AND_SEND]: {
            onClick: () => signDocumentFunc(true)
        },

        [FORM_SIDEBAR_ACTIONS.SIGN]: {
            onClick: () => signDocumentFunc(false)
        },

        [FORM_SIDEBAR_ACTIONS.SEND]: {
            onClick: () => props.sendLetters({allDocuments: [document]}).then(() => reloadAction(documentId))
        },
        [FORM_SIDEBAR_ACTIONS.COPY]: {
            onClick: () => goTo.newDocument({copyFrom: documentId})
        },
        [FORM_SIDEBAR_ACTIONS.PRINT]: {
            group: userContext.type === OFFICIAL ? DESCRIPTOR_GROUPS.GROUP_2 : DESCRIPTOR_GROUPS.GROUP_4,
            onClick: () => props.printDocument(documentId, direction, userContext.type)
        },
        [FORM_SIDEBAR_ACTIONS.FAVORITE]: {
            text: document.favourite
                ? translate('actions.do.remove-from-favorite')
                : translate('actions.do.add-to-favorite'),
            onClick: () => props.favorite(documentId)
        },
        [FORM_SIDEBAR_ACTIONS.DELETE]: {
            onClick: () =>
                props.showConfirmModal(translate('modals.confirmDeleteModalText'), {
                    type: 'info',
                    title: translate('actions.title.actionDelete'),
                    confirmButtonText: translate('buttons.delete'),
                    cancelButtonText: translate('buttons.cancel'),
                    afterConfirm: () =>
                        props.deleteDocument(documentId, () => (dispatch: Function) => {
                            closeModal();
                            dispatch(goTo.scroller);
                            dispatch(addNotification(NOTIFICATION_DELETE_SUCCESS(number)));
                        }),
                    afterCancel: () => closeModal()
                })
        },

        [FORM_SIDEBAR_ACTIONS.REJECT]: {
            onClick: () => props.rejectDocument(documentId, () => addNotification(NOTIFICATION_DONE_SUCCESS()))
        },

        [FORM_SIDEBAR_ACTIONS.TAKE_IN_PROCESS]: {
            onClick: () => props.assignDocument(documentId, branchId, capabilities)
        },

        [FORM_SIDEBAR_ACTIONS.RETURN]: {
            onClick: () => props.returnDocument(documentId)
        },

        [FORM_SIDEBAR_ACTIONS.PROCESS_COMPLETE]: {
            onClick: () =>
                props.processComplete({allDocuments: [document]}).then(() => {
                    reloadAction(documentId);
                })
        },

        [FORM_SIDEBAR_ACTIONS.EXPORT]: {
            onClick: () => props.exportDocument(documentId, getExportUrl, direction)
        },

        [FORM_SIDEBAR_ACTIONS.CREATE_BY_TEMPLATE]: {
            onClick: () =>
                props.createDocumentByTemplate(
                    LETTER_PAGE_NAME,
                    LETTER_TYPE_CODE,
                    getIdFromSnapshot(clientSnapshot),
                    direction === TO_BANK
                )
        },

        [FORM_SIDEBAR_ACTIONS.SAVE_TEMPLATE]: {
            onClick: () =>
                props.saveTemplate({
                    beforeSaveTransducer,
                    documentTypeCode: LETTER_TYPE_CODE,
                    templateOmitFunc: (obj: Object) => omit(obj, ['id']),
                    clientOrgId: getIdFromSnapshot(clientSnapshot)
                })
        }
    };
}
