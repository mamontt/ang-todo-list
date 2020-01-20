/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {LetterDirection, TO_BANK} from './../modules/define-letter-direction';
import {ATTACHMENT_URL} from './../modules/attachments';
import {EMPLOYEE} from './../modules/user-context';

const LETTER_DOCUMENT_TYPE_CODE = 1;
const DEFAULT_CHECK_BRANCH_ID = -1;
const DEFAULT_CHECK_CLIENT_ID = -1;
const DEFAULT_CHANEL_ID = -1;
const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_SIZE_NUMBER = 1000;

export const API_URL = '/api';
export const OFFICIAL_NAMESPACE = 'employees';

export const LT_API_URL = `${API_URL}/letters`;

export const CLIENT_CAPABILITIES_SUB_RESOURCE = 'actions/EMPLOYEE';

export const getLettersRulesUrl = (
    clientId: number = DEFAULT_CHECK_CLIENT_ID,
    branchId: number = DEFAULT_CHECK_BRANCH_ID,
    docTypeId: number = LETTER_DOCUMENT_TYPE_CODE,
    channelId: number = DEFAULT_CHANEL_ID,
    page: number = DEFAULT_PAGE_NUMBER,
    size: number = DEFAULT_SIZE_NUMBER
) =>
    `${LT_API_URL}/ui/documentchecks?docTypeId=${docTypeId}&channelId=${channelId}&clientId=${clientId}&branchId=${branchId}&page=${page}&size=${size}`;

export type GetExportUrlOptions = {
    type: string;
    extension: string;
    split: boolean;
    fields: string;
    letterDirection: LetterDirection;
    isOfficial: boolean;
};

export const getExportUrl = (
    ids: string,
    {
        type,
        extension,
        split,
        fields,
        letterDirection,
        isOfficial
    }: GetExportUrlOptions
) => {
    const subpath = isOfficial ? 'letters/employees' : 'letters';
    const params = [
        `ids=${ids}`,
        `format=${extension.toUpperCase()}`,
        `type=${type.toUpperCase()}`,
        `split=${String(split)}`,
        `fields=${fields}`
    ].join('&');
    return `${LT_API_URL}/${subpath}/export-${letterDirection}?${params}`;
};

export const getUrlForSend = (documentId: number | string) => `${LT_API_URL}/letters/${documentId}/send`;
export const getUrlForActionBarSend = `${LT_API_URL}/letters/{documentId}/send`;
export const getUrlForOfficialSend = (documentId: number | string) => `${LT_API_URL}/${OFFICIAL_NAMESPACE}/letters/${documentId}/send`;
export const getUrlForOfficialActionBarSend = `${LT_API_URL}/${OFFICIAL_NAMESPACE}/letters/{documentId}/send`;
export const getEmployeeChangesHistoryUrl = (documentId: string | number) => `${LT_API_URL}/letters/${documentId}/history`;
export const getOfficialChangesHistoryUrl = (documentId: string | number) =>
    `${LT_API_URL}/${OFFICIAL_NAMESPACE}/letters/${documentId}/history`;

export const getChangesHistoryReceipt = `${LT_API_URL}/letters/render-receipt`;
export const getLinkedDocumentsUrl = (documentId: string | number, userType: string) => {
    return userType === EMPLOYEE
        ? `${LT_API_URL}/letters/${documentId}/linked_docs`
        : `${LT_API_URL}/${OFFICIAL_NAMESPACE}/letters/${documentId}/linked_docs`;
};

export const EMPLOYEE_FETCH_LETTER_SCROLLER_URL = `${LT_API_URL}/letters/`;
export const OFFICIAL_FETCH_LETTER_SCROLLER_URL = `${LT_API_URL}/${OFFICIAL_NAMESPACE}/letters/`;

export const EMPLOYEE_CAPABILITIES_URL = `${LT_API_URL}/letters/actions/`;
export const OFFICIAL_CAPABILITIES_URL = `${LT_API_URL}/${OFFICIAL_NAMESPACE}/letters/actions/`;

export const EMPLOYEE_LETTER_SCROLLER_COUNTERS = `${LT_API_URL}/stages/`;
export const OFFICIAL_LETTER_SCROLLER_COUNTERS = `${LT_API_URL}/${OFFICIAL_NAMESPACE}/stages/`;
export const DOCUMENTS_STACK_COUNTER = `${API_URL}/dra/ui/stages`;

export const getPrintUrl = (letterDirection: LetterDirection, ids: string) => (letterDirection === TO_BANK
    ? `${LT_API_URL}/letters/render-to-bank?ids=${ids}`
    : `${LT_API_URL}/letters/render-from-bank?ids=${ids}`);

export const getAttachmentDownloadUrl = (documentId: string, id: string) => (
    documentId ?
        `${LT_API_URL}/letters/${documentId}/attachments/${id}/content` :
        `${API_URL}${ATTACHMENT_URL}/${id}/content`
);

export const signatureDirection = (letterDirection: string) =>
    (letterDirection === TO_BANK ? 'toBank' : 'fromBank');

export const getSignatureChecksUrl = (letterDirection: string) => (documentId: number) =>
    `/api/letters/letters/${signatureDirection(letterDirection)}/ui/edocs/${documentId}/signatures/checks`;

export const getUrlForOfficialProcessComplete = (documentId: number | string) => `${LT_API_URL}/${OFFICIAL_NAMESPACE}/letters/${documentId}/process-complete`;
export const getUrlForReject = (documentId: number | string) => `${LT_API_URL}/${OFFICIAL_NAMESPACE}/letters/${documentId}/reject`;

export const getDeleteDocumentUrl = (documentId: string) => `${LT_API_URL}/letters/${documentId}`;
export const getDeleteDocumentOfficialUrl = (documentId: string) => `${LT_API_URL}/${OFFICIAL_NAMESPACE}/letters/${documentId}`;
