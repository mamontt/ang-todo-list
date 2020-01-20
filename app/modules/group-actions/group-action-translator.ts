/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {fromPairs} from 'lodash';
import {translate} from '../../utils/translate';

export const groupActionTranslator = (actionName: string) =>
    fromPairs(
        [
            'translateDocumentNumber',
            'translateInfoText',
            'translateSuccessText',
            'translateFailureText',
            'translateResultTitle',
            'translateLoadingText',
            'translateConfirmationTitle',
            'translateConfirmButtonText',
            'translateConfirmationText',
            'translateCancelButtonText'
        ].map(key => [key, (params: any) => translate(`group-actions.${actionName}.${key}`, params)])
    );
