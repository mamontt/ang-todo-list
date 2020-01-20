/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2018 VTB Group. All rights reserved.
 */
import {ROOT_NAMESPACE} from './../../constants/root-namspace';
import * as FIELDS from './create-template/fields';

export const TEMPLATES_SCROLLER = `${ROOT_NAMESPACE}/templates-scroller`;
export const TEMPLATES_INITIAL_PARAMS = {
    pagination: {
        page: 0,
        itemsPerPage: 25
    }
};

export const TEMPLATE_SCROLLER_FILTER_FORM = 'templates-scroller-filter';

export const SAVE = 'save';
export const UPDATE = 'update';
export const RECOVER = 'recover';
export const SEARCH = 'search';
export const FORCE = 'force';
export const TEMPLATES_FORM_INITIAL_VALUES = {
    [FIELDS.name]: ''
};
export const TRUE = 'true';
export const FALSE = 'false';
