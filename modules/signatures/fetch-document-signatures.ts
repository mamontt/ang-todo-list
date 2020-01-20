/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2018 VTB Group. All rights reserved.
 */
import { values, flatten, flow } from 'lodash';
import { map } from 'lodash/fp';
import {formatDateToDDMMYYYY, formatDateToHHmmss} from '@vtb/services/l10n';
import {resource} from '../resource';

export type SignatureType = 'SIGN' | 'ACCEPTANCE' | 'VISITING';
export type SignatureId = number | string;
export type CheckResults = 'VALID' | 'INVALID' | 'EXPIRED';
export type BankCheckResults = 'CORRECT' | 'INCORRECT' | 'NO_RIGHTS';
export type Signature = {
    number: number;
    signed: boolean;
    type: SignatureType;
    id?: SignatureId;
    date?: string;
    time?: string;
    userName?: string;
    status?: CheckResults;
    signDescription?: string;
    certificateId?: string;
    checking?: boolean;
    removing?: boolean;
    bankCheckResult?: BankCheckResults;
}

export type SignatureInfo = {
    id: SignatureId;
    date: string;
    userId?: string;
    userName: string;
    signDescription: string;
    checkResult?: BankCheckResults;
    certificateId?: string;
}

export type SignatureModel = {
    type: SignatureType;
    number: number;
    userName?: string;
    userId?: string;
}

export type RawSignature = {
    signatureModel: SignatureModel;
    signatureInfo?: SignatureInfo;
}

const formatSignature = (signatureData: RawSignature): Signature => {
    const {signatureModel: model, signatureInfo: info} = signatureData;

    const result: Signature = {
        signed: false,
        type: model.type,
        number: model.number,
        userName: model.userName
    };

    return info ? {
        ...result,
        signed: true,
        id: info.id,
        date: formatDateToDDMMYYYY(info.date),
        time: formatDateToHHmmss(info.date),
        userName: info.userName,
        signDescription: info.signDescription,
        bankCheckResult: info.checkResult,
        certificateId: info.certificateId
    } : result;
};

export const fetchDocumentSignatures = (listSignUrl: string): Promise<any[]> =>
    resource(listSignUrl).get()
        .then(({signatures = []}) => flow([
            values,
            flatten,
            map((signRaw: RawSignature) => formatSignature(signRaw))
        ])(signatures));
