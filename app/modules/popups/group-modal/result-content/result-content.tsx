/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import * as React from 'react';
import styleNames from '@vtb/services/style-names';
import {ResultContentItem} from './result-content-item';
import {DocumentType} from './';
import styles from './styles.scss';

const sn = styleNames(styles);

type ResultContentType = {
    documents: Array<Object>
}

export const ResultContent = ({documents}: ResultContentType) => (
    <div className={sn('result-content')}>
        {documents.map((document: DocumentType) => <ResultContentItem document={document} />)}
    </div>
);
