/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2018 VTB Group. All rights reserved.
 */
import {Letter} from '../common-types';

type DocumentType = {
    additionalFields: {
        reason: string;
        cancelEdocId: number;
        cancelEdocTypeId: number;
        cancelEdocNumber: number;
    };
    createDate: string;
    docTypeId: number;
    documentDate: string;
    documentNumber: string;
    edocId: number;
    lastCheckResults: Letter;
    lastModifyDate: string;
    status: {
        extendedId: string;
        extendedName: string;
        id: string;
        name: string;
    };
    reason?: string;
}

type ResultType = {
    cancelRequests: Array<DocumentType>
}

export const normalizeCancelRequests = (documents: Array<DocumentType>) => {
    const result: ResultType = {
        cancelRequests: []
    };

    documents.forEach((item: DocumentType) => {
        const document = {
            reason: item.additionalFields ? item.additionalFields.reason : '',
            ...item
        };

        result.cancelRequests.push(document);
    });

    return result;
};
