/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {get} from 'lodash';
import {createSelector} from 'reselect';
import {rootSelector} from './../../store/root-selector';
import {DOCUMENT_STACK_COUNT_STORE_KEY} from '../../modules/documents-required-attention-counter/constants';

export const getDocumentStackCounter = createSelector(
    rootSelector,
    rootState => get(rootState, DOCUMENT_STACK_COUNT_STORE_KEY, {})
);
