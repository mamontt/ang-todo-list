/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {showModal} from '@vtb/fe-ui-dialog';
import {modalNameWithRootNamespace} from './../../../utils/modals';
import {doFetch} from './../../../utils/fetchable';
import {EXECUTE} from './../../../constants/document-actions';
import {ResourceType} from './../../../modules/resource/resource';

export const DOCUMENT_EXECUTION_FORM_NAME = modalNameWithRootNamespace('document-execution');
export const doActionOnSubmit = (
    namespace: string,
    resource: ResourceType,
    id: number,
    actionName: string,
    data: string,
    after: (result?:any)=>void
) => doFetch(namespace, {after})(resource.action, id, actionName, data);

export const showExecutionModal = (
    namespace: string,
    resource: string,
    id: number,
    afterSubmit: (result?:any)=>void,
    {reduxFormProps = {}} = {}
) => showModal(DOCUMENT_EXECUTION_FORM_NAME, {
    namespace,
    resource,
    id,
    afterSubmit,
    reduxFormProps,
    documentActionName: EXECUTE
});
