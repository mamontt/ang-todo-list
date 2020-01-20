/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import * as React from 'react';
import styleNames from '@vtb/services/style-names';
import styles from './styles.scss';

const sn = styleNames(styles);

export const Text = ({children, formHeader, formHeaderFilter}: {
    children: string,
    formHeader?: boolean,
    formHeaderFilter?: boolean
}) => {
    const className = sn(
        'text',
        {'text--form-header': formHeader},
        {'text--form-header-filter': formHeaderFilter}
    );

    return (
        <div className={className}>{children}</div>
    );
};
