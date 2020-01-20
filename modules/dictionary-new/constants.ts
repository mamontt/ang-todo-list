/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2018 VTB Group. All rights reserved.
 */
import {ROOT_NAMESPACE} from './../../constants/root-namspace';
import {modalNameWithRootNamespace} from './../../utils/modals';

export const DICTIONARY_MODAL_NAME = modalNameWithRootNamespace('dictionaries');
export const DICTIONARY_STORE_KEY = 'dictionary';
export const DICTIONARY_COMMON_SCROLLER = `${ROOT_NAMESPACE}/dictionary-common-scroller`;
export const DICTIONARY_INITIAL_PARAMS = {
    pagination: {
        page: 0,
        itemsPerPage: 50
    }
};
export const BRANCH_TYPES = {
    FILIAL_BRANCH: 'FILIAL_BRANCH',
    ADDITIONAL_OFFICE: 'ADDITIONAL_OFFICE',
    DEPARTMENT: 'DEPARTMENT'
};

export const DEFAULT_QUERY_FIELD = 'fullTextQuery';

export const DEFAULT_DATA_PATH = 'data';
