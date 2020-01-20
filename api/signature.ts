/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {signatureDirection} from '../api/urls';

const API_URL = '/api';
const LT_API_URL = `${API_URL}/letters`;

export const getDigestsUrl = ({id, direction, channel = 'WEB'}: {id: string | number, direction: string, channel?: string}) => `${LT_API_URL}/letters/${signatureDirection(direction)}/esigner/signatures/${id}/${channel}`;
export const getSignatureUrl = (edocId: string) =>
    `${LT_API_URL}/letters/${edocId}/sign`;
export const getSignaturesUrl = (documentId: string | number, direction: string) => `${LT_API_URL}/letters/${signatureDirection(direction)}/ui/edocs/${documentId}/signatures`;
export const getSignaturesListUrl = (documentId: string | number, direction: string) => `${getSignaturesUrl(documentId, direction)}/compare`;
export const getSignaturesSimpleUrl = (direction: string) => `${getSignaturesUrl('{documentId}', direction)}/simple`;
export const getSignaturesSimpleSmsCodeUrl = (direction: string) => `${getSignaturesSimpleUrl(direction)}/smscode`;
export const getCheckSignaturesUrl = (documentId: string | number, direction: string) => `${getSignaturesUrl(documentId, direction)}/checks`;
export const getRemoveSignatureUrl = (documentId: string | number, direction: string, signatureId: string) =>
    `${LT_API_URL}/letters/${signatureDirection(direction)}/esigner/signatures/${documentId}/${signatureId}`;
export const getCheckAllSignaturesUrl = (documentId: string | number, direction: string) => `${getSignaturesUrl(documentId, direction)}/check/all/WEB`;
export const getDownloadUrl = (documentId: string | number, direction: string) => `${getSignaturesUrl(documentId, direction)}/snapshots/`;
