/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {ReactNode} from 'react';
import styleNames from '@vtb/services/style-names';
import {Scrollbar} from '@vtb/fe-ui-scrollbar';
import {InspectorProps, PageInspector} from './page-inspector';
import styles from './../letter-page.scss';

const sn = styleNames(styles);

export type ChildOnly = {
    children?: ReactNode;
    withInspector?: boolean; // eslint-disable-line react/no-unused-prop-types
}

export type InspectorPropsType = InspectorProps & ChildOnly;

export type PanelInspectorProps = InspectorPropsType;
export type PanelProps = PanelInspectorProps & ChildOnly;

function renderWithInspector({children, ...props}: PanelInspectorProps) {
    return (
        <div className={sn('wrap-tab-panel')}>
            <PageInspector {...props}>
                {children}
            </PageInspector>
        </div>
    );
}

function renderWithScroll({children}: ChildOnly) {
    return (
        <div className={sn('wrap-tab-panel')}>
            <Scrollbar height="auto">
                {children}
            </Scrollbar>
        </div>
    );
}

export function PagePanel(props: PanelProps) {
    if (props.withInspector) {
        return renderWithInspector(props);
    }

    return renderWithScroll(props);
}
