/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2018 VTB Group. All rights reserved.
 */
// @flow
import {SHOW_CENTER} from '@vtb/fe-ui-dialog';
import {CreateCancellationDocModal} from './create-cancellation-doc-modal';

export const CREATE_CANCELLATION_DOC = 'CREATE_CANCELLATION_DOC';

export const createCancelRequestModal = {
    view: CREATE_CANCELLATION_DOC,
    type: SHOW_CENTER,
    component: CreateCancellationDocModal,
    closable: true
};
