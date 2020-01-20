/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {PureComponent} from 'react';
import {isNil, includes} from 'lodash';
import {connect} from 'react-redux';
import {reduxForm} from 'redux-form';
import {compose} from 'redux';
import createValidationHoc from '@vtb/services/validate';
import {organizationsSelector} from '@vtb/services/auth';
import {getDocumentCapabilities, fetchCapabilities} from './../../../modules/capabilities';
import {
    basicRequisitesTabId,
    changesHistoryTabId,
    documentSignaturesTabId,
    linkedDocuments
} from './../../../constants/tabs-names';
import {defineLetterDirection, LetterDirection, TO_BANK} from './../../../modules/define-letter-direction';
import {
    notifyUnsavedChangesOnClose,
    formFetchAndClear,
    onChange,
    notifyValidationErrorsOnLoad
} from './../../../modules/common-form-hocs';
import {getLettersRulesUrl} from './../../../api';
import {READ} from './../../../constants/document-action-capabilities';
import {translate} from './../../../utils/translate';
import {updateValidation} from './../../../modules/validation';
import {recallAction} from './../../../modules/cancel-request';
import {UserContext} from './../../../modules/user-context';
import {getDocumentCheckUrl, letter} from './../../../api/letter';
import {StoreType} from './../../../store/root-selector';
import {
    fetchLetterById,
    fetchLetterCapabilitiesById,
    markAsRead,
    presetClient,
    presetBranch,
    signDocument
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
    getDocumentStatus,
    getDocumentExtendedStatusName,
    getDocumentStatusId,
    getClientSnapshot,
    getBranchSnapshot,
    getEnableExportReceipts,
    getRead,
    getEdocRefId,
    getCreateDate,
    getFavouriteFlag,
    getRelatedDocuments,
    getInitClientSnapshot,
    getDocumentAttachments,
    getLastCheckResults,
    getInitTypeLetter,
    getActiveTabId,
    getNumber,
    getCopyFlag,
    getMyDocumentNumber
} from '../selectors';
import {LetterPage} from './letter-page';
import {findOutMainTitle} from './titles-selectors';
import {withIdReplacement} from '../common/with-id-replacement';
import {rebuildCheckResultsData, getIdFromSnapshot, buildTabs} from '../utils';
import {withCopyDocument} from '../../../modules/copy-document';
import {Branch, Client, Letter} from '../../../common-types';
import {resetNumber, setNumber, SetNumber} from '../official/actions';
import {verifyDocumentNumber, VerifyDocumentNumber} from '../common/on-change';

export type Props = {
    hasRelatedDocuments: boolean;
    documentId: number;
    documentStatus: string;
    letterDirection: LetterDirection;
    userContext: UserContext;
    updateValidation?: (
        param: {
            namespace: string;
            formName: string;
            endpoint: string;
        }
    ) => () => void;
    fetchLetterById?: (documentId: number, letterDirection: LetterDirection) => void;
    activeTab?: string;
    markAsRead?: (documentId: number, letterDirection: LetterDirection) => void;
    read?: boolean;
    capabilities?: Array<string>;
    initProps?: Letter;
    orgId?: number;
    initClientSnapshot?: Client;
    presetClient?: (letterDirection: LetterDirection, orgId: number, initProps: Letter) => void;
    presetLetterType?: (letterDirection: LetterDirection) => void;
    typeLetter?: string;
    clientSnapshot?: Client;
    number?: number;
    resetNumber?: (value: string) => void;
    setNumber: SetNumber;
    fetchDocumentNumber?: (letterDirection: LetterDirection, clientSnapshot: Client) => void;
    documentStatusId?: number;
    initialValues?: Letter;
    branchSnapshot?: Branch;
    refetchRules?: (url: string) => void;
    isCopy: boolean;
    isMyDocumentNumber: boolean;
    pristine: boolean;
    verifyDocumentNumber: VerifyDocumentNumber;
};

