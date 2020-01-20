/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {PureComponent} from 'react';
import {isNil} from 'lodash';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {reduxForm} from 'redux-form';
import createValidationHoc from '@vtb/services/validate';
import {organizationsSelector} from '@vtb/services/auth';
import {getDocumentCapabilities} from './../../../modules/capabilities';
import {defineLetterDirection, LetterDirection, FROM_BANK} from './../../../modules/define-letter-direction';
import {
    updateValidation
} from './../../../modules/validation';
import {notifyUnsavedChangesOnClose, formFetchAndClear, onChange, notifyValidationErrorsOnLoad} from './../../../modules/common-form-hocs';
import {getLettersRulesUrl} from './../../../api';
import {
    basicRequisitesTabId,
    changesHistoryTabId,
    documentSignaturesTabId,
    linkedDocuments
} from './../../../constants/tabs-names';
import {translate} from './../../../utils/translate';
import {UserContext} from './../../../modules/user-context';
import {recallAction} from './../../../modules/cancel-request';
import {getDocumentCheckUrl, letterOfficial} from './../../../api/letter';
import {StoreType} from './../../../store/root-selector';
import {
    fetchLetterById,
    fetchLetterCapabilitiesById,
    signDocument,
    presetClient,
    presetBranch,
    setSubdivision,
    preInitClient,
    resetNumber,
    setNumber
} from './actions';
import {
    clearForm,
    updateSyncErrors,
    disableSave,
    enableSave,
    rejectedFile,
    presetLetterType,
    setActiveTab,
    fetchDocumentNumber
} from '../actions';
import {LETTER_PAGE_NAME, LETTER_DOCUMENT_NAME, LETTER_PAGE_FETCH_NAMESPACE} from '../letter-page-constants';
import {
    getInitialValuesWithDate,
    getViewMode,
    getDocumentAttachments,
    getDocumentStatus,
    getDocumentExtendedStatusName,
    getDocumentStatusId,
    getEnableExportReceipts,
    getRead,
    getEdocRefId,
    getNumber,
    getCreateDate,
    getBranchId,
    getClientSnapshot,
    getBranchSnapshot,
    getClients,
    getRelatedDocuments,
    getLastCheckResults,
    getActiveTabId,
    getInitTypeLetter,
    getBranchSnapshotFromDictionary,
    isBranchPAOVTB,
    getCopyFlag,
    getMyDocumentNumber
} from '../selectors';
import {LetterPage} from './letter-page';
import {findOutMainTitle} from './titles-selectors';
import {withIdReplacement} from '../common/with-id-replacement';
import {rebuildCheckResultsData, getIdFromSnapshot, buildTabs} from '../utils';
import {withCopyDocument} from '../../../modules/copy-document';
import {Branch, Client, Letter} from '../../../common-types';
import {
    verifyClientSnapshot,
    VerifyClientSnapshot,
    verifyDocumentNumber,
    VerifyDocumentNumber,
    setDefaultOfficers
} from '../common/on-change';
import {userNameSelector} from '../../../modules/popups/document-assign/selectors';

export type LetterPageContainerProps = {
    hasRelatedDocuments: boolean;
    documentId: number;
    documentStatus: string;
    number: number;
    isMyDocumentNumber: boolean;
    letterDirection: LetterDirection;
    userContext: UserContext;
    fetchLetterById?: (documentId: number, letterDirection: LetterDirection) => void;
    activeTab?: string;
    read?: boolean;
    capabilities?: Array<string>;
    initProps?: Letter;
    orgId?: number;
    initClientSnapshot?: Client;
    presetClient?: () => void;
    presetBranch?: (letterDirection: LetterDirection) => void;
    presetLetterType?: (letterDirection: LetterDirection) => void;
    typeLetter?: string;
    clientSnapshot?: Client;
    resetNumber?: (value?: string) => void;
    setNumber?: (docNumber: string) => void;
    documentStatusId?: number | string;
    initialValues?: Letter;
    branchSnapshot?: Branch;
    refetchRules?: (url: string) => void;
    updateValidation?: (
        param: {
            formName: string;
            namespace: string;
            endpoint: string;
        }
    ) => () => void;
    preInitClient?: (letterDirection: LetterDirection, initProps: Letter) => void;
    clients?: Array<Client>;
    initBranchSnapshot?: Branch;
    setSubdivision?: (branchData: Branch) => void;
    isBranchPAO_VTB: boolean;
    fetchDocumentNumber?: (letterDirection: LetterDirection, clientSnapshot: Client) => void;
    verifyClientSnapshot: VerifyClientSnapshot;
    verifyDocumentNumber: VerifyDocumentNumber;
    isCopy: boolean;
    pristine: boolean;
    userNameSelector: string;
};

class LetterPageContainerClass extends PureComponent<LetterPageContainerProps> {
    render() {
        const {
            hasRelatedDocuments, letterDirection, documentId, userContext, documentStatus, isCopy
        } = this.props;
        const letterTabs = [
            {title: translate(basicRequisitesTabId), id: basicRequisitesTabId},
            {title: translate(documentSignaturesTabId), id: documentSignaturesTabId},
            {title: translate(changesHistoryTabId), id: changesHistoryTabId},
            ...(hasRelatedDocuments ? [{title: translate(linkedDocuments), id: linkedDocuments}] : [])
        ];

        return (
            <LetterPage
                {...this.props}
                updateValidation={this.props.updateValidation({
                    formName: LETTER_PAGE_NAME,
                    namespace: LETTER_PAGE_FETCH_NAMESPACE,
                    endpoint: getDocumentCheckUrl(letterDirection, documentId, userContext.type)
                })}
                key={documentId}
                letterTabs={buildTabs({
                    documentId,
                    documentStatus,
                    letterTabs,
                    persistentTabId: basicRequisitesTabId,
                    isCopy
                })}
            />
        );
    }
}

