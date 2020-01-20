/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {modalNameWithRootNamespace} from './../../../../utils/modals';
import {doFetch} from './../../../../utils/fetchable';
import {ResourceType} from './../../../../modules/resource/resource';

export const FORM_WITH_COMMENT = modalNameWithRootNamespace('form-with-comment');

export const doActionOnSubmit = (
    namespace: string,
    resource: ResourceType,
    id: number,
    actionName: string,
    data: string,
    after: (result?: Array<Object>) => void
) => doFetch(namespace, {after})(resource.action, id, actionName, data);

export const doActionWithoutRequestOnSubmit = (after: (result?: any) => any) => after();
