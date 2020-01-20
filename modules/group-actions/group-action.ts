/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2018 VTB Group. All rights reserved.
 */
import {Letter} from './../../common-types/letter';

export type GroupActionDocumentResults = {document: Letter; result: {error: boolean; message: string; data?: any}};

export type GroupActionResults = {
    allResults: Array<GroupActionResults>;
    successResults: Array<GroupActionResults>;
    failedResults: Array<GroupActionResults>;
};

export type GroupAction<T = null> = (params: {
    allDocuments: Array<Letter>;
    additionalParams?: T;
}) => Promise<GroupActionResults>;
