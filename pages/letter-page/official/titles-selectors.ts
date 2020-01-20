/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {createSelector} from 'reselect';
import {trim, memoize} from 'lodash';
import {formatDate, formatNumber} from './../../../utils/form-text-formatters';
import {FROM_BANK, LetterDirection} from './../../../modules/define-letter-direction';
import {translate} from './../../../utils/translate';
import {getCreateDate, getNumber} from '../selectors';

const getMainPartOfTitle = memoize((letterDirection: LetterDirection) =>
    (letterDirection === FROM_BANK ? translate('letter-official-from-bank') : translate('letter-official-to-bank')));

export const findOutMainTitle = memoize(
    (letterDirection: LetterDirection) => createSelector(
        getNumber,
        getCreateDate,
        (number: number, createDate: string) =>
            trim(`${getMainPartOfTitle(letterDirection)} ${formatNumber(number)} ${createDate ?
                `${translate('common.from')} ${formatDate(createDate)}` : ''}`)
    )
);
