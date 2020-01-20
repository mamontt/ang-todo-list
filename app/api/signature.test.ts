/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {TO_BANK} from './../modules/define-letter-direction';
import {
    getDigestsUrl,
    getSignatureUrl,
    getSignaturesUrl,
    getSignaturesListUrl,
    getSignaturesSimpleUrl,
    getSignaturesSimpleSmsCodeUrl,
    getCheckSignaturesUrl,
    getRemoveSignatureUrl,
    getCheckAllSignaturesUrl,
    getDownloadUrl
} from './signature';

jest.mock('redux-reducers-injector', () => ({
    injectReducer: () => {}
}));

describe('api/signature', () => {
    it('generates correct urls', () => {
        const id = 'id';
        const direction = TO_BANK;
        const edocId = 'edocId';
        const signatureId = 'signatureId';
        const documentId = 'documentId';

        expect([
            getDigestsUrl({id, direction, channel: 'WEB'}),
            getSignatureUrl(edocId),
            getSignaturesUrl(documentId, direction),
            getSignaturesListUrl(documentId, direction),
            getSignaturesSimpleUrl(direction),
            getSignaturesSimpleSmsCodeUrl(direction),
            getCheckSignaturesUrl(documentId, direction),
            getRemoveSignatureUrl(documentId, direction, signatureId),
            getCheckAllSignaturesUrl(documentId, direction),
            getDownloadUrl(documentId, direction)
        ]).toEqual([
            '/api/letters/letters/toBank/esigner/signatures/id/WEB',
            '/api/letters/letters/edocId/sign',
            '/api/letters/letters/toBank/ui/edocs/documentId/signatures',
            '/api/letters/letters/toBank/ui/edocs/documentId/signatures/compare',
            '/api/letters/letters/toBank/ui/edocs/{documentId}/signatures/simple',
            '/api/letters/letters/toBank/ui/edocs/{documentId}/signatures/simple/smscode',
            '/api/letters/letters/toBank/ui/edocs/documentId/signatures/checks',
            '/api/letters/letters/toBank/esigner/signatures/documentId/signatureId',
            '/api/letters/letters/toBank/ui/edocs/documentId/signatures/check/all/WEB',
            '/api/letters/letters/toBank/ui/edocs/documentId/signatures/snapshots/'
        ]);
    });
});
