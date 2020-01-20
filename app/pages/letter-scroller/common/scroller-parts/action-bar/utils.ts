/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {uniq} from 'lodash';

export const getSelectedStatuses = (checkedRows: Array<{[key: string]: any}>, allRows: Array<{[key: string]: any}>) => {
    const uniqueStatuses = uniq(checkedRows.map((item: {status: {id: number}}) => item.status.id));
    return allRows.length === checkedRows.length ? 'ALL' : uniqueStatuses;
};
