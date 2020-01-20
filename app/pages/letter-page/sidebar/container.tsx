/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {formSidebar} from './../../../modules/form-sidebar';
import {TO_BANK} from './../../../modules/define-letter-direction';
import {ResourceType} from './../../../modules/resource/resource';
import {
    LETTER_DOCUMENT_NAME,
    LETTER_PAGE_FETCH_NAMESPACE,
    LETTER_PAGE_NAME,
    LETTER_VALIDATION_NAMESPACE
} from '../letter-page-constants';
import {BeforeSaveTransducer} from '../../../modules/form-sidebar/form-sidebar-actions';

export function Container(letterDirection: string, resource: ResourceType) {
    return formSidebar({
        documentName: LETTER_DOCUMENT_NAME,
        fetchNamespace: LETTER_PAGE_FETCH_NAMESPACE,
        formName: LETTER_PAGE_NAME,
        validationNamespace: LETTER_VALIDATION_NAMESPACE,
        resource,
        capabilitiesSubResource: 'actions',
        beforeSaveTransducer: (values: BeforeSaveTransducer) => ({...values, toBank: letterDirection === TO_BANK})
    });
}
