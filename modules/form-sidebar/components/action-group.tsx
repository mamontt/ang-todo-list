/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {omit} from 'lodash';
import {ShadePageSidebarButtonsGroup} from '../../../modules/shade-page';
import {ActionButton} from './action-button';
import {Descriptor} from './flow-types';

const renderActionButton = (descriptor: Descriptor, key: number) => (
    <ActionButton
        key={key}
        {...omit(
            descriptor,
            'group', 'actionCreator', 'capability'
        )}
    />
);

type ActionGroupType = {
    id: number | string | null,
    actions: Array<Descriptor>,
    activeButtons?: {[Keys: string]: boolean}
}

// eslint-disable-next-line react/prop-types
export function ActionGroup({id, actions}: ActionGroupType) {
    return (
        <ShadePageSidebarButtonsGroup marginBetweenButtons={8} marginBottom={24} key={id}>
            {actions.map(renderActionButton)}
        </ShadePageSidebarButtonsGroup>
    );
}
