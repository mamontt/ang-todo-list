/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import fetchableReducer from './../../utils/fetchable';
import {DOCUMENT_STACK_COUNT_STORE_KEY} from '../../modules/documents-required-attention-counter/constants';

export const documentStackReducer = fetchableReducer(DOCUMENT_STACK_COUNT_STORE_KEY);
