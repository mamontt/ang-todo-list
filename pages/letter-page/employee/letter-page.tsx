/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2018 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {ComponentType} from 'react';
import {ChangesHistoryContainer} from '@vtb/fe-bi-changes-history';
import {LinkedDocuments as LINKED_DOCUMENTS} from '@vtb/fe-bi-linked-documents';
import {Tabs} from '@vtb/fe-ui-tabs';
import {Icons} from '@vtb/fe-ui-icon';
import styleNames from '@vtb/services/style-names';
import {LetterDirection} from './../../../modules/define-letter-direction';
import {
    getEmployeeChangesHistoryUrl,
    getSignatureUrl,
    getLinkedDocumentsUrl,
    getChangesHistoryReceipt,
    getUrlForSend
} from './../../../api';
import {EMPLOYEE, UserContext} from './../../../modules/user-context';
import {ShadePage} from './../../../modules/shade-page';
import {bindStoreId} from './../../../modules/scoped';
import {
    basicRequisitesTabId,
    changesHistoryTabId,
    documentSignaturesTabId,
    linkedDocuments
} from './../../../constants/tabs-names';
import {CUSTOM_STATUSES_ICONS} from './../../../constants/custom-statuses-icons';
import {GoTo} from './../../../utils/routing';
import {normalizeCancelRequests} from './../../../utils/normalizeHelper';
import {
    LETTER_PAGE_NAME,
    LETTER_PAGE_FETCH_NAMESPACE,
    LETTER_VALIDATION_NAMESPACE
} from '../letter-page-constants';
import {PagePanel} from '../page-partials';
import {Signatures, ScopeUidsProps} from './tabs/signatures';
import styles from '../letter-page.scss';
import {Sidebar} from '../sidebar';
import {getButtonsDescriptors} from './letter-buttons-descriptors';
import {getResource} from './actions';
import {rebuildCheckResultsData} from '../utils';
import {FormContainer} from './form-container';
import {Tab} from '../tab-types';
import {Letter, Client, Branch} from '../../../common-types';
import {AttachmentType} from '../../../modules/attachments/attachment';
import {fetchCapabilitiesType} from '../../../modules/capabilities/capabilities-actions';

const sn = styleNames(styles);
const LinkedDocumentsContainer = LINKED_DOCUMENTS.Container;
const userContext: UserContext = {type: EMPLOYEE};

export type LetterPageProps = {
    documentId?: number;
    edocRefId?: number;
    enableExportReceipts?: boolean;
    number?: number;
    documentStatus?: string;
    documentStatusId?: number | string;
    documentExtendedStatusName?: string;
    createDate?: (date: string) => string;
    goTo?: GoTo;
    letterDirection?: LetterDirection;
    letterTabs?: Array<Tab>;
    mainTitle?: string;
    onClose?: () => void;
    disableValidation?: () => void;
    disableWarn?: () => void;
    enableValidation?: () => void;
    enableWarn?: () => void;
    isInspectorVisible?: boolean;
    initialValues?: Letter;
    viewMode?: boolean;
    documentAttachments?: Array<AttachmentType>;
    isFavourite?: boolean;
    onLoadValidationErrors?: (
        lastCheckResults: Letter,
        pageName: string,
        documentId: number | string,
        rebuildCheckResultsData: (document: Letter, documentId?: number) => void
    ) => void;
    lastCheckResults?: Letter;
    showCancellationRequestDocument?: (cancellationDocumentId: number) => void;
    onDocumentChange?: (id: number, toBank: boolean) => void;
    rejectedFile?: () => void;
    updateValidation?: () => void;
    resetClientResponsibleOfficer?: () => void;
    persistentTabId?: string;
    activeTab?: string;
    hasRelatedDocuments?: boolean;
    form?: string;
    clientSnapshot?: Client;
    branchSnapshot?: Branch;
    scopeUids?: ScopeUidsProps;
    disableSave?: () => void;
    enableSave?: () => void;
    setActiveTab?: (basicRequisitesTabId: string) => void;
    scopeInitHandlers?: {
        changesHistoryStoreUid: number;
        signaturesStoreUid: number;
        linkedDocumentsStoreUid: number;
    };
    recallAction?: (action: any) => void;
    fetchLetterById?: (documentId: number, letterDirection: LetterDirection) => void;
    fetchCapabilities?: (
        param: fetchCapabilitiesType
    ) => (id: number) => void;
    dispatch?: Function;
}

class LetterPageClass extends React.PureComponent<LetterPageProps> {
    componentWillUnmount() {
        this.props.setActiveTab(basicRequisitesTabId);
    }

    PageSidebar = Sidebar(this.props.letterDirection, getResource(this.props.letterDirection)) as any;

    pageSidebar = () => {
        const {
            letterDirection, initialValues, activeTab, clientSnapshot,
            scopeUids: {
                signaturesStoreUid,
                changesHistoryStoreUid
            }
        } = this.props;

        const descriptors = getButtonsDescriptors(letterDirection);

        return (

            <this.PageSidebar
                goTo={this.props.goTo}
                edocRefId={this.props.edocRefId}
                documentId={this.props.documentId}
                number={this.props.number}
                createDate={this.props.createDate}
                direction={letterDirection}
                getChangesHistoryUrl={getEmployeeChangesHistoryUrl}
                getSignUrlFunc={getSignatureUrl}
                getSendUrlFunc={getUrlForSend}
                userContext={{type: EMPLOYEE}}
                validationNamespace={LETTER_VALIDATION_NAMESPACE}
                getSidebarButtonsDescriptors={descriptors}
                onDocumentChange={this.props.onDocumentChange}
                signaturesStoreUid={signaturesStoreUid}
                changesHistoryStoreUid={changesHistoryStoreUid}
                changesHistoryNamespace={`${this.props.form}_client`}
                activeTab={activeTab}
                initialValues={initialValues as Letter}
                clientSnapshot={clientSnapshot as Client}
            />
        );
    };

