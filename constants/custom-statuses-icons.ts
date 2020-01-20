/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {Icons} from '@vtb/fe-ui-icon';
import {STATUSES} from './statuses';

export const CUSTOM_STATUSES_ICONS = {
    [STATUSES.SENDING]: {
        primary: Icons.Send
    },
    [STATUSES.IN_PROCESS]: {
        primary: Icons.Regenerate
    },
    [STATUSES.CHECKED_DETAILES_RECEIVING]: {
        primary: Icons.ToProcessing
    }
};
