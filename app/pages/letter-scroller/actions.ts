/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {get} from 'lodash';
import {AnyAction, Dispatch} from 'redux';
import {addNotification} from '@vtb/fe-ui-alert';
import {showModal, closeModal} from '@vtb/fe-ui-dialog';
import {Print} from '@vtb/fe-bi-print';
import {Scroller} from '@vtb/fe-ui-table';
import {DocumentCancellation} from '@vtb/fe-bi-document-cancellation';
import {
    getCheckedRowsIds,
    getCheckedRowsIdsArray,
    getCheckedRowsEdocRefIdsArray
} from '../../pages/letter-scroller/selectors';
import {doFetch} from './../../utils/fetchable';
import {translate} from './../../utils/translate';
import {showMultiAssignModal, FORM_WITH_COMMENT} from './../../modules/popups';
import {ASSIGN, REJECT} from './../../constants/document-actions';
import {combineValidators, required} from './../../utils/common-validators';
import {
    getCancellationUrl,
    getPrintUrl,
    getCancellationDigestUrl,
    cancelationOtrUrl,
    getEmployeeCancelltationSendUrl,
    getEmployeeCancelltationSignUrl,
    getExportUrl,
    GetExportUrlOptions
} from './../../api';
import {signDocumentsAction, getCommonConfig, getCancellationConfig} from './../../modules/signable';
import {download} from './../../modules/export/services/download';
import {GET} from './../../constants/request-types';
import {LetterDirection} from './../../modules/define-letter-direction';
import {NOTIFICATION_DONE_ERROR, NOTIFICATION_DONE_SUCCESS} from './../../modules/notifications';
import {RowType} from '../../pages/letter-scroller/flow-types';
import {ResourceType} from './../../modules/resource/resource';
import {StoreType} from '../../store/root-selector';
import {Branch} from '../../common-types';

type PropsType = {
    namespace: string;
    resource: ResourceType;
    after: (result?: Array<RowType>) => void;
    onErrorMessage?: () => void;
    capabilities?: Array<string>;
}

export const commentValidator = combineValidators(required('comment'));

export const commonSign = (
    getSignUrlFunc: (edocId: string | number) => string,
    getSendUrlFunc: ((documentId: string | number) => void) | string,
    namespace: string,
    after: (result?: Array<RowType>) => void,
    direction: LetterDirection,
    signAndSend: boolean
) => (dispatch: Dispatch<AnyAction>, getState: () => StoreType) => {
    const state = getState();
    const checkedRows = Scroller.selectors.getCheckedRows(state, namespace);
    const checkedIds = getCheckedRowsIdsArray(checkedRows);

    return dispatch(
        signDocumentsAction({
            getSignUrlFunc,
            getSendUrlFunc,
            ids: checkedIds,
            after,
            getConfig: getCommonConfig,
            direction,
            signAndSend
        })
    );
};

type TitlesRpopsType = {
    edocRefId: number;
    documentDate: string;
    documentNumber: number;
}

export const createCancellationDocument = (
    namespace: string,
    after: (result?: Array<RowType>) => void,
    getUrlFunc: Function,
    direction: LetterDirection
) => (dispatch: Function, getState: () => StoreType) => {
    const state = getState();
    const checkedRows = Scroller.selectors.getCheckedRows(state, namespace);
    const checkedEdocRefIds = getCheckedRowsEdocRefIdsArray(checkedRows);

    const onAfter = () => {
        dispatch(closeModal());
        dispatch(after);
    };

    const titles = checkedRows.reduce(
        (result: Array<any>, {edocRefId, documentDate, documentNumber}: TitlesRpopsType) => ({
            ...result,
            [edocRefId]: {createDate: documentDate, documentNumber}
        }),
        {}
    );
    return dispatch(
        DocumentCancellation.showCancellationDocModal({
            ids: checkedEdocRefIds,
            url: getCancellationUrl(),
            onClose: onAfter,
            getDocument: (id: number) => Promise.resolve(titles[id]),
            onSignAndSend: (result: Array<Object> = []) =>
                dispatch(
                    signDocumentsAction({
                        getSignUrlFunc: getEmployeeCancelltationSignUrl,
                        getSendUrlFunc: getEmployeeCancelltationSendUrl,
                        getDigestFunc: getCancellationDigestUrl,
                        otrUrl: cancelationOtrUrl,
                        ids: result.filter((item: {error: string}) => !item.error).map(item => get(item, 'result.id')),
                        after: onAfter,
                        getConfig: getCancellationConfig,
                        direction,
                        signAndSend: true,
                        getSendSmsCodeUrl: () =>
                            '/api/letters/v3/ui/cancelRequests/ui/edocs/{documentId}/signatures/simple/smscode',
                        getOtpSignUrl: () =>
                            '/api/letters/v3/ui/cancelRequests/ui/edocs/{documentId}/signatures/simple',
                        fetchConfigUrl: '/api/otp/ui/operations/SIMPLE_SIGNATURE_SIGNING/params'
                    })
                )
        })
    );
};

