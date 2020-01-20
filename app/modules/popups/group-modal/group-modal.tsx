/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {GroupModal} from '@vtb/fe-bi-modals';
import {Loader} from '../../../modules/loader';

type GroupModalContainerType = {
    modalParams: {
        namespace: string
    }
}

export const GroupModalContainer = ({modalParams}: GroupModalContainerType) => (
    <Loader fetchNamespaces={[modalParams.namespace]}>
        <GroupModal {...modalParams} />
    </Loader>
);
