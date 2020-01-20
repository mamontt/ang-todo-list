/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import * as React from 'react';
import styleNames from '@vtb/services/style-names';
import {formatDateToDDMMYYYY} from '@vtb/services/l10n';
import {translate} from './../../../../utils/translate';
import {DocumentType} from './';
import styles from './styles.scss';

const sn = styleNames(styles);

export const ResultContentItem = ({document}: {document: DocumentType}) => (
    <div className={sn('result-content__item')}>
        {translate(
            'documentSignatures.documentNumber',
            {number: document.documentNumber, createDate: formatDateToDDMMYYYY(document.documentDate)}
        )}
    </div>
);
