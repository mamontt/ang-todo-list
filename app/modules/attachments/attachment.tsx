/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {noop} from 'lodash';
import {Fields} from '@vtb/fe-ui-input';

type DefaultProps = {
    onRejectedFile?: Function;
    onChange?: Function;
    maxSize?: number;
    maxTotalSize?: number;
    accept?: Array<string>;
    url?: string;
    uploadEndpoint?: string;
    downloadEndpoint?: string;
    deleteEndpoint?: string;
    multiple?: boolean;
}

export type AttachmentType = DefaultProps & {
    disabled?: boolean;
    value?: Array<Object>;
    name?: string;
    startUpload?: Function;
    finishUpload?: Function;
    clientExtId?: string | number;
}

const AVAILABLE_FILE_TYPES = [
    'text/plain',
    'application/dbf',
    'application/rtf',
    'application/pdf',
    'image/tiff',
    'image/jpeg',
    'image/gif',
    'image/png',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/x-x509-ca-cert'
];

export const ATTACHMENT_URL = '/attachment/attachments';

export const Attachment = (props: AttachmentType) => <Fields.Attachments {...props} />;

export const attachmentsDefaultProps = {
    onRejectedFile: noop,
    onChange: noop,
    maxSize: 15 * 1024 * 1024,
    maxTotalSize: 150 * 1024 * 1024,
    accept: AVAILABLE_FILE_TYPES,
    url: '/api',
    uploadEndpoint: ATTACHMENT_URL,
    downloadEndpoint: ATTACHMENT_URL,
    deleteEndpoint: ATTACHMENT_URL,
    multiple: true
};

Attachment.defaultProps = attachmentsDefaultProps;
