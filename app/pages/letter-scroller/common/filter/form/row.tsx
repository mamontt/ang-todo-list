/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {ReactNode} from 'react';
import {Label} from '@vtb/fe-ui-label';
import {Grid, Flex} from '@vtb/fe-ui-grid';
import styleNames from '@vtb/services/style-names';
import {translate} from './../../../../../utils/translate';
import styles from './rowWrapper.scss';

const sn = styleNames(styles);

type PropsType = {
    text: string;
    children?: ReactNode;
    one?: ReactNode;
    two?: ReactNode;
}

// eslint-disable-next-line react/prop-types
export function Row({text, children}: PropsType) {
    return (
        <Grid.Row vAlign={Grid.VERTICAL_ALIGN.TOP}>
            <Grid.Col col={3}>
                <Label text={translate(text)} position="left" />
            </Grid.Col>
            <Grid.Col col={3}>
                {children}
            </Grid.Col>
        </Grid.Row>
    );
}

// eslint-disable-next-line react/prop-types
export function ThreeColumnsRow({text, one, two}: PropsType) {
    return (
        <Grid.Row vAlign={Grid.VERTICAL_ALIGN.TOP}>
            <Grid.Col col={3}>
                <Label text={translate(text)} position="left" />
            </Grid.Col>
            <Grid.Col col={9}>
                <Flex.Container>
                    {one}
                    <div className={sn('rowButtonCheckboxGroup')}>
                        {two}
                    </div>
                </Flex.Container>
            </Grid.Col>
        </Grid.Row>
    );
}
