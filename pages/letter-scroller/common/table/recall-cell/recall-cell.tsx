/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {get, includes} from 'lodash';
import {Icons} from '@vtb/fe-ui-icon';
import styleNames from '@vtb/services/style-names';
import {translate} from './../../../../../utils/translate';
import styles from './recall-cell.scss';
import {STATUSES} from '../../../../../constants/statuses';

const sn = styleNames(styles);

export const hiddenRecallIconStatuses = [
    STATUSES.DRAFT,
    STATUSES.REJECTED,
    STATUSES.WRONG_E_SIGNATURE,
    STATUSES.DETAILS_ERROR,
    STATUSES.EXECUTED,
    STATUSES.DELETED,
    STATUSES.NOT_RECEIVED_BY_ABS
];

export function RecallCell({row}: {row?: {cancelReq?: {baseStatus?: string}}}) {
    const cancelBaseStatusName = get(row, 'cancelReq.baseStatusName', translate('common.recall'));
    const cancelBaseStatus = get(row, 'cancelReq.baseStatus', null);
    const showIcon = row && row.cancelReq && ['NEW', 'SIGNED'].includes(row.cancelReq.baseStatus) &&
        !includes(hiddenRecallIconStatuses, cancelBaseStatus);
    return showIcon
        ? (
            <div className={sn('recall-cell')}>
                <div className={sn('recall-cell__icon')}>
                    <Icons.Recall alt={cancelBaseStatusName} />
                </div>
            </div>
        )
        : null;
}
