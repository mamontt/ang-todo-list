/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2018 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {ComponentType} from 'react';
import {ChangesHistoryContainer} from '@vtb/fe-bi-changes-history';
import {LinkedDocuments as LINKED_DOCUMENTS} from '@vtb/fe-bi-linked-documents';
import {Tabs} from '@vtb/fe-ui-tabs';
import styleNames from '@vtb/services/style-names';
import {
    getOfficialChangesHistoryUrl,
    getEmployeeChangesHistoryUrl,
    getLinkedDocumentsUrl,
    getChangesHistoryReceipt,
    getSignatureUrl
} from './../../../api';
import {ShadePage} from './../../../modules/shade-page';
import {OFFICIAL, UserContext} from './../../../modules/user-context';
import {bindStoreId} from './../../../modules/scoped';
import {
    basicRequisitesTabId,
    changesHistoryTabId,
    documentSignaturesTabId,
    linkedDocuments
} from './../../../constants/tabs-names';
import {CUSTOM_STATUSES_ICONS} from './../../../constants/custom-statuses-icons';
import {
    LETTER_PAGE_NAME,
    LETTER_PAGE_FETCH_NAMESPACE,
    LETTER_VALIDATION_NAMESPACE
} from '../letter-page-constants';
import {PagePanel} from '../page-partials';
import styles from '../letter-page.scss';
import {Signatures} from './tabs/signatures';
import {getResource} from './actions';
import {getButtonsDescriptors} from './letter-buttons-descriptors';
import {Sidebar} from '../sidebar';
import {rebuildCheckResultsData} from '../utils';
import {FormContainer} from './form-container';
import {LetterPageProps} from '../employee/letter-page';
import {normalizeCancelRequests} from '../../../utils/normalizeHelper';
import {fetchCapabilities} from '../../../modules/capabilities';

const sn = styleNames(styles);
const LinkedDocumentsContainer = LINKED_DOCUMENTS.Container;
// TODO: VTBDBODSF-311, VTBDBODSF-312: added requests actions and document info when changing the tab
const userContext: UserContext = {type: OFFICIAL};
const loaderNamespaces = [LETTER_PAGE_FETCH_NAMESPACE];

type Props = {
    isBranchPAO_VTB: boolean;
    branchId?: string;
}

type OfficialLetterPageProps = LetterPageProps & Props;

class LetterPageClass extends React.PureComponent<OfficialLetterPageProps> {
    componentWillUnmount() {
        this.props.setActiveTab(basicRequisitesTabId);
    }

    PageSidebar = Sidebar(this.props.letterDirection, getResource(this.props.letterDirection)) as any;

    pageSidebar = () => {
        const {
            letterDirection, activeTab,
            scopeUids: {signaturesStoreUid, changesHistoryStoreUid},
            form
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
                branchId={this.props.branchId}
                getChangesHistoryUrl={getOfficialChangesHistoryUrl}
                getSignUrlFunc={getSignatureUrl}
                userContext={{type: OFFICIAL}}
                validationNamespace={LETTER_VALIDATION_NAMESPACE}
                getSidebarButtonsDescriptors={descriptors}
                onDocumentChange={this.props.onDocumentChange}
                signaturesStoreUid={signaturesStoreUid}
                changesHistoryStoreUid={changesHistoryStoreUid}
                changesHistoryNamespace={`${form}}_bank`}
                activeTab={activeTab}
            />
        );
    };

    generalForm() {
        const {
            documentId,
            letterDirection,
            documentAttachments,
            viewMode,
            clientSnapshot,
            branchSnapshot,
            isBranchPAO_VTB: isVTB
        } = this.props;

        return (
            <FormContainer
                documentId={documentId}
                letterDirection={letterDirection}
                isNew={documentId === null}
                documentAttachments={documentAttachments}
                clientSnapshot={clientSnapshot}
                branchSnapshot={branchSnapshot}
                viewMode={viewMode}
                userContext={userContext}
                isVTB={isVTB}
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
            scopeInitHandlers: {changesHistoryStoreUid, signaturesStoreUid, linkedDocumentsStoreUid},
            updateValidation,
            recallAction,
            fetchLetterById,
            letterDirection,
            form
        } = this.props;

        const reloadAction = () => {
            fetchLetterById(documentId, letterDirection);
            this.props.dispatch(fetchCapabilities({
                documentName: LETTER_PAGE_FETCH_NAMESPACE,
                resource: getResource(letterDirection),
                capabilitiesSubResource: 'actions',
                form
            })(documentId));
        };

        switch (tabId) {
            case changesHistoryTabId:
                return (
                    <PagePanel key={changesHistoryTabId}>
                        <ChangesHistoryContainer
                            type="bank" // TODO need changes to changes history module naming
                            title={mainTitle}
                            status={documentStatus}
                            enableExportReceipts={enableExportReceipts}
                            url={getOfficialChangesHistoryUrl(documentId)}
                            clientUrl={getEmployeeChangesHistoryUrl(documentId)}
                            downloadUrl={getChangesHistoryReceipt}
                            downloadParam={{name: 'ids', value: documentId}}
                            customStatusesIcons={CUSTOM_STATUSES_ICONS}
                            onInit={changesHistoryStoreUid}
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
                return (
                    <PagePanel key={linkedDocuments}>
                        <LinkedDocumentsContainer
                            loadDocumentsUrl={getLinkedDocumentsUrl(edocRefId, OFFICIAL)}
                            actions={{
                                cancelRequests: {
                                    onView: ({edocId = ''}) => {
                                        recallAction({
                                            userRoleType: userContext.type === OFFICIAL ? 'bank' : 'client',
                                            id: edocId,
                                            type: 'LETTER_TO_BANK',
                                            applicationName: 'letters',
                                            onClose: () => {
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
            activeTab
        } = this.props;
        return (
            <ShadePage
                title={mainTitle}
                sidebar={this.pageSidebar()}
                onClose={onClose}
                documentStatus={documentStatus}
                statusDetail={documentExtendedStatusName}
                loaderNamespaces={loaderNamespaces}
                underHeader={this.renderTabs}
            >
                <div className={sn('wrap-page')}>
                    {this.renderTabComponent(documentId && activeTab)}
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
