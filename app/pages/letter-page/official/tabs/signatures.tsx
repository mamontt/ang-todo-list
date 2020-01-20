/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {AnyAction, Dispatch} from 'redux';
import {connect} from 'react-redux';
import {DocumentSignatures, DOCUMENT_SIGNATURES_MODES} from '@vtb/fe-bi-signatures-list';
import {formatDateToDDMMYYYY} from '@vtb/services/l10n';
import {userNameSelector} from '@vtb/services/auth';
import styleNames from '@vtb/services/style-names';
import {
    getCheckSignaturesUrl,
    getSignaturesListUrl,
    getDownloadUrl,
    getCheckAllSignaturesUrl
} from './../../../../api';
import {translate} from './../../../../utils/translate';
import {SignaturesProps} from '../../../../pages/letter-page/employee/tabs/signatures';
import {buildDisableActions} from '../../../../pages/letter-page/utils';
import styles from '../../letter-page.scss';
import {removeSignatures} from '../../../../modules/signatures';
import {getDigestsUrl, getRemoveSignatureUrl} from '../../../../api/signature';
import {FROM_BANK} from '../../../../modules/define-letter-direction';
import {EMPLOYEE_CAPABILITIES_URL} from '../../../../api/urls';
import {getCommonConfig} from '../../../../modules/signable';
import {StoreType} from '../../../../store/root-selector';

const sn = styleNames(styles);

class SignaturesClass extends React.PureComponent<SignaturesProps> {
    handleRemoveEnd = () => {
        const {documentId, letterDirection} = this.props;
        this.props.fetch(documentId, letterDirection);
        this.props.fetchLetterCapabilitiesById(documentId, letterDirection);
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
            afterAction: (dispatch: Dispatch<AnyAction>) => this.handleRemoveEnd(),
            removeSignUrl: (edocId: string) => (signatureId: string) =>
                getRemoveSignatureUrl(edocId, FROM_BANK, signatureId),
            listSignUrl: (id: string | number) => getSignaturesListUrl(id, FROM_BANK),
            digestSignUrl: (id: string) => getDigestsUrl({id, direction: FROM_BANK}),
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
                <DocumentSignatures
                    getSignaturesUrl={getSignaturesListUrl(documentId, letterDirection)}
                    checkSignaturesUrl={getCheckSignaturesUrl(documentId, letterDirection)}
                    downloadUrl={getDownloadUrl(documentId, letterDirection)}
                    checkAllSignaturesUrl={getCheckAllSignaturesUrl(documentId, letterDirection)}
                    footerValue={documentId}
                    mode={DOCUMENT_SIGNATURES_MODES.Client}
                    removeAction={this.handleRemove}
                    currentDocumentStatus={documentStatusId}
                    documentNumber={translate('documentSignatures.documentNumber', {number, createDate: formatDateToDDMMYYYY(createDate)})}
                    onSign={this.handleSign}
                    onInit={onInit}
                    disableActions={disableActions}
                />
            </div>
        );
    }
}

export const Signatures = connect((state: StoreType) => ({
    signName: userNameSelector(state)
}), {removeSignatures})(SignaturesClass);
