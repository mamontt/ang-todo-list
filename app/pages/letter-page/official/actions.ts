/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {change} from 'redux-form';
import {AnyAction, Dispatch} from 'redux';
import {get, isEmpty, isNull} from 'lodash';
import {documentSignaturesReducer, fetchDocumentSignatures} from '@vtb/fe-bi-signatures-list';
import {addNotification} from '@vtb/fe-ui-alert';
import {getSignaturesListUrl, getSignatureUrl} from './../../../api';
import {letterOfficial} from './../../../api/letter';
import {fetchCapabilities} from './../../../modules/capabilities';
import {signDocumentAction, getCommonConfig} from './../../../modules/signable';
import {FROM_BANK, LetterDirection} from './../../../modules/define-letter-direction';
import {fetchCapabilitiesType} from './../../../modules/capabilities/capabilities-actions';
import {
    CLIENT_SEARCH,
    BRANCH_SEARCH,
    loadDictionary,
    fetchDictionary,
    NOTIFICATION_LOAD_FAILURE
} from './../../../modules/dictionary-new';
import {ResourceType} from './../../../modules/resource/resource';
import {fetchData} from './../../../utils/fetchable';
import {InitProps} from './../../../init-stream';
import {GET, POST} from '../../../constants/request-types';
import {
    LETTER_PAGE_NAME,
    LETTER_PAGE_FETCH_NAMESPACE,
    idPAOVTB
} from '../letter-page-constants';
import {getUrlForSend} from '../../../api';
import {Branch, Client, Letter} from '../../../common-types';

export const getResource = (letterDirection: LetterDirection) => letterOfficial(letterDirection);

export const fetchLetterCapabilitiesById = (id: number, letterDirection: LetterDirection) =>
    fetchCapabilities(
        <fetchCapabilitiesType>{
            resource: getResource(letterDirection),
            documentName: LETTER_PAGE_FETCH_NAMESPACE,
            capabilitiesSubResource: 'actions',
            form: LETTER_PAGE_NAME
        }
    )(id);

export const fetchLetterById = (id: number, letterDirection: LetterDirection) => {
    const resource: ResourceType = getResource(letterDirection);
    return fetchData(
        LETTER_PAGE_FETCH_NAMESPACE
    )(resource.get, id);
};

type SignProps = {documentId: number, letterDirection: LetterDirection, signaturesStoreUid: string}
export const signDocument = ({documentId, letterDirection, signaturesStoreUid}: SignProps) => {
    const after = (dispatch: Function) => {
        dispatch(fetchLetterCapabilitiesById(documentId, letterDirection));
        dispatch(fetchLetterById(documentId, letterDirection));
        const wrappedAction = documentSignaturesReducer.dispatchAction(fetchDocumentSignatures);
        dispatch(wrappedAction(signaturesStoreUid, getSignaturesListUrl(documentId, letterDirection)));
    };
    return signDocumentAction({
        getSignUrlFunc: getSignatureUrl,
        getSendUrlFunc: getUrlForSend,
        id: documentId,
        after,
        getConfig: getCommonConfig,
        direction: letterDirection
    });
};

export const preInitClient = (
    letterDirection: LetterDirection,
    initProps?: InitProps
) =>
    (dispatch: Dispatch<AnyAction>) => {
        if (letterDirection !== FROM_BANK) {
            return;
        }
        fetchDictionary({
            name: CLIENT_SEARCH,
            fetchParams: {
                method: GET,
                params: {
                    page: 0,
                    size: 10000
                }
            }
        })
            .then((data) => {
                dispatch(loadDictionary({
                    dictionary: data,
                    meta: {name: CLIENT_SEARCH, force: true}
                }));

                if (initProps && initProps.clientSnapshotId) {
                    const initClientSnapshot = data.find(
                        (item: {id: number}) => item.id === (initProps.clientSnapshotId)
                    );

                    if (initClientSnapshot) {
                        dispatch(change(LETTER_PAGE_NAME, 'clients', [initClientSnapshot]));
                    }
                }
            });
    };

