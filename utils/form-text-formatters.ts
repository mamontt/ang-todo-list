/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {isEmpty, isNil} from 'lodash';
import {formatDateToDDMMYYYY} from '@vtb/services/l10n';

export function formatNumber(number: number) {
    if (isEmpty(number)) {
        return '';
    }
    return `№ ${String(number)}`;
}

export function formatDate(date: string) {
    if (isNil(date)) {
        return '';
    }
    return formatDateToDDMMYYYY(date);
}
