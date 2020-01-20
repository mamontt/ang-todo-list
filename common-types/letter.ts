/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {Client} from './client';
import {Branch} from './branch';

export type CancelReq = {
    baseStatus: string;
    baseStatusName: string;
    id: number;
    reason: string;
};

export type Letter = {
    id: number;
    read: boolean;
    favourite: boolean;
    toBank: boolean;
    hasRelatedDocuments: boolean;
    edocRefId: number;
    documentNumber: string;
    letterType: {id: string};
    topic: string;
    content: string;
    clientSnapshot: Client;
    branchSnapshot: Branch;
    clientResponsibleOfficer: {name: string};
    attachments: Array<any>;
    status: {
        id: string;
        name: string;
        extendedId: string;
        extendedName: string;
    };
    createDate: string;
    documentDate: string;
    lastCheckResults: Array<any>;
    edocId?: string;
    cancelReq?: CancelReq;
};