export const LetterPageContainer = compose(
    withIdReplacement,
    formFetchAndClear(fetchLetterById, clearForm),
    defineLetterDirection,
    connect(
        (state: StoreType, ownProps: LetterPageContainerProps) => ({
            mainTitle: findOutMainTitle(ownProps.letterDirection)(state),
            initialValues: getInitialValuesWithDate(state),
            viewMode: getViewMode(state),
            documentStatus: getDocumentStatus(state),
            documentExtendedStatusName: getDocumentExtendedStatusName(state),
            documentStatusId: getDocumentStatusId(state),
            enableExportReceipts: getEnableExportReceipts(state),
            capabilities: getDocumentCapabilities(LETTER_DOCUMENT_NAME)(state),
            read: getRead(state),
            edocRefId: getEdocRefId(state),
            createDate: getCreateDate(state),
            number: getNumber(state),
            isMyDocumentNumber: getMyDocumentNumber(state),
            orgId: organizationsSelector(state),
            branchId: getBranchId(state),
            clientSnapshot: getClientSnapshot(state),
            branchSnapshot: getBranchSnapshot(state),
            hasRelatedDocuments: getRelatedDocuments(state),
            clients: getClients(state),
            documentAttachments: getDocumentAttachments(state),
            lastCheckResults: getLastCheckResults(state),
            typeLetter: getInitTypeLetter(state),
            activeTab: getActiveTabId(state),
            initBranchSnapshot: getBranchSnapshotFromDictionary(state),
            isBranchPAO_VTB: isBranchPAOVTB(state),
            isCopy: getCopyFlag(state),
            userName: userNameSelector(state)
        }),
        {
            updateErrors: updateSyncErrors,
            signDocument,
            fetchLetterCapabilitiesById,
            disableSave,
            enableSave,
            presetClient,
            presetBranch,
            rejectedFile,
            updateValidation,
            setActiveTab,
            fetchDocumentNumber,
            setSubdivision,
            fetchLetterById,
            presetLetterType,
            preInitClient,
            verifyClientSnapshot,
            verifyDocumentNumber,
            resetNumber,
            recallAction,
            setNumber,
            setDefaultOfficers
        }
    ),
    // TODO: VTBDBODSF-311, VTBDBODSF-312: added requests actions and document info when changing the tab
    onChange(
        'activeTab',
        ({
            documentId,
            letterDirection,
            activeTab,
            isCopy,
            ...props
        }: LetterPageContainerProps) =>
            activeTab !== null &&
            !isNil(documentId) &&
            !Number.isNaN(documentId) &&
            !isCopy &&
            props.fetchLetterById(documentId, letterDirection)
    ),
    onChange(
        'clients',
        ({
            clients,
            initBranchSnapshot,
            letterDirection,
            documentId,
            isMyDocumentNumber,
            ...props
        }: LetterPageContainerProps) => {
            if (!props.isBranchPAO_VTB && Array.isArray(clients) && clients.length > 1) {
                props.setSubdivision(initBranchSnapshot);
            }
            if (!documentId && Array.isArray(clients) && clients.length === 1 && !isMyDocumentNumber) {
                props.fetchDocumentNumber(letterDirection, clients[0]);
            }
            if (Array.isArray(clients) && (!clients.length || clients.length > 1) && !isMyDocumentNumber) {
                props.resetNumber();
            }
        }
    ),
    onChange(
        'clientSnapshot',
        (props: LetterPageContainerProps) => props.verifyDocumentNumber(props)
    ),
    createValidationHoc({
        validatorsUrl: '/validator/validators.js',
        rulesUrl: getLettersRulesUrl()
    }),
    reduxForm({
        form: LETTER_PAGE_NAME,
        enableReinitialize: true
    }),
    onChange(
        'documentId',
        ({
            documentId, letterDirection, typeLetter, initProps, ...props
        }: LetterPageContainerProps) => {
            if (isNil(documentId)) {
                props.preInitClient(letterDirection, initProps);
                props.presetBranch(letterDirection);
            }
            if (isNil(documentId) && isNil(typeLetter)) {
                props.presetLetterType(letterDirection);
            }
        }
    ),
    onChange(
        ['clientSnapshot', 'branchSnapshot'],
        ({clientSnapshot, branchSnapshot, refetchRules}: LetterPageContainerProps) =>
            refetchRules(getLettersRulesUrl(getIdFromSnapshot(clientSnapshot), getIdFromSnapshot(branchSnapshot)))
    ),
    onChange(['branchSnapshot'],
        ({
            branchSnapshot,
            userName,
            documentId,
            ...props
        }) => !documentId && branchSnapshot && props.setDefaultOfficers(branchSnapshot.id, userName)),
    // onChange(['branchSnapshot'],
    //     (props: LetterPageContainerProps, prevProps, log) => props.verifyClientSnapshot(props, prevProps, log)),
    notifyUnsavedChangesOnClose,
    notifyValidationErrorsOnLoad(LETTER_PAGE_NAME, rebuildCheckResultsData),
    withCopyDocument({resource: letterOfficial, form: LETTER_PAGE_NAME, letterDirection: FROM_BANK})
)(LetterPageContainerClass);
