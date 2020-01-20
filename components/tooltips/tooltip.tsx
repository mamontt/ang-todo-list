/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2018 VTB Group. All rights reserved.
 */
import {createTooltipHoc} from '@vtb/fe-ui-popover';

export const Tooltip = createTooltipHoc(({ children }: any) => children, {
    centered: true,
    style: {
        display: 'block'
    }
});

export const TooltipInline = createTooltipHoc(({ children }: any) => children, {
    centered: true,
    style: {
        display: 'inline'
    }
});

export const TooltipFollow = createTooltipHoc(({ children }: any) => children, {
    centered: true,
    followCursor: true,
    style: {
        display: 'block'
    }
});
