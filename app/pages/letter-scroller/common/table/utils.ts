/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {DataTable} from '@vtb/fe-ui-table';
import {Row} from './recall-cell/row-type';

export function rowStylesModifier(row: Row) {
    return !row.read ? DataTable.RowStyles.ACCENT_NEW : null;
}
