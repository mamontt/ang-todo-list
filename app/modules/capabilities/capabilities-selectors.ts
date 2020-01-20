/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {memoize, includes, isNil} from 'lodash';
import {createSelector} from 'reselect';
import {getDomain} from './../../store/root-selector';
import {EDIT} from './../../constants/document-action-capabilities';

export const CAPABILITIES_STORE_KEY = 'capabilities';

const DEFAULT_CAPABILITIES: Array<string> = [];
export const getDocumentCapabilities = memoize(
    (documentName: string) => getDomain([CAPABILITIES_STORE_KEY, documentName], DEFAULT_CAPABILITIES)
);

export const isViewModeForm = (documentIdSelector: (item: any) => number) => memoize((documentName: string) =>
    createSelector(
        documentIdSelector, getDocumentCapabilities(documentName),
        (documentId, capabilities) => (
            (!isNil(documentId)) && !includes(capabilities, EDIT)
        )
    ));
