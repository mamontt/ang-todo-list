/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {QuickView} from '@vtb/fe-bi-quick-view';
import {Attachments} from '@vtb/fe-ui-attachment';
import {attachmentsDefaultProps, AttachmentType} from './attachment';

type FileType = {
    attachmentId: string;
    fileName: string;
    size: number;
}

const getKeyForAttachments = ({value = []}: AttachmentType) =>
    (value ? value.reduce((acc: string, item: FileType) => `${acc}${item.attachmentId}`, '') : 0);

export const AttachmentsListQuickView = (props: AttachmentType) => {
    return (
        <QuickView.Block>
            <Attachments key={getKeyForAttachments(props)} {...props} />
        </QuickView.Block>
    );
};

Attachments.defaultProps = {...attachmentsDefaultProps, disabled: true};
