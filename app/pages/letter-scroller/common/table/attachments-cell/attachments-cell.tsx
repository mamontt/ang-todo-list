/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {Icons} from '@vtb/fe-ui-icon';
import styleNames from '@vtb/services/style-names';
import {translate} from './../../../../../utils/translate';
import styles from './attachments-cell.scss';
import {Row} from '../recall-cell/row-type';

const sn = styleNames(styles);

export function AttachmentsCell({row}: Row) {
    if (!row.attachments || !row.attachments.length) {
        return null;
    }

    return (
        <div className={sn('attachments-cell')}>
            <div className={sn('attachments-cell__icon')}>
                <Icons.Attach alt={translate('common.attachments')} />
            </div>
        </div>
    );
}
