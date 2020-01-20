/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {EllipsisText} from '@vtb/fe-ui-truncate';

const fullStyle = {width: '100%'};

type EllipsisTextType = {
    children: string
}

export const FullEllipsisText = ({children}: EllipsisTextType) => (
    <span style={fullStyle}>
        <EllipsisText>{children}</EllipsisText>
    </span>
);