    generalForm() {
        const {documentId, letterDirection} = this.props;
        return (
            <FormContainer
                documentId={documentId}
                letterDirection={letterDirection}
                userContext={userContext}
            />
        );
    }

    handleTabClick = (tabId: string) => {
        this.props.setActiveTab(tabId);
        if (tabId === basicRequisitesTabId) {
            const {onLoadValidationErrors, lastCheckResults, documentId} = this.props;
            onLoadValidationErrors(lastCheckResults, LETTER_PAGE_NAME, documentId, rebuildCheckResultsData);
        }
    };

    // catchScroller = (scroller) => {
    //     if (this.scroller !== scroller) {
    //         this.scroller = scroller;
    //         this.forceUpdate();
    //     }
    // };

    renderMainTitle = (titleText: string, isFavourite: boolean) => (
        <React.Fragment>
            {titleText} {isFavourite && <Icons.Favorites primary />}
        </React.Fragment>
    );

    renderTabComponent = (tabId: string) => {
        const {
            documentId,
            edocRefId,
            disableValidation,
            disableWarn,
            enableValidation,
            enableWarn,
            mainTitle,
            documentStatus,
            enableExportReceipts,
            hasRelatedDocuments,
            isFavourite,
            letterDirection,
            scopeInitHandlers: {changesHistoryStoreUid, signaturesStoreUid, linkedDocumentsStoreUid},
            updateValidation,
            form,
            recallAction,
            fetchLetterById,
            fetchCapabilities,
            setActiveTab
        } = this.props;

        const reloadAction = () => {
            fetchLetterById(documentId, letterDirection);
            this.props.dispatch(fetchCapabilities({
                documentName: LETTER_PAGE_FETCH_NAMESPACE,
                resource: getResource(this.props.letterDirection),
                capabilitiesSubResource: 'actions',
                form
            })(documentId));
        };

        switch (tabId) {
            case changesHistoryTabId:
                return (

                    <PagePanel key={changesHistoryTabId}>
                        <ChangesHistoryContainer
                            type="client" // TODO need changes to changes history module naming
                            title={this.renderMainTitle(mainTitle, isFavourite)}
                            status={documentStatus}
                            enableExportReceipts={enableExportReceipts}
                            url={getEmployeeChangesHistoryUrl(documentId)}
                            clientUrl={getEmployeeChangesHistoryUrl(documentId)}
                            downloadUrl={getChangesHistoryReceipt}
                            downloadParam={{name: 'ids', value: documentId}}
                            onInit={changesHistoryStoreUid}
                            customStatusesIcons={CUSTOM_STATUSES_ICONS}
                            name={form}
                        />
                    </PagePanel>
                );
            case documentSignaturesTabId:
                return (
                    <PagePanel key={documentSignaturesTabId}>
                        <Signatures {...this.props} onInit={signaturesStoreUid} />
                    </PagePanel>
                );
            case linkedDocuments:
                if (hasRelatedDocuments) {
                    return (
                        <PagePanel key={linkedDocuments}>
                            <LinkedDocumentsContainer
                                loadDocumentsUrl={getLinkedDocumentsUrl(edocRefId, EMPLOYEE)}
                                actions={{
                                    cancelRequests: {
                                        onView: ({edocId = ''}) => {
                                            recallAction({
                                                userRoleType: userContext.type === EMPLOYEE ? 'client' : 'bank',
                                                id: edocId,
                                                type: 'LETTER_TO_BANK',
                                                applicationName: 'letters',
                                                onClose: () => {
                                                    setActiveTab(basicRequisitesTabId);
                                                    reloadAction();
                                                },
                                                onUpdate: () => {
                                                    reloadAction();
                                                }
                                            });
                                        }
                                    }
                                }}
                                onInit={linkedDocumentsStoreUid}
                                normalize={normalizeCancelRequests}
                            />
                        </PagePanel>
                    );
                }
                return setActiveTab(basicRequisitesTabId);
            case basicRequisitesTabId:
            default:
                return (
                    <PagePanel
                        key={basicRequisitesTabId}
                        withInspector
                        disableValidation={disableValidation}
                        disableWarn={disableWarn}
                        enableValidation={enableValidation}
                        enableWarn={enableWarn}
                        updateValidation={updateValidation}
                    >
                        {this.generalForm()}
                    </PagePanel>
                );
        }
    };

    renderTabs = () => {
        const {letterTabs, activeTab} = this.props;
        return (
            <div className={sn('wrap-tabs')}>
                <Tabs
                    onChange={this.handleTabClick}
                    tabs={letterTabs}
                    active={activeTab}
                />
            </div>
        );
    };

    render() {
        const {
            mainTitle,
            onClose,
            documentStatus,
            documentExtendedStatusName,
            documentId,
            isFavourite,
            activeTab
        } = this.props;

        const tabComponent: any = this.renderTabComponent(documentId && activeTab);
        return (
            <ShadePage
                title={this.renderMainTitle(mainTitle, isFavourite)}
                sidebar={this.pageSidebar()}
                onClose={onClose}
                documentStatus={documentStatus}
                statusDetail={documentExtendedStatusName}
                loaderNamespaces={[LETTER_PAGE_FETCH_NAMESPACE]}
                underHeader={this.renderTabs}
            >
                <div className={sn('wrap-page')}>
                    {tabComponent}
                </div>
            </ShadePage>
        );
    }
}

export const LetterPage: ComponentType<LetterPageProps> = bindStoreId({
    signaturesStoreUid: null,
    changesHistoryStoreUid: null,
    linkedDocumentsStoreUid: null
})(LetterPageClass);
