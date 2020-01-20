/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2018 VTB Group. All rights reserved.
 */
import {isEmpty} from 'lodash';
import {translate} from './../../../utils/translate';
import {FormModalTemplateType} from '../flow-types';
import {TRUE} from '../constants';

const isUpdateTemplate = (update: string) => update === TRUE;

type ValidateParams = {
    name: string;
    update: string;
}

export const validate = ({name, update}: ValidateParams, props: FormModalTemplateType) => {
    const errors: {name: string} = {name: ''};

    if (isEmpty(name) && !isUpdateTemplate(update)) {
        errors.name = translate(props.modalParams.validateMessage
            ? props.modalParams.validateMessage
            : 'template.empty-error-message');
    }

    return errors;
};

export const updateValidate = ({name}: ValidateParams, props: FormModalTemplateType) => {
    const errors: {name: string} = {name: ''};
    if (isEmpty(name) || props.initialValues.name === name) {
        errors.name = translate('template.empty-error-message');
    }
    return errors;
};
