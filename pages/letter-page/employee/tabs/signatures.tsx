/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {connect} from 'react-redux';
import {DocumentSignatures, DOCUMENT_SIGNATURES_MODES} from '@vtb/fe-bi-signatures-list';
import {formatDateToDDMMYYYY} from '@vtb/services/l10n';
import styleNames from '@vtb/services/style-names';
import {userNameSelector} from '@vtb/services/auth';
import {
    getCheckSignaturesUrl,
    getSignaturesListUrl,
    getDownloadUrl,
    getCheckAllSignaturesUrl
} from './../../../../api';
import {TO_BANK, FROM_BANK} from './../../../../modules/define-letter-direction/';
import {translate} from './../../../../utils/translate';
import {buildDisableActions} from '../../../../pages/letter-page/utils';
import styles from '../../letter-page.scss';
import {getDigestsUrl, getRemoveSignatureUrl} from '../../../../api/signature';
import {EMPLOYEE_CAPABILITIES_URL} from '../../../../api/urls';
import {getCommonConfig} from '../../../../modules/signable';
import {removeSignatures} from '../../../../modules/signatures';
import {LetterDirection} from '../../../../modules/define-letter-direction';
import {StoreType} from '../../../../store/root-selector';

const sn = styleNames(styles);

export type ScopeUidsProps = {
    changesHistoryStoreUid?: number;
    linkedDocumentsStoreUid?: number;
    signaturesStoreUid?: number;
}

type Fetch = (documentId: number | string, letterDirection: typeof FROM_BANK | typeof TO_BANK) => void;
type SignProps = {
    documentId: string | number;
    letterDirection: LetterDirection;
    signaturesStoreUid: string | number;
}

export type SignaturesProps = {
    documentId?: number | string;
    documentStatusId?: number | string;
    edocRefId?: number;
    fetch?: Fetch;
    fetchLetterCapabilitiesById?: Fetch;
    signDocument?: (props: SignProps) => void;
    number?: number;
    createDate?: (date: string) => string;
    letterDirection?: typeof FROM_BANK | typeof TO_BANK;
    capabilities?: Array<string>;
    onInit: number;
    scopeUids?: ScopeUidsProps;
    signName: string;
    removeSignatures: (param: any) => void;
}

export type SignaturesClassState = {
    fetching: boolean;
}

class SignaturesClass extends React.PureComponent<SignaturesProps, SignaturesClassState> {
    state = {fetching: false};
    handleRemoveEnd = () => {
        const {documentId, letterDirection} = this.props;
        this.setState({fetching: true});
        Promise.all([
            this.props.fetch(documentId, letterDirection),
            this.props.fetchLetterCapabilitiesById(documentId, letterDirection)
        ]).then(() => this.setState({fetching: false}));
    };

    handleRemove = () => {
        const {
            documentId,
            createDate,
            number
        } = this.props;

        const documents = [{
            id: documentId,
            documentNumber: number,
            documentDate: createDate
        }];

        return new Promise(() => this.props.removeSignatures({
            checkedRows: documents,
            afterAction: (dispatch: Function) => this.handleRemoveEnd(),
            removeSignUrl: (edocId: string) => (signatureId: string) =>
                getRemoveSignatureUrl(edocId, TO_BANK, signatureId),
            listSignUrl: (id: string | number) => getSignaturesListUrl(id, TO_BANK),
            digestSignUrl: (id: string) => getDigestsUrl({id, direction: TO_BANK}),
            capabilitiesUrl: `${EMPLOYEE_CAPABILITIES_URL}?ids=${documents.map(row => row.id).join(',')}`,
            getConfig: getCommonConfig
        }));
    };

    handleSign = () => {
        const {
            documentId, letterDirection, signDocument,
            scopeUids: {signaturesStoreUid}
        } = this.props;
        return signDocument({documentId, letterDirection, signaturesStoreUid});
    };

    render() {
        const {
            documentId,
            createDate,
            documentStatusId,
            number,
            onInit,
            capabilities,
            letterDirection
        } = this.props;
        const disableActions = buildDisableActions(capabilities);
        return (
            <div className={sn('wrap-document-signatures')}>
                {!this.state.fetching && <DocumentSignatures
                    getSignaturesUrl={getSignaturesListUrl(documentId, letterDirection)}
                    checkSignaturesUrl={getCheckSignaturesUrl(documentId, letterDirection)}
                    checkAllSignaturesUrl={getCheckAllSignaturesUrl(documentId, letterDirection)}
                    downloadUrl={getDownloadUrl(documentId, letterDirection)}
                    footerValue={documentId}
                    mode={DOCUMENT_SIGNATURES_MODES.Client}
                    removeAction={this.handleRemove}
                    currentDocumentStatus={documentStatusId}
                    documentNumber={translate('documentSignatures.documentNumber', {number, createDate: formatDateToDDMMYYYY(createDate)})}
                    onSign={this.handleSign}
                    onInit={onInit}
                    disableActions={disableActions}
                />}
            </div>
        );
    }
}

export const Signatures = connect((state: StoreType) => ({
    signName: userNameSelector(state)
}), {removeSignatures})(SignaturesClass);
