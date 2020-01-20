/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {Branch, Client} from '../../../../../common-types';
import {AttachmentType} from '../../../../../modules/attachments/attachment';

export type Row = {
    attachments: Array<AttachmentType>;
    bankEmployeeNote: string;
    branchSnapshot: Branch;
    clientSnapshot: Client;
    createDate: string;
    documentDate: string;
    documentNumber: string;
    edocRefId: number;
    favourite: boolean;
    hasRelatedDocuments: boolean;
    id: number;
    letterType: string;
    read: boolean;
    status: {
        id: string;
    };
    toBank: boolean;
    topic: string;
    row: RowItem;
}

export type RowItem = {
    attachments: Array<AttachmentType>;
    hasRelatedDocuments: boolean;
    cancelReq: {
        baseStatus: string;
    };
}
