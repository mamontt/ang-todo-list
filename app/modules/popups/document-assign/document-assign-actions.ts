/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2018 VTB Group. All rights reserved.
 */
import {showModal, closeModal} from '@vtb/fe-ui-dialog';
import {modalNameWithRootNamespace} from './../../../utils/modals';
import {doFetch, ApiMethod} from './../../../utils/fetchable';
import {translate} from './../../../utils/translate';
import {showResultModal} from '../group-modal';

type fetchTypes = {
    after?: (result?:Array<Object>)=>void,
    apiMethod: any,
    data: Object
}

type showAssignModalTypes = {
    apiMethod: any,
    after: Function,
    branchId: number,
    capabilities: Array<string>,
    namespace?: string
}

type showMultiAssignModalTypes = showAssignModalTypes & {
    documents: Array<Object>
}

type assignSingleDocumentTypes = {
    apiMethod: ApiMethod,
    data: Object,
    after?: Function
}

type MultiAssignDocumentTypes = assignSingleDocumentTypes & {
    documents: Array<Object>,
    namespace?: string
}

export const DOCUMENT_ASSIGN_FORM_NAME = modalNameWithRootNamespace('confirmation-documents-references-assign-form');

export const fetch = ({after, apiMethod, data}: fetchTypes) => doFetch('DO_ASSIGN_FETCH', {after})(apiMethod, data);

export const assignSingleDocument = ({apiMethod, data, after}: assignSingleDocumentTypes) => (dispatch: Function) => {
    const onAfter = () => {
        dispatch(closeModal());
        if (after) dispatch(after());
    };
    return dispatch(fetch({after: onAfter, apiMethod, data}));
};


export const showAssignModal = ({
    apiMethod, after, branchId, capabilities
}: showAssignModalTypes) =>
    showModal(DOCUMENT_ASSIGN_FORM_NAME, {
        branchId,
        capabilities,
        onAssign: (data: Object) => assignSingleDocument({apiMethod, after, data})
    });

type DocumentType = {
    id: number,
    documentDate: string,
    documentNumber: string
}

export const multiAssignDocument = ({
    documents, apiMethod, data, after, namespace
}: MultiAssignDocumentTypes) => (dispatch: Function) => {
    Promise.all(documents.map(({id, documentDate, documentNumber }: DocumentType) => {
        const documentResult = { documentNumber, documentDate };
        if (!id) {
            return Promise.resolve({ ...documentResult, error: true });
        }

        return dispatch(fetch({apiMethod: apiMethod(id), data}))
            .then(() => ({ ...documentResult, error: false }))
            .catch(() => ({ ...documentResult, error: true }));
    })).then((results) => {
        const executed: Array<Object> = [];
        const errored: Array<Object> = [];
        const onAfter = () => {
            dispatch(closeModal());
            if (after) dispatch(after());
        };
        results.forEach(item => (item.error ? errored.push(item) : executed.push(item)));
        dispatch(closeModal());
        dispatch(showResultModal({
            title: translate('actions.process.take-in-process'),
            total: documents.length,
            executedDocuments: executed,
            erroredDocuments: errored,
            onCancel: onAfter,
            onConfirm: onAfter,
            actionText: translate('actions.names.process-info'),
            namespace
        }));
    });
};

export const showMultiAssignModal = ({
    apiMethod, after, branchId, capabilities, documents, namespace
}: showMultiAssignModalTypes) =>
    showModal(DOCUMENT_ASSIGN_FORM_NAME, {
        branchId,
        capabilities,
        onAssign: (data: Object) => multiAssignDocument({
            data, after, apiMethod, documents, namespace
        }),
        multiply: true,
        documents
    });

type AssignDocumentTypes = {
    data: Object,
    onAssign: Function
}

export const assignDocument = ({data, onAssign}: AssignDocumentTypes) => (dispatch: Function) => {
    dispatch(onAssign(data));
};

