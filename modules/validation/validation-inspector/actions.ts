/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {getFormValues} from 'redux-form';
import {isEmpty} from 'lodash';
import {ValidationInspector} from '@vtb/fe-bi-validation-inspector';
import {doFetch, ApiMethod} from './../../../utils/fetchable';
import {fetchWithHandleResponse} from '../../../modules/resource/resource';
import {POST} from '../../../constants/request-types';
import {json} from '../../../modules/resource/interceptors';
import {DocumentError, getValidationErrors} from '../../../modules/validation/utils/common';
import {StoreType} from '../../../store/root-selector';

type UpdateValidationType = {
    formName: string;
    namespace: string;
    endpoint: string;
}

export const updateValidation = (
    {formName, namespace, endpoint}: UpdateValidationType
) => (dispatch: Function, getState: () => StoreType) => () => {
    const document: {id?: number} = getFormValues(formName)(getState());

    const updateResource = (urlParam: string, data = {}) => (
        fetchWithHandleResponse({
            url: endpoint,
            ...json({
                method: POST,
                data
            })
        })
    );

    const fetchUpdate = () => fetchRevalidate(
        updateResource,
        document.id,
        document
    );

    function fetchRevalidate(fetchFunction: ApiMethod, ...args: Array<Object>) {
        dispatch(doFetch(namespace)(fetchFunction, ...args)).then(({result}: {result: any}) => {
            const validationErrors: DocumentError = getValidationErrors(result);
            const {errors, warnings} = validationErrors;
            if (isEmpty(validationErrors)) {
                dispatch(ValidationInspector.setVisibility(formName, false));
            } else {
                dispatch(ValidationInspector.setErrors(formName, errors, warnings));
            }
        });
    }

    dispatch(fetchUpdate());
};

