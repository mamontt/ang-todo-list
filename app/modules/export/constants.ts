/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {PDF, CSV, RTF, XLS} from './export-formats';

export const LIST_TYPE = 'list';
export const DETAIL_TYPE = 'detail';
export const DEFAULT_FIELDS = 'documentNumber,documentDate,branchSnapshot.shortName,clientSnapshot.shortName,topic,letterType.name,status.name,status.extendedName,attachments';
export const exportTypes = [
    {
        value: LIST_TYPE,
        label: 'modal.export.list-of-documents',
        disabled: false
    },
    {
        value: DETAIL_TYPE,
        label: 'modal.export.separate-documents',
        disabled: false
    }
];

export const extensionItems = [
    {
        value: PDF,
        label: 'PDF'
    },
    {
        value: RTF,
        label: 'RTF'
    },
    {
        value: XLS,
        label: 'XLS'
    },
    {
        value: CSV,
        label: 'CSV'
    }
];

export const initialValues = {
    type: LIST_TYPE,
    extension: PDF,
    split: false
};

export const initialValuesForSingle = {
    extension: PDF
};

