/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {get} from 'lodash';
import {formatDateToDDMMYYYY} from '@vtb/services/l10n';
import {translate} from '../utils/translate';

const getDate = (digest: Object) => {
    const date = get(digest, 'documentDate', get(digest, 'createDate', ''));
    if (String(date).match(/\d{2}\.\d{2}\.\d{4}/)) {
        return date;
    }

    return formatDateToDDMMYYYY(date);
};

export const letterTitleFormatter =
    (digest: Object) =>
        `${translate('common.letter')} №${get(digest, 'documentNumber', '')} ${translate('common.from')} ${getDate(digest)}`;

export const cancellationTitleFormatter =
    (digest: Object) =>
        `№${get(digest, 'documentNumber', '')} ${translate('common.from')} ${getDate(digest)}`;
