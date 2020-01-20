/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {getFormValues} from 'redux-form';
import {chunk, get, isEmpty, noop} from 'lodash';
import {addNotification} from '@vtb/fe-ui-alert';
import {getInitialValuesWithDate, getMyDocumentNumber} from '../../pages/letter-page/selectors';
import {clientsFromBank} from '../../api/letter';
import {ApiMethod, doFetch, fetchFinished, fetchStart} from '../../utils/fetchable';
import {LETTER_PAGE_FETCH_NAMESPACE} from '../../pages/letter-page';
import {NOTIFICATION_SAVE_FAILURE, NOTIFICATION_SAVE_SUCCESS, NOTIFICATION_SAVE_WITH_ISSUES} from '../notifications';
import {GoTo} from '../../utils/routing';
import {chainPromises} from '../../utils/promise';
import {handleCreateUpdateResponse} from '../validation';
import {ResourceType} from '../resource';
import {Client} from '../../common-types';

type ReloadActionType = (
    id: number,
    resource: ResourceType,
    formName: string,
    fetchNamespace: string,
    documentName: string,
    capabilitiesSubResource: string,
    actionPrefix: string
) => void;

export type ActionType = {
    goTo: GoTo;
    onDocumentChange?: (id: number, toBank: boolean) => void;
    beforeSaveTransducer?: Function;
    closeModal?: () => void;
    reloadAction?: ReloadActionType;
    pathResponse?: string | null;
    isCreate?: boolean;
    isSidebar?: boolean;
    showNotification?: boolean;
    document?: {
        id?: number;
    };
    disableValidation?: boolean;
    resource?: ResourceType;
    formName?: string;
    fetchNamespace?: string;
    capabilitiesSubResource?: string;
    actionPrefix?: string;
    documentName?: string;
}

export type ConfigType = {
    onSuccess: Function;
    onContinue?: Function;
    onDismiss?: Function;
    onErrorMessage?: {
        title?: string;
        content?: (type: string, fileName: string) => string | string;
        lifeTime?: number;
        type?: string;
    };
    withValidation?: boolean;
};

const CLIENTS_CHUCK_SIZE = 10;
const getValidAttachments = (document) => document.attachments.filter(({attachmentId}) => attachmentId);

export const saveDocumentAction = ({
    formName,
    goTo,
    beforeSaveTransducer,
    disableValidation,
    pathResponse,
    onDocumentChange,
    resource,
    fetchNamespace,
    capabilitiesSubResource = '',
    actionPrefix = '',
    documentName = '',
    isSidebar,
    reloadAction,
    closeModal = noop
}: ActionType) => (dispatch, getState) => {
    const document = beforeSaveTransducer(getFormValues(formName)(getState()));
    const {id, clientSnapshot, documentNumber} = document;
    const isMyDocumentNumber = getMyDocumentNumber(getState());
    const initialDocument = getInitialValuesWithDate(getState());
    const changedNumber = documentNumber !== get(initialDocument, 'documentNumber');
    // TODO VTBDBODSF-3753 if !attachmentId error
    if (document.attachments) {
        document.attachments = getValidAttachments(document);
    }
    if (id) {
        if (!isMyDocumentNumber && changedNumber) {
            const clientId = get(clientSnapshot, 'id', null);
            const resourceApi = clientsFromBank(clientId);
            dispatch(doFetch(LETTER_PAGE_FETCH_NAMESPACE)(resourceApi.post));
        }
        return dispatch(updateDocument({
            document,
            goTo,
            disableValidation,
            resource,
            formName,
            fetchNamespace,
            capabilitiesSubResource,
            actionPrefix,
            documentName,
            closeModal,
            reloadAction,
            onDocumentChange,
            isSidebar
        }));
    }
    if (!isMyDocumentNumber) {
        delete document.documentNumber;
    }
    return dispatch(
        createDocument(
            document,
            goTo,
            disableValidation,
            onDocumentChange,
            pathResponse,
            true,
            formName,
            fetchNamespace,
            resource,
            capabilitiesSubResource,
            actionPrefix,
            documentName,
            isSidebar,
            closeModal,
            reloadAction
        )
    );
};

export const backAction = (goTo: GoTo) => {
    if (goTo) {
        goTo.scroller();
    }
};

export const updateAction = ({
    goTo,
    onDocumentChange,
    pathResponse = null,
    resource,
    formName,
    fetchNamespace,
    capabilitiesSubResource,
    actionPrefix,
    documentName,
    isCreate,
    showNotification,
    isSidebar,
    closeModal,
    reloadAction
}: ActionType, response: Array<Object>) => (dispatch: Function) => {
    // TODO have to refactor with this module
    let updatedResponse;
    if (Array.isArray(response) && response.length !== 1) {
        backAction(goTo);
        return;
    } else if (pathResponse) {
        updatedResponse = get(response, pathResponse);
    } else if (Array.isArray(response)) {
        updatedResponse = get(response, '[0]');
    } else {
        updatedResponse = response;
    }

    if (isCreate && isSidebar) {
        goTo.editDocument(updatedResponse.id);
    }
    if ((showNotification && !isEmpty(updatedResponse.errors)) || !isEmpty(updatedResponse.lastCheckResults)) {
        dispatch(addNotification(NOTIFICATION_SAVE_WITH_ISSUES()));
    }
    if (isSidebar) {
        dispatch(reloadAction(
            updatedResponse.id,
            resource,
            formName,
            fetchNamespace,
            documentName,
            capabilitiesSubResource,
            actionPrefix
        ));
    } else {
        closeModal();
    }

    if (onDocumentChange) {
        onDocumentChange(updatedResponse.id, updatedResponse.toBank);
    }
};

