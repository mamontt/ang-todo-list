/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {Signature2} from '@vtb/fe-bi-signature';
import {get, flatten} from 'lodash';
import {SignatureId, fetchDocumentSignatures, Signature} from './fetch-document-signatures';
import {dateTimeToDate} from '../../utils/date-formatter/date-formatter';
import {Row} from '../../pages/letter-scroller/common/table/recall-cell/row-type';

export type DocumentSignType = {
    id?: number;
    documentNumber?: string | number;
    documentDate?: string;
}

type After = (dispatch: Function) => void;
type EdocIdMap = {
    signatureId?: string;
}

export type RemoveSignaturesParams = {
    checkedRows: Array<Row>;
    afterAction: After;
    removeSignUrl: (edocId: string) => (signatureId: string | number) => string;
    listSignUrl: (id: string | number) => string;
    digestSignUrl: (id: string | number) => string;
    getConfig: (after: After) => any;
    capabilitiesUrl: string;
}

export const removeSignatures = ({
    checkedRows,
    afterAction,
    removeSignUrl,
    listSignUrl,
    digestSignUrl,
    getConfig,
    capabilitiesUrl
}: RemoveSignaturesParams) => (dispatch: Function) => {
    const edocIdMap: EdocIdMap = {};
    const removeUrl = (signatureId: SignatureId) => removeSignUrl(edocIdMap[signatureId])(signatureId);
    const getTitle = (document: DocumentSignType) => {
        const documentNumber = get(document, 'documentNumber', '') || '';
        const documentDate = get(document, 'documentDate', '') || '';
        if (documentNumber && documentDate) {
            return `№ ${documentNumber} от ${dateTimeToDate(documentDate)}`;
        }
        return '';
    };

    Promise.all(
        checkedRows.map((document: Row) =>
            fetchDocumentSignatures(listSignUrl(document.id)).then((signatures: Array<Object>) => {
                const newSignatures = signatures
                    .map((signature: Signature) => ({
                        ...signature,
                        documentNumber: getTitle(document),
                        digestsUrl: digestSignUrl(document.id)
                    }));
                newSignatures.forEach((signature: Signature) => (edocIdMap[signature.id] = document.id));
                return newSignatures;
            }))
    ).then((signatures: Array<any>) =>
        dispatch(
            Signature2.removeSignatureDocuments({
                removeUrl,
                signatures: flatten(signatures),
                ...getConfig(afterAction),
                afterAction,
                capabilitiesUrl
            })
        ));
};