export const rejectDocument = (namespace: string, resource: ResourceType, after: (result?: Array<RowType>) => void) => (
    dispatch: Dispatch<AnyAction>, getState: () => StoreType
) => {
    const state = getState();
    const checkedRows = Scroller.selectors.getCheckedRows(state, namespace);
    const {id} = checkedRows[0];

    return dispatch(
        showModal(FORM_WITH_COMMENT, {
            namespace,
            resource,
            id,
            documentActionName: REJECT,
            afterSubmit: after,
            formParams: {
                title: translate('modals.rejectModalTitle'),
                submitFieldLabel: translate('modals.rejectModalFieldLabel'),
                submitButtonLabel: translate('buttons.reject'),
                cancelButtonLabel: translate('buttons.cancel'),
                commentFieldKey: 'comment',
                reduxFormProps: {validate: commentValidator}
            }
        })
    );
};

export const assignDocument = ({
    namespace,
    resource,
    after,
    capabilities
}: PropsType) => (
    dispatch: Dispatch<AnyAction>, getState: () => StoreType
) => {
    const state = getState();
    const checkedRows = Scroller.selectors.getCheckedRows(state, namespace);
    const branchId = checkedRows.map((branch: {branchSnapshot: Branch}) => String(branch.branchSnapshot.id));
    const apiMethod = (id: number) => (data: Object) => resource.action(id, ASSIGN, data);
    return dispatch(
        showMultiAssignModal({
            apiMethod,
            after,
            branchId,
            capabilities,
            namespace,
            documents: checkedRows
        })
    );
};

export const printDocument = (namespace: string, letterDirection: LetterDirection) => (
    dispatch: Dispatch<AnyAction>, getState: () => StoreType
) => {
    const state = getState();
    const checkedRows = Scroller.selectors.getCheckedRows(state, namespace);
    const ids = getCheckedRowsIds(checkedRows);
    const url = getPrintUrl(letterDirection, ids);
    return dispatch(Print.startPrint({url, fileName: null}));
};

export const toggleFavorite = (
    row: RowType,
    resource: ResourceType,
    after: () => void,
    namespace: string
) => (dispatch: Function) => {
    const {id, favourite} = row;
    return dispatch(
        doFetch(namespace, {
            after: () => {
                dispatch(after());
                dispatch(addNotification(NOTIFICATION_DONE_SUCCESS()));
            },
            afterError: () => addNotification(NOTIFICATION_DONE_ERROR())
        })(resource.action, id, 'favourite', {favourite: !favourite})
    );
};

export const multiToggleFavorite = (
    rows: Array<RowType>,
    resource: ResourceType,
    after: () => void,
    namespace: string,
    favourite: boolean
) => (dispatch: Function) => {
    const ids = rows.filter((row: RowType) => row.favourite !== favourite).map((row: RowType) => row.id);
    return dispatch(
        doFetch(namespace, {
            after: () => {
                dispatch(after());
                dispatch(addNotification(NOTIFICATION_DONE_SUCCESS()));
            },
            afterError: () => addNotification(NOTIFICATION_DONE_ERROR())
        })(resource.action, 'multi', 'favourite', {ids, favourite})
    );
};

export type ExportDocuments = (
    namespace: string,
    exportParams: GetExportUrlOptions
) => (dispatch: Dispatch<AnyAction>, getState: () => StoreType) => void;

export const exportDocuments = (namespace: string, exportParams: GetExportUrlOptions) => (
    dispatch: Dispatch<AnyAction>, getState: () => StoreType
) => {
    const state = getState();
    const rows = Scroller.selectors.getCheckedRows(state, namespace);
    return (
        rows &&
        rows.length &&
        download({
            downloadUrl: getExportUrl(getCheckedRowsIdsArray(rows).join(','), exportParams),
            method: GET
        })
    );
};
