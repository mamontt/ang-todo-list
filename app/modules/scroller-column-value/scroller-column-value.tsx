/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {identity, includes} from 'lodash';
import {STYLE} from '@vtb/ui-kit/scroller';
import {plainBlock, BEM} from '@vtb/services/bem-helper';
import styles from './scroller-column-value.scss';

type ValueFormatProps = {
    value: {
        valueStyle: string;
    } | string;
}

export const ScrollerColumnValue = plainBlock(
    'scroller-column-value',
    ({valueStyle}: {valueStyle: string}) => ({
        big: includes(valueStyle, STYLE.BIG),
        bold: includes(valueStyle, STYLE.BOLD),
        grey: includes(valueStyle, STYLE.GREY)
    }),
    {styles}
)(BEM.div());

export const formattedValue = (format = identity) => {
    const ValueFormat = ({value = '', ...rest}: ValueFormatProps) => (
        <ScrollerColumnValue {...rest}>
            {format(value)}
        </ScrollerColumnValue>
    );
    return ValueFormat;
};
