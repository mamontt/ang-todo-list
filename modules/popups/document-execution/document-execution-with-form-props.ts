/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {reduxForm} from 'redux-form';
import {DocumentExecutionForm} from './document-execution-form';
import {DOCUMENT_EXECUTION_FORM_NAME} from './actions';
import {documentExecutionValidation} from './document-execution-validation';

export const documentExecutionWithFormProps = (reduxFormProps: Object) =>
    reduxForm({
        validate: documentExecutionValidation,
        ...reduxFormProps,
        form: DOCUMENT_EXECUTION_FORM_NAME,
        enableReinitialize: true
    })(DocumentExecutionForm as any);
