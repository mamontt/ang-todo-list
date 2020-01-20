/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {Icons} from '@vtb/fe-ui-icon';
import {translate} from './../../../utils/translate';
import {ResultContent} from './result-content';

export const createInfoContent = (documents: Array<Object>, total: number) => ([{
    icon: <Icons.Info />,
    text: translate('actions.group-modal-info', {count: documents.length, total}),
    messageType: 'info'
}]);

const successConfig = (executedDocuments: Array<Object>, actionText: string) => (
    (executedDocuments.length > 0) ? [{
        icon: <Icons.Done />,
        text: translate('actions.group-modal-done', {count: executedDocuments.length, action: actionText}),
        messageType: 'done',
        scrollContent: <ResultContent documents={executedDocuments} />
    }] : []
);

const errorConfig = (erroredDocuments: Array<Object>, actionText: string) => (
    (erroredDocuments.length > 0) ? [{
        icon: <Icons.Error />,
        text: translate('actions.group-modal-error', {count: erroredDocuments.length, action: actionText}),
        messageType: 'error',
        scrollContent: <ResultContent documents={erroredDocuments} />
    }] : []
);

export const createResultContent = (
    actionText: string,
    executedDocuments: Array<Object>,
    erroredDocuments: Array<Object>
) => [
    ...successConfig(executedDocuments, actionText),
    ...errorConfig(erroredDocuments, actionText)
];
