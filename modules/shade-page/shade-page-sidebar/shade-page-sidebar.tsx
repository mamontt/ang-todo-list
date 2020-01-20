/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {element, BEM} from '@vtb/services/bem-helper';
import styles from './shade-page-sidebar.scss';

type ShadePageSidebarButtonsGroupProps = {
    marginBetweenButtons: number;
    marginBottom: number;
    children: Array<JSX.Element>;
}

type ShadePageSidebarType = {
    className: string;
    children: Array<JSX.Element>;
}

const ShadePageSidebarContent = element('sidebar-content', {styles})(BEM.div());

export const ShadePageSidebar = element('sidebar', {styles})(({className, children}: ShadePageSidebarType) => (
    <div className={className}>
        <ShadePageSidebarContent>
            {children}
        </ShadePageSidebarContent>
    </div>
));

export function ShadePageSidebarButtonsGroup({
    marginBetweenButtons = null,
    marginBottom = null,
    children
}: ShadePageSidebarButtonsGroupProps) {
    const blockStyle = marginBottom && {marginBottom: `${marginBottom}px`};
    const btnStyle = marginBetweenButtons && {marginBottom: `${marginBetweenButtons}px`};
    return (
        <div style={blockStyle}>
            {React.Children.map(children, (btn: JSX.Element, idx: number) => {
                if (idx !== (React.Children.count(children) - 1)) {
                    return <div style={btnStyle}>{btn}</div>;
                }
                return <div>{btn}</div>;
            })}
        </div>
    );
}
