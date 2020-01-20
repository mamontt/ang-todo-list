/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {keys} from 'lodash';
import {resource} from '../../modules/resource';
import * as ResourceMethods from '../../constants/request-types';
import {fetchData} from './../../utils/fetchable';
import {DOCUMENTS_STACK_COUNTER} from './../../api/urls';
import {DOCUMENT_STACK_COUNT_STORE_KEY} from '../../modules/documents-required-attention-counter/constants';
import {ResourceType} from '../resource';

export const fetchCounter = () => {
    const res: ResourceType = resource(DOCUMENTS_STACK_COUNTER, keys(ResourceMethods));
    return fetchData(
        DOCUMENT_STACK_COUNT_STORE_KEY
    )(res.get);
};
