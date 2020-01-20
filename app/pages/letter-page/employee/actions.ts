/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {change} from 'redux-form';
import {AnyAction, Dispatch} from 'redux';
import {get, isEmpty} from 'lodash';
import {addNotification} from '@vtb/fe-ui-alert';
import {documentSignaturesReducer, fetchDocumentSignatures} from '@vtb/fe-bi-signatures-list';
import {getSignaturesListUrl, getSignatureUrl} from './../../../api';
import {letter} from './../../../api/letter';
import {
    CLIENTS,
    BRANCH_SEARCH,
    fetchDictionary,
    NOTIFICATION_LOAD_FAILURE,
    loadDictionary
} from './../../../modules/dictionary-new';
import {fetchCapabilities} from './../../../modules/capabilities';
import {signDocumentAction, getCommonConfig} from './../../../modules/signable';
import {LetterDirection, TO_BANK} from './../../../modules/define-letter-direction';
import {READ} from './../../../constants/document-actions';
import {fetchData, doFetch} from './../../../utils/fetchable';
import {fetchCapabilitiesType} from './../../../modules/capabilities/capabilities-actions';
import {InitProps} from './../../../init-stream';
import {POST} from '../../../constants/request-types';
import {ResourceType} from './../../../modules/resource/resource';
import {
    LETTER_PAGE_NAME,
    LETTER_PAGE_FETCH_NAMESPACE
} from '../letter-page-constants';
import {branchPathAdapter} from '../utils';
import {getUrlForSend} from '../../../api';
import {Branch, Client, Letter} from '../../../common-types';

export const getResource = (letterDirection: LetterDirection) => letter(letterDirection);
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

export const presetBranch = (
    letterDirection: LetterDirection,
    clientSnapshot: Client,
    branchSnapshot: Branch,
    initialValues: Letter,
    currentValues: Letter
) =>
    (dispatch: Dispatch<AnyAction>) => {
        const {
            clientSnapshot: initialClientSnapshot,
            branchSnapshot: initialBranchSnapshot
        } = initialValues;

        const initialClientId = get(initialValues, 'clientSnapshot.id', null);
        const currentClientId = get(currentValues, 'clientSnapshot.id', null);

        const initialBranchId = get(initialValues, 'branchSnapshot.id', null);
        const currentBranchId = get(branchSnapshot, 'id', null);

        const baseCondition = letterDirection === TO_BANK && clientSnapshot;

        if (
            (baseCondition && (isEmpty(initialClientSnapshot) && isEmpty(initialBranchSnapshot)))
            || (baseCondition && (initialClientId !== currentClientId))
            || (baseCondition && (initialBranchId !== currentBranchId))
        ) {
            const {id: clientId} = clientSnapshot;

            fetchDictionary({
                name: BRANCH_SEARCH,
                fetchParams: {method: POST, params: {clientId}},
                pathAdapter: branchPathAdapter(clientId, 'page=0&size=10000')
            })
                .then((data) => {
                    const branchIdInData = data.map((item: {id: number}) => item.id).includes(currentBranchId);
                    dispatch(loadDictionary({
                        dictionary: data,
                        meta: {name: BRANCH_SEARCH, force: true}
                    }));
                    if (data && data.length === 1) {
                        dispatch(
                            change(LETTER_PAGE_NAME, 'branchSnapshot', data[0])
                        );
                    } else if (!branchIdInData) {
                        dispatch(
                            change(LETTER_PAGE_NAME, 'branchSnapshot', null)
                        );
                    }
                })
                .catch(() => (
                    dispatch(addNotification(NOTIFICATION_LOAD_FAILURE()))
                ));
        }
    };

export const presetClient = (letterDirection: LetterDirection, orgId: Array<number>, initProps: InitProps = {}) =>
    (dispatch: Function) => {
        const {clientSnapshotId} = initProps;
        if (letterDirection === TO_BANK && orgId && (orgId.length === 1 || clientSnapshotId)) {
            fetchDictionary({name: CLIENTS})
                .then((data: Array<Client>) => {
                    dispatch(loadDictionary({
                        dictionary: data,
                        meta: {name: CLIENTS, force: true}
                    }));
                    dispatch(
                        change(LETTER_PAGE_NAME, 'clientSnapshot', data.find(
                            (item: {id: number}) => item.id === (
                                clientSnapshotId || Number(orgId[0])
                            )
                        ))
                    );
                })
                .catch(() => (
                    dispatch(addNotification(NOTIFICATION_LOAD_FAILURE()))
                ));
        }
    };

export const markAsRead = (id: number, letterDirection: LetterDirection) => {
    const resource: ResourceType = getResource(letterDirection);
    return doFetch(LETTER_PAGE_FETCH_NAMESPACE, {
        after: () => (dispatch: Function) => {
            dispatch(fetchLetterById(id, letterDirection));
            dispatch(fetchLetterCapabilitiesById(id, letterDirection));
        }
    })(resource.action, id, READ);
};

type SignProps = { documentId: number, letterDirection: LetterDirection, signaturesStoreUid: string }
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

