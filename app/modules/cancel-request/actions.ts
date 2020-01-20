/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {AnyAction, Dispatch} from 'redux';
import {callStream} from '@vtb/services/stream';

type DocumentInitialData = {
    cancelEdocCommonFields: {
        cancelEdocType: string;
        cancelEdocTypeId: number;
        cancelEdocNumber: string;
        cancelEdocDate: string;
        cancelEdocOrg: string;
        cancelEdocBranch: string;
        cancelEdocRefId: number;
        cancelEdocOrgId: number;
        docTypeId: number;
    },
    cancelEdocAdditionalFields: {
        letterType: {
            name: string;
        },
        topic: string;
        content: string;
    },
    cancelEdocRefId: number
}

export type recallActionType = {
    userRoleType: 'client' | 'bank';
    id: number | string;
    type: string;
    documentInitialData: DocumentInitialData;
    edocRefId: number;
    onClose?: () => void;
    onUpdate?: () => void;
    applicationName?: string;
}

export const recallAction = ({
    userRoleType,
    id,
    type,
    documentInitialData,
    edocRefId,
    onClose,
    onUpdate
}: recallActionType) => (dispatch: Dispatch<AnyAction>) => dispatch(callStream('cancel-requests/show-form', {
    userRoleType,
    id,
    type,
    documentInitialData,
    edocRefId,
    onClose,
    onUpdate
}));