export const presetClient = (
    letterDirection: LetterDirection,
    clientSnapshot: Client,
    branchSnapshot: Branch,
    initialValues: {
        clientSnapshot?: Client,
        branchSnapshot?: Branch
    },
    currentValues: Letter,
    isVTB?: boolean,
    clients?: Array<Client>,
    documentId?: number
) =>
    (dispatch: Dispatch<AnyAction>) => {
        if (letterDirection !== FROM_BANK || !branchSnapshot) {
            if (isNull(branchSnapshot)) {
                dispatch(change(LETTER_PAGE_NAME, 'bankResponsibleOfficer', null));
            }
            return;
        }
        const {id: branchId} = branchSnapshot;
        const {
            clientSnapshot: initialClientSnapshot,
            branchSnapshot: initialBranchSnapshot
        } = initialValues;

        const initialClientId = get(initialValues, 'clientSnapshot.id', null);
        const initialBranchId = get(initialValues, 'branchSnapshot.id', null);
        const currentClientId = get(currentValues, 'clientSnapshot.id', null);
        const currentBranchId = get(branchSnapshot, 'id', null);

        if ((isEmpty(initialClientSnapshot) && isEmpty(initialBranchSnapshot))
                || (initialClientId !== currentClientId)
                || (initialBranchId !== currentBranchId)) {
            fetchDictionary({
                name: CLIENT_SEARCH,
                fetchParams: {
                    method: GET,
                    params: {
                        ...isVTB ? null : {branchId},
                        page: 0,
                        size: 10000
                    }
                }
            })
                .then((data: Array<Client>) => {
                    dispatch(loadDictionary({
                        dictionary: data,
                        meta: {name: CLIENT_SEARCH, force: true}
                    }));
                    if (isVTB && !documentId) {
                        dispatch(change(LETTER_PAGE_NAME, 'clientSnapshot', clients));
                        return;
                    }
                    const hasClient = (clientId) => data.some((item: {id: number}) => item.id === clientId);
                    const isResetClient = !(clients && clients.length === 1 && hasClient(clients[0].id));

                    if (isResetClient) {
                        dispatch(change(LETTER_PAGE_NAME, 'clientSnapshot', null));
                        dispatch(change(LETTER_PAGE_NAME, 'clients', null));
                    }
                })
                .catch(() => (
                    dispatch(addNotification(NOTIFICATION_LOAD_FAILURE()))
                ));
        }
    };

export const presetBranch = (
    letterDirection: LetterDirection,
) => (dispatch: Dispatch<AnyAction>) => {
    if (letterDirection === FROM_BANK) {
        fetchDictionary({name: BRANCH_SEARCH, fetchParams: {method: POST}})
            .then((data) => {
                dispatch(loadDictionary({
                    dictionary: data,
                    meta: {name: BRANCH_SEARCH, force: true}
                }));
                if (data && data.length === 1) {
                    dispatch(
                        change(LETTER_PAGE_NAME, 'branchSnapshot', data[0])
                    );
                }
            })
            .catch(() => (
                dispatch(addNotification(NOTIFICATION_LOAD_FAILURE()))
            ));
    }
};

export const resetNumber = (value: string = null) => (dispatch: Dispatch<AnyAction>) => {
    dispatch(change(LETTER_PAGE_NAME, 'documentNumber', value));
};

export type SetNumber = (value: string) => (dispatch: Dispatch<AnyAction>) => {};
export const setNumber = (value: string) => (dispatch: Dispatch<AnyAction>) => {
    dispatch(change(LETTER_PAGE_NAME, 'documentNumber', value));
};

export const setMyDocumentNumber = (value: boolean) => (dispatch: Dispatch<AnyAction>) => {
    dispatch(change(LETTER_PAGE_NAME, 'myDocumentNumber', value));
};

export const setSubdivision = (branchData: Array<Branch> = []) => (dispatch: Dispatch<AnyAction>) => {
    const PAOVTB = branchData.find((item: {id: number}) => item.id === idPAOVTB);
    if (PAOVTB) {
        dispatch(change(LETTER_PAGE_NAME, 'documentNumber', null));
        dispatch(change(LETTER_PAGE_NAME, 'branchSnapshot', PAOVTB));
    }
};
