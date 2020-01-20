/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {find, get, isEmpty, mapKeys, toString, isArray} from 'lodash';
import {createSelector} from 'reselect';
import {ValidationInspector} from '@vtb/fe-bi-validation-inspector';
import {showValidationModal} from '../../../modules/validation';
import {fieldNames} from './../../../constants/field-names';
import {StoreType} from '../../../store/root-selector';
import {ValidationModalParams} from '../validation-modal/validation-popup';

export type ErrorOrWarning = {
    attribute: string;
    code: string;
    hint: string;
    message: string;
}

type ErrorObject = {
    [nameField: string]: Array<ErrorOrWarning>;
};

export type DocumentError = {
    type?: string;
    message?: string;
    errors?: ErrorObject;
    warnings?: ErrorObject;
}

export type ValidationInstance = {
    fieldName: string;
    type: string;
    code: string;
    message: string;
}

type ValidationCallbacks = {
    onSuccess: () => void;
    onDismiss: () => void;
    onContinue: () => void;
}

export type ValidationErrorsModalOptions = { onGoToCorrection?: () => void, onDismiss?: () => void };

const VALIDATION_TYPE = 'VALIDATION';

export const getValidationErrors = createSelector(
    (document: { errors: Array<DocumentError> }): Object => {
    // TODO [sf] 22-Jun-18 create workaround for situation with array of errors
        const errorData = isArray(document) ? get(document, '[0].errors', []) : get(document, 'errors', []);
        const mappedErrors: DocumentError = mapKeys(
            find(errorData, {type: VALIDATION_TYPE}),
            (val, key) => toString(key).replace(/\[\d+\]/g, '[%d]')
        );
        if (!isEmpty(mappedErrors)) {
            mappedErrors.errors = mapKeys(mappedErrors.errors, (val, key) => toString(key).replace(/:/g, '.'));
            mappedErrors.warnings = mapKeys(mappedErrors.warnings, (val, key) => toString(key).replace(/:/g, '.'));
        }
        return mappedErrors;
    }
    ,
    errors => errors
);

/**
 * Shows validation modal action creator (w/o onCorrection handler)
 * @param document - fetched document (after save/update)
 * @param namespace - document namespace
 * @param onGoToCorrection - on go to correction click
 * @param onDismiss - on validation modal dismissed
 */
export const showValidationErrors = (
    document: { errors: Array<DocumentError> },
    namespace: string,
    {onGoToCorrection, onDismiss}: ValidationErrorsModalOptions = {}
) => (dispatch: Function, getState: () => StoreType) => {
    const {visibility} = ValidationInspector.inspectorSelector(getState(), namespace);
    const validationError = getValidationErrors(document);
    if (!visibility && !isEmpty(validationError)) {
        dispatch(showValidationModal({
            ...validationError as ValidationModalParams,
            fieldsNames: fieldNames(),
            onDismiss,
            namespace,
            onGoToCorrection: () => {
                if (onGoToCorrection) dispatch(onGoToCorrection());
                dispatch(ValidationInspector.setVisibility(namespace, true));
            }
        }));
    } else if (onGoToCorrection) dispatch(onGoToCorrection());
};

export const handleCreateUpdateResponse = (
    document: { errors: Array<DocumentError> },
    config: ValidationCallbacks,
    namespace: string,
    isSidebar = true,
    closeModal
) => (dispatch: Function) => {
    const validationErrors: DocumentError = getValidationErrors(document);
    // Should go to scroller just in case of emptiness of validation errors
    if (!isSidebar) {
        if (isEmpty(validationErrors)) {
            dispatch(config.onSuccess());
        }
        closeModal();
    } else if (isEmpty(validationErrors)) {
        dispatch(ValidationInspector.setVisibility(namespace, false));
        dispatch(config.onSuccess());
    } else {
        // Should open validation modal in case of validation errors presented in response,
        // open form for editing on "Go to correction" button click
        // or go to scroller on validation modal close
        dispatch(ValidationInspector.setErrors(namespace, validationErrors.errors, validationErrors.warnings));

        dispatch(showValidationErrors(document, namespace, {
            onGoToCorrection: config.onContinue,
            onDismiss: config.onDismiss
        }));
    }
};
