/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2018 VTB Group. All rights reserved.
 */
// @flow

import React from 'react';
import styleNames from '@vtb/services/style-names';
import styles from './footer.scss';

const sn = styleNames(styles);

type Props = {
    leftPanel?: boolean | any,
    rightPanel?: boolean | any
};

export const Footer = (props: Props) => {
    const {leftPanel, rightPanel} = props;

    return (
        <div className={sn('footer')} >
            <div>
                {leftPanel}
            </div>
            <div>
                {rightPanel}
            </div>
        </div>
    );
};
