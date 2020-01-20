/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {OFFICIAL, UserContext} from './../../modules/user-context';
import {translate} from '../../utils/translate';

export const DOCUMENT_ID_PARAM = 'documentId';
const NEW_DOCUMENT_PATH_SUFFIX = 'new';

export const makePath = (basePath: string) => ({
    toScroller: basePath,
    toNewDocument: `${basePath}/${NEW_DOCUMENT_PATH_SUFFIX}`,
    toEditDocument: `${basePath}/:${DOCUMENT_ID_PARAM}`
});

export const makeTitle = (userContext: UserContext, path: string) => {
    if (userContext.type === OFFICIAL) {
        return path.includes('from-bank')
            ? translate('official-from-bank')
            : translate('official-to-bank');
    }

    return path.includes('from-bank')
        ? translate('employee-from-bank')
        : translate('employee-to-bank');
};
