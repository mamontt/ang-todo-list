/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {Signature2} from '@vtb/fe-bi-signature';
import {closeModal} from '@vtb/fe-ui-dialog';
import {isFunction} from 'lodash';
import {letterTitleFormatter} from './../../utils/digest-formatter';
import {getDigestsUrl, getSignaturesSimpleSmsCodeUrl, getSignaturesSimpleUrl} from './../../api';
import {LetterDirection} from '../../modules/define-letter-direction/define-letter-direction-types';
import {getCommonConfig} from './config';

const otpOperationsParamsUrl = '/api/otp/ui/operations/SIMPLE_SIGNATURE_SIGNING/params';
const defaultOtrUrl = '/api/letters/letters/{documentId}/attachments/{attachmentId}/otr';

type Param = {
    id: string | number;
    direction: string;
    channel?: string;
}

export type SignDocumentsActionParams = {
    getUrlFunc?: () => void;
    getSignUrlFunc: (edocId: string | number) => string;
    getSendUrlFunc: ((documentId: string | number) => void) | string;
    after: Function;
    getConfig?: Function;
    direction: LetterDirection;
    getDigestFunc?: (param: Param) => string;
    otrUrl?: string;
    signAndSend?: boolean;
    getSendSmsCodeUrl?: (direction: string) => string;
    getOtpSignUrl?: (direction: string) => string;
    fetchConfigUrl?: string;
    id?: string | number;
}

export function signDocumentAction({
    getSignUrlFunc,
    getSendUrlFunc,
    id,
    after,
    getConfig = getCommonConfig,
    direction,
    getDigestFunc = getDigestsUrl,
    otrUrl = defaultOtrUrl,
    signAndSend,
    getSendSmsCodeUrl = getSignaturesSimpleSmsCodeUrl,
    getOtpSignUrl = getSignaturesSimpleUrl,
    fetchConfigUrl = otpOperationsParamsUrl
}: SignDocumentsActionParams) {
    return Signature2.signDocuments({
        ...getConfig(after),
        digestsUrl: getDigestFunc({id, direction}),
        signUrl: getSignUrlFunc(id),
        sendUrl: (signAndSend && isFunction(getSendUrlFunc)) ? getSendUrlFunc(id) : null,
        streamingSignature: true,
        otrUrl,
        signAndSend,
        otp: {
            sendSmsCodeUrl: getSendSmsCodeUrl(direction),
            signUrl: getOtpSignUrl(direction),
            fetchConfigUrl
        }
    });
}

export function signDocumentsAction({
    getSignUrlFunc,
    getSendUrlFunc,
    ids,
    after,
    getConfig = getCommonConfig,
    direction,
    getDigestFunc = getDigestsUrl,
    otrUrl = defaultOtrUrl,
    signAndSend,
    getSendSmsCodeUrl = getSignaturesSimpleSmsCodeUrl,
    getOtpSignUrl = getSignaturesSimpleUrl,
    fetchConfigUrl = otpOperationsParamsUrl
}: SignDocumentsActionParams & {ids: Array<string>}) {
    return Signature2.signManyDocuments({
        ...getConfig(after),
        signAndSend,
        digestTitleFormatter: letterTitleFormatter,
        streamingSignature: true,
        sendUrl: signAndSend ? getSendUrlFunc : null,
        many: ids.map(id => ({
            digestsUrl: getDigestFunc({id, direction}),
            signUrl: getSignUrlFunc(id),
            otrUrl
        })),
        otp: {
            sendSmsCodeUrl: getSendSmsCodeUrl(direction),
            signUrl: getOtpSignUrl(direction),
            fetchConfigUrl
        }
    });
}