export function updateDocument({
    document,
    goTo,
    disableValidation = false,
    resource,
    pathResponse,
    showNotification = true,
    formName,
    fetchNamespace,
    capabilitiesSubResource,
    actionPrefix,
    documentName,
    closeModal,
    reloadAction,
    onDocumentChange,
    isSidebar
}: ActionType) {
    const update = updateAction.bind(
        null,
        {
            goTo,
            onDocumentChange,
            pathResponse,
            resource,
            formName,
            fetchNamespace,
            capabilitiesSubResource,
            actionPrefix,
            documentName,
            closeModal,
            reloadAction,
            isSidebar
        }
    );
    return fetchAndGoToScroller(
        {
            onSuccess: update,
            onErrorMessage: showNotification && NOTIFICATION_SAVE_FAILURE(),
            onContinue: update,
            onDismiss: backAction.bind(null, goTo),
            withValidation: !disableValidation
        },
        resource.update,
        formName,
        fetchNamespace,
        isSidebar,
        closeModal,
        document.id,
        document
    );
}

export function fetchAndGoToScroller(
    config: ConfigType,
    fetchFunction: ApiMethod,
    formName: string,
    fetchNamespace: string,
    isSidebar: boolean,
    closeModal: () => void,
    ...args: Array<Object>
) {
    return doFetch(fetchNamespace, {
        form: formName,
        after: afterWithValidationAction(config, formName, isSidebar, closeModal),
        afterError: () => addNotification(config.onErrorMessage)
    })(fetchFunction, ...args);
}

export function afterWithValidationAction(config: ConfigType, formName: string, isSidebar, closeModal) {
    return (response: any) => (dispatch: Function) => {
        if (config.withValidation && config.onContinue) {
            const validationConfig = {
                onSuccess: () => {
                    dispatch(addNotification(NOTIFICATION_SAVE_SUCCESS()));
                    return config.onSuccess(response);
                },
                onContinue: () => config.onContinue(response),
                onDismiss: () => config.onDismiss(response)
            };
            return dispatch(handleCreateUpdateResponse(response, validationConfig, formName, isSidebar, closeModal));
        }
        return dispatch(config.onSuccess(response));
    };
}

function createDocument(
    document: {
        clients: Array<Client>
    },
    goTo: GoTo,
    disableValidation = false,
    onDocumentChange: (id: number, toBank: boolean) => void,
    pathResponse: string | null,
    showNotification: boolean,
    formName: string,
    fetchNamespace: string,
    resource: ResourceType,
    capabilitiesSubResource: string,
    actionPrefix: string,
    documentName: string,
    isSidebar: boolean,
    closeModal: () => void,
    reloadAction: ReloadActionType
) {
    return (dispatch: Function) => {
        const update = updateAction.bind(null, {
            goTo,
            onDocumentChange,
            pathResponse,
            resource,
            formName,
            fetchNamespace,
            capabilitiesSubResource,
            actionPrefix,
            documentName,
            showNotification,
            isCreate: true,
            isSidebar,
            closeModal,
            reloadAction
        });

        const config: ConfigType = {
            onSuccess: update,
            onContinue: update,
            onErrorMessage: NOTIFICATION_SAVE_FAILURE(),
            onDismiss: backAction.bind(null, goTo),
            withValidation: !disableValidation
        };

        // TODO: only for VTBDBODSF-990 delete it when be create the solution on the backend
        if (document.clients && document.clients.length > CLIENTS_CHUCK_SIZE) {
            const clients = chunk(document.clients, CLIENTS_CHUCK_SIZE);
            const createChuckClients = (clientChucks: Array<Object>) =>
                dispatch(doFetch(fetchNamespace, {
                    form: formName,
                    isFetchStart: false,
                    isFetchSuccess: false
                })(resource.create, {
                    ...document,
                    clients: clientChucks
                }));
            dispatch(fetchStart(fetchNamespace, null));
            return chainPromises(createChuckClients, clients)
                .then(
                    (results = []) => {
                        let error = false;
                        const res = results.reduce(
                            (acc: {concat: Function}, item: {
                                error: string,
                                result: Object
                            }) => (item.error ? error = true : acc.concat(item.result)), []
                        );
                        dispatch(fetchFinished(fetchNamespace, res));
                        if (error) addNotification(config.onErrorMessage);
                        dispatch(afterWithValidationAction(config, formName, isSidebar, closeModal)(res));
                        return Promise.resolve(res);
                    }
                );
        }
        return dispatch(fetchAndGoToScroller(
            config,
            resource.create,
            formName,
            fetchNamespace,
            isSidebar,
            closeModal,
            document
        ));
    };
}
