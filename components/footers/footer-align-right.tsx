/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2018 VTB Group. All rights reserved.
 */
import * as React from 'react';
import styleNames from '@vtb/services/style-names';
import {Button} from '@vtb/fe-ui-button';
import {translate} from './../../utils/translate';
import styles from './footer-view.scss';
import {FooterViewType} from './flow-types';

const sn = styleNames(styles);

export const FooterAlignRight = ({submitButton, cancelButton}: FooterViewType) => (
    <div className={sn('footer footer__align-right')}>
        {
            cancelButton &&
            <Button.Light onClick={cancelButton.onClick} disabled={cancelButton.disabled}>
                {translate(cancelButton.title)}
            </Button.Light>
        }
        <Button.Submit onClick={submitButton.onClick} disabled={submitButton.disabled}>
            {translate(submitButton.title)}
        </Button.Submit>
    </div>
);
