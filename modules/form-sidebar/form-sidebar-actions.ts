/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2018 VTB Group. All rights reserved.
 */
import {getFormValues, getFormInitialValues, initialize} from 'redux-form';
import {noop, get, isFunction, reduce, isEqualWith} from 'lodash';
import {addNotification} from '@vtb/fe-ui-alert';
import {showModal} from '@vtb/fe-ui-dialog';
import {Print} from '@vtb/fe-bi-print';
import {DocumentCancellation} from '@vtb/fe-bi-document-cancellation';
import {fetchChangesHistory, changesHistoryReducer} from '@vtb/fe-bi-changes-history';
import {fetchDocumentSignatures, documentSignaturesReducer} from '@vtb/fe-bi-signatures-list';
import {
    NOTIFICATION_SEND_FAILURE,
    NOTIFICATION_DELETE_FAILURE,
    NOTIFICATION_DONE_SUCCESS,
    NOTIFICATION_DONE_ERROR
} from '../../modules/notifications';
import {doFetch, fetchData, fetchDone} from './../../utils/fetchable';
import {EMPLOYEE, OFFICIAL, UserType} from '../../modules/user-context';
import {TO_BANK, FROM_BANK, LetterDirection} from '../../modules/define-letter-direction';
import {showAssignModal, FORM_WITH_COMMENT} from '../../modules/popups';
import {signDocumentAction, getCommonConfig} from '../../modules/signable';
import {changesHistoryTabId, documentSignaturesTabId} from './../../constants/tabs-names';
import {translate} from './../../utils/translate';
import {
    SEND,
    ASSIGN,
    REJECT,
    RETURN
} from './../../constants/document-actions';
import {LETTER_TYPE_CODE} from './../../constants/doc-types';
import {combineValidators, required} from './../../utils/common-validators';
import {
    getSignaturesListUrl,
    getCancellationUrl,
    getPrintUrl
} from './../../api';
import {download} from '../../modules/export/services/download';
import {LETTER_PAGE_FETCH_NAMESPACE} from './../../pages/letter-page';
import {recallAction} from '../../modules/cancel-request';
import {createApiTemplate, openTemplatesScroller, openCreateTemplate, TemplateType} from '../../modules/templates';
import {DEFAULT_PAGE_SIZE} from './../../constants/size';
import {showExportModal, DETAIL_TYPE, extensionItems} from '../../modules/export';
import {
    TEMPLATE_NOTIFICATION_DELETED,
    TEMPLATE_NOTIFICATION_FAILURE,
    TEMPLATE_NOTIFICATION_SUCCESS
} from '../../modules/templates/notifications';
import {GoTo} from './../../utils/routing';
import {getActiveTabId} from '../../pages/letter-page/selectors';
import {
    saveDocumentAction,
    updateDocument,
    fetchAndGoToScroller
} from '../document-actions/document-actions';
import {ResourceType} from '../resource';
import {fetchCapabilities} from '../capabilities';
import {ShowExportModalType} from '../export/export-popup';
import {StoreType} from '../../store/root-selector';
import {FormDocumentType} from '../templates/flow-types';
import {Letter} from '../../common-types';

export const commentValidator = combineValidators(
    required('comment')
);

const reasonValidator = combineValidators(
    required('reason')
);

export type BeforeSaveTransducer = (document: Letter | any) => Letter;

export type saveTemplateType = {
    beforeSaveTransducer: BeforeSaveTransducer,
    documentTypeCode: number,
    templateOmitFunc: (obj: FormDocumentType) => string,
    clientOrgId: number
}