class LetterPageContainerClass extends PureComponent<Props> {
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
                fetchCapabilities={fetchCapabilities}
                updateValidation={this.props.updateValidation({
                    namespace: LETTER_PAGE_FETCH_NAMESPACE,
                    formName: LETTER_PAGE_NAME,
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
        (state: StoreType, ownProps: Props) => ({
            mainTitle: findOutMainTitle(ownProps.letterDirection)(state),
            initialValues: getInitialValuesWithDate(state),
            viewMode: getViewMode(state),
            documentStatus: getDocumentStatus(state),
            documentExtendedStatusName: getDocumentExtendedStatusName(state),
            documentStatusId: getDocumentStatusId(state),
            isMyDocumentNumber: getMyDocumentNumber(state),
            enableExportReceipts: getEnableExportReceipts(state),
            capabilities: getDocumentCapabilities(LETTER_DOCUMENT_NAME)(state),
            read: getRead(state),
            edocRefId: getEdocRefId(state),
            createDate: getCreateDate(state),
            orgId: organizationsSelector(state),
            clientSnapshot: getClientSnapshot(state),
            branchSnapshot: getBranchSnapshot(state),
            number: getNumber(state),
            isFavourite: getFavouriteFlag(state),
            hasRelatedDocuments: getRelatedDocuments(state),
            initClientSnapshot: getInitClientSnapshot(state),
            documentAttachments: getDocumentAttachments(state),
            lastCheckResults: getLastCheckResults(state),
            typeLetter: getInitTypeLetter(state),
            activeTab: getActiveTabId(state),
            isCopy: getCopyFlag(state)
        }),
        {
            disableSave,
            enableSave,
            fetchLetterById,
            fetchLetterCapabilitiesById,
            markAsRead,
            presetBranch,
            presetClient,
            presetLetterType,
            recallAction,
            rejectedFile,
            setActiveTab,
            signDocument,
            updateErrors: updateSyncErrors,
            updateValidation,
            fetchDocumentNumber,
            resetNumber,
            setNumber,
            verifyDocumentNumber
        }
    ),
    // TODO: VTBDBODSF-311, VTBDBODSF-312: added requests actions and document info when changing the tab
    onChange(
        'activeTab',
        ({
            documentId, letterDirection, activeTab, isCopy, ...props
        }: Props) =>
            activeTab !== null &&
            !isNil(documentId) &&
            !Number.isNaN(documentId) &&
            !isCopy &&
            props.fetchLetterById(documentId, letterDirection)
    ),
    onChange(
        ['documentId', 'capabilities', 'read'],
        ({
            documentId, read, letterDirection, capabilities, ...props
        }: Props) => {
            if (!isNil(documentId) && includes(capabilities, READ) && read === false) {
                props.markAsRead(documentId, letterDirection);
            }
        }
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
        ['documentId'],
        ({
            documentId, initProps, letterDirection, orgId, initClientSnapshot, typeLetter, ...props
        }: Props) => {
            if (isNil(documentId) && isNil(initClientSnapshot)) {
                props.presetClient(letterDirection, orgId, initProps);
            }
            if (isNil(documentId) && isNil(typeLetter)) {
                props.presetLetterType(letterDirection);
            }
        }
    ),
    onChange(
        ['clientSnapshot'],
        (props: Props) => props.verifyDocumentNumber(props)
    ),
    onChange(['clientSnapshot', 'branchSnapshot'], ({clientSnapshot, branchSnapshot, refetchRules}: Props) =>
        refetchRules(getLettersRulesUrl(getIdFromSnapshot(clientSnapshot), getIdFromSnapshot(branchSnapshot)))),
    // TODO Remove .phone when PhoneInput would be fixed
    notifyUnsavedChangesOnClose,
    notifyValidationErrorsOnLoad(LETTER_PAGE_NAME, rebuildCheckResultsData),
    withCopyDocument({resource: letter, form: LETTER_PAGE_NAME, letterDirection: TO_BANK})
)(LetterPageContainerClass);
