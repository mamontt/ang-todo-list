/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {ReactNode} from 'react';
import {ValidationInspector} from '@vtb/fe-bi-validation-inspector';
import {fieldNames} from './../../../constants/field-names';
import {LETTER_PAGE_NAME} from '../letter-page-constants';

export type InspectorProps = {
    disableValidation?: () => void;
    disableWarn?: () => void;
    enableValidation?: () => void;
    enableWarn?: () => void;
    updateValidation?: () => void;
    children?: ReactNode;
}

export function PageInspector({
    disableValidation,
    disableWarn,
    enableValidation,
    enableWarn,
    updateValidation,
    children
}: InspectorProps) {
    return (
        <ValidationInspector.ValidationInspector
            fieldsNames={fieldNames()}
            formName={LETTER_PAGE_NAME}
            disableValidation={disableValidation}
            disableWarn={disableWarn}
            enableValidation={enableValidation}
            enableWarn={enableWarn}
            onReCheckErrors={updateValidation}
        >
            {children}
        </ValidationInspector.ValidationInspector>
    );
}