export const createSidebarActions = (
    documentName: string,
    fetchNamespace: string,
    formName: string,
    validationNamespace: string,
    resource: ResourceType,
    capabilitiesSubResource: string,
    actionPrefix = ''
) => {
    const fetchDocumentById = (id: number) => fetchData(fetchNamespace)(resource.get, id);

    const fetchCapabilitiesById = (id: number) => fetchCapabilities(
        {
            documentName,
            resource,
            capabilitiesSubResource,
            form: formName,
            actionPrefix
        }
    )(id);

    const reloadAction = (id: number) => (dispatch: Function) => {
        dispatch(fetchCapabilitiesById(id));
        dispatch(fetchDocumentById(id));
    };

    const saveDocument = (
        goTo: GoTo,
        beforeSaveTransducer: BeforeSaveTransducer = ((document: Letter) => ({...document})),
        withReload: boolean,
        disableValidation: boolean,
        onDocumentChange: (id: number, toBank: boolean) => void,
        pathResponse: string | null
    ) => (dispatch: Function) => {
        dispatch(saveDocumentAction({
            formName,
            goTo,
            beforeSaveTransducer,
            disableValidation,
            pathResponse,
            onDocumentChange,
            resource,
            fetchNamespace,
            capabilitiesSubResource,
            actionPrefix,
            documentName,
            isSidebar: true,
            reloadAction
        }));
    };

    type CreateDocumentType = {
        edocId: number,
        number: number,
        createDate: string,
        id: number,
        clientSnapshot: {
            id?: number
        }
    }

    const createCancellationDocument = ({
        edocId, number, createDate, id, clientSnapshot: {id: clientId = null} = {}
    }: CreateDocumentType) => (dispatch: Function) => dispatch(DocumentCancellation.showCancellationDocModal({
        ids: [{id: edocId, docTypeId: 1, clientId}],
        url: getCancellationUrl(),
        getDocument: () => Promise.resolve({documentNumber: number, createDate}),
        onSave: () => {
            dispatch(reloadAction(id));
        }
    }));

    const exportDocument = (
        id: number,
        getExportFunc: Function,
        direction: LetterDirection,
        exportParamsExtension: Array<Object>
    ) => (dispatch: Function) => dispatch(showExportModal(<ShowExportModalType>{
        isMultiple: false,
        extensionItems,
        onExport: (exportParams: Array<Object>) =>
            download({
                downloadUrl: getExportFunc(
                    id,
                    {
                        ...exportParams,
                        type: DETAIL_TYPE,
                        split: false,
                        letterDirection: direction
                    }
                )
            }),
        ...exportParamsExtension
    }));

    type ParamsType = {
        getSignUrlFunc: () => string;
        getSendUrlFunc: () => string;
        id: string;
        direction: LetterDirection;
        signAndSend: boolean;
        goToScroller: () => void;
    }

    const commonSign = (after: Function) => (params: ParamsType) =>
        signDocumentAction({
            getSignUrlFunc: params.getSignUrlFunc,
            getSendUrlFunc: params.getSendUrlFunc,
            id: params.id,
            after: after(params),
            getConfig: getCommonConfig,
            direction: params.direction,
            signAndSend: params.signAndSend
        });

    type SignDocumentType = {
        id: number;
        activeTabId: string;
        getChangesHistoryUrl: (id: number) => string;
        signaturesStoreUid: number;
        changesHistoryNamespace: string;
        changesHistoryStoreUid: number;
        direction: LetterDirection;
    }

    const signDocument = commonSign(
        ({
            id,
            getChangesHistoryUrl,
            signaturesStoreUid,
            changesHistoryNamespace,
            changesHistoryStoreUid,
            direction
        }: SignDocumentType) => (dispatch: Function) => {
            dispatch(reloadAction(id));
            dispatch((_: Function, getState: () => StoreType) => {
                const state = getState();
                const activeTabId = getActiveTabId(state);
                if (activeTabId === documentSignaturesTabId) {
                    const wrappedAction = documentSignaturesReducer.dispatchAction(fetchDocumentSignatures);
                    dispatch(wrappedAction(signaturesStoreUid, getSignaturesListUrl(id, direction)));
                }
                if (activeTabId === changesHistoryTabId) {
                    const wrappedAction = changesHistoryReducer.dispatchAction(fetchChangesHistory);
                    dispatch(wrappedAction(changesHistoryStoreUid, changesHistoryNamespace, getChangesHistoryUrl(id)));
                }
            });
        }
    );

    const signAndSendDocument = (params: ParamsType) => commonSign(
        ({goToScroller}: ParamsType) => (dispatch: Function) => {
            dispatch(goToScroller);
        }
    )(params);

    const sendDocument = (id: string, onSuccess: () => void) => doActionDocument({
        id,
        action: SEND,
        onSuccess,
        onErrorMessage: NOTIFICATION_SEND_FAILURE()
    });

    const deleteDocument = (id: string, onSuccess: () => void) => fetchAndGoToScroller(
        {
            onSuccess,
            onErrorMessage: NOTIFICATION_DELETE_FAILURE()
        },
        resource.delete,
        formName,
        fetchNamespace,
        true,
        noop,
        id
    );

    const rejectDocument = (id: string, onSuccess: () => void) => showModal(FORM_WITH_COMMENT, {
        formName,
        resource,
        id,
        documentActionName: REJECT,
        afterSubmit: () => (dispatch: Function) => {
            if (isFunction(onSuccess)) dispatch(onSuccess());
            dispatch(reloadAction.bind(null, id)());
        },
        formParams: {
            title: translate('modals.rejectModalTitle'),
            submitFieldLabel: translate('modals.rejectModalFieldLabel'),
            submitButtonLabel: translate('buttons.reject'),
            cancelButtonLabel: translate('buttons.cancel'),
            commentFieldKey: 'comment',
            reduxFormProps: {validate: commentValidator}
        }
    });

    const returnDocument = (id: string, onSuccess: () => void) => showModal(FORM_WITH_COMMENT, {
        formName,
        resource,
        id,
        documentActionName: RETURN,
        afterSubmit: () => (dispatch: Function) => {
            if (isFunction(onSuccess)) dispatch(onSuccess());
            dispatch(reloadAction.bind(null, id)());
        },
        formParams: {
            title: translate('modals.returnDocument'),
            submitFieldLabel: translate('modals.comment'),
            submitButtonLabel: translate('modals.revertDocument'),
            cancelButtonLabel: translate('buttons.cancel'),
            commentFieldKey: 'reason',
            reduxFormProps: {validate: reasonValidator}
        }
    });

    const assignDocument = (id: number, branchId: number, capabilities: Array<string>) =>
        showAssignModal({
            apiMethod: (data: Object) => resource.action(id, ASSIGN, data),
            after: () => (dispatch: Function) => {
                dispatch(reloadAction(id));
            },
            branchId,
            capabilities
        });

    const favorite = (id: number) => (dispatch: Function, getState: () => StoreType) => {
        const initialValues: {favourite?: boolean} = getFormInitialValues(formName)(getState());
        const v = doFetch(fetchNamespace, {
            after: () => {
                dispatch(reloadAction(id));
                dispatch(addNotification(NOTIFICATION_DONE_SUCCESS()));
            },
            afterError: () => addNotification(NOTIFICATION_DONE_ERROR())
        })(resource.action, id, 'favourite', {favourite: !initialValues.favourite});
        return dispatch(v);
    };

    const printDocument = (id: string, direction: LetterDirection) =>
        (dispatch: Function) =>
            dispatch(Print.startPrint({url: getPrintUrl(direction, id), fileName: null}));

    const printDocumentWithUpdate = (id: string, direction: LetterDirection, userContextType: UserType) => {
        if (
            (direction === TO_BANK && userContextType === EMPLOYEE)
            || (direction === FROM_BANK && userContextType === OFFICIAL)
        ) {
            return updateWithCallback(printDocument)(id, direction);
        }

        return printDocument(id, direction);
    };

    type DocumentType = {
        id?: number
    }

    function updateWithCallback(callback: Function) {
        return (...params: Array<Object>) => (dispatch: Function, getState: () => StoreType) => {
            const store = getState();
            const document: DocumentType = getFormValues(formName)(store);
            const initial = getFormInitialValues(formName)(store);

            if ((document.id && isEqualWith(document, initial)) || !document.id) {
                dispatch(callback(...params));
            } else {
                dispatch(updateDocument({
                    document,
                    goTo: null,
                    disableValidation: false,
                    resource,
                    pathResponse: null,
                    showNotification: false,
                    formName,
                    fetchNamespace,
                    capabilitiesSubResource,
                    actionPrefix,
                    documentName,
                    closeModal: noop,
                    isSidebar: true
                })).then(() => dispatch(callback(...params)));
            }
        };
    }

    type ActionDocumentType = {
        id: string;
        action: string;
        onSuccess: () => void;
        onErrorMessage?: {
            title?: string;
            content?: (type: string, fileName: string) => string | string;
            lifeTime?: number;
            type?: string;
        };
    }

    function doActionDocument({
        id, action, onSuccess, onErrorMessage
    }: ActionDocumentType) {
        if (!id) {
            throw Error(`You can not ${action} document without id`);
        }

        return fetchAndGoToScroller(
            {
                onSuccess: () => (dispatch: Function) => {
                    if (isFunction(onSuccess)) dispatch(onSuccess());
                    dispatch(reloadAction.bind(null, id)());
                },
                onErrorMessage
            },
            resource.action,
            formName,
            fetchNamespace,
            true,
            noop,
            id,
            action
        );
    }

    const createDocumentByTemplate = (
        formNamespace: string,
        documentTypeCode: number,
        clientOrgId: number,
        toBank = true
    ) => (dispatch: Function) => {
        const apiTemplate = createApiTemplate(LETTER_TYPE_CODE);
        return dispatch(openTemplatesScroller({
            clientId: clientOrgId,
            docTypeId: documentTypeCode,
            deleteTemplateAction: template => apiTemplate.deleteTemplate(template.id || 0),
            createModalTemplates: (template: {attributeComposition: string}) => {
                const init = {
                    ...JSON.parse(template.attributeComposition),
                    toBank,
                    id: null
                };
                dispatch(fetchDone(LETTER_PAGE_FETCH_NAMESPACE, init));
                dispatch(initialize(formNamespace, init));
            }
        }));
    };

    const saveTemplate = ({
        beforeSaveTransducer,
        documentTypeCode,
        templateOmitFunc,
        clientOrgId
    }: saveTemplateType) => (dispatch: Function, getState: () => StoreType) => {
        const document = beforeSaveTransducer(getFormValues(formName)(getState()));
        const apiTemplate = createApiTemplate(LETTER_TYPE_CODE);
        const attributeFormatter = (obj: FormDocumentType) => JSON.stringify(templateOmitFunc(obj));

        return dispatch(openCreateTemplate({
            form: {...document},
            findTemplateAction:
                (extraData: TemplateType = {}, extraParams = {}) =>
                    apiTemplate.findTemplates(
                        {
                            ...extraData,
                            clientId: clientOrgId,
                            docTypeId: documentTypeCode
                        },
                        {
                            ...extraParams,
                            page: 0,
                            size: DEFAULT_PAGE_SIZE
                        }
                    ),
            createTemplateAction:
                (name, form) =>
                    apiTemplate.createTemplate(
                        {
                            clientId: clientOrgId,
                            name,
                            docTypeId: documentTypeCode,
                            attributeComposition: attributeFormatter(form)
                        }
                    ),
            updateTemplateAction:
                (template, name, form) =>
                    apiTemplate.updateTemplate(
                        {
                            id: get(template, 'id'),

                            clientId: clientOrgId,
                            name,
                            docTypeId: documentTypeCode,
                            attributeComposition: attributeFormatter(form)
                        },
                        {},
                        get(template, 'id')
                    ),
            deleteTemplateAction: template => apiTemplate.deleteTemplate(template.id || 0),
            updateFieldsTip: (name: string) => translate('template.update-existing', {name}),
            notifications: {
                success: TEMPLATE_NOTIFICATION_SUCCESS,
                failure: TEMPLATE_NOTIFICATION_FAILURE,
                deleted: TEMPLATE_NOTIFICATION_DELETED,
                impossible: TEMPLATE_NOTIFICATION_FAILURE
            }
        }));
    };

    const withUpdateActions = {
        createCancellationDocument,
        signDocument,
        sendDocument,
        signAndSendDocument,
        returnDocument,
        assignDocument,
        rejectDocument,
        favorite,
        recallAction,
        exportDocument,
        createDocumentByTemplate,
        saveTemplate
    };

    return {
        ...reduce(
            withUpdateActions,
            (acc: any, action, actionKey) => ({
                ...acc,
                [actionKey]: updateWithCallback(action)
            })
        ),
        saveDocument,
        deleteDocument,
        printDocument: printDocumentWithUpdate,
        fetchCapabilitiesById,
        fetchDocumentById,
        reloadAction
    };
};
