/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2018 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {Fields} from '@vtb/fe-ui-input';
import {Label} from '@vtb/fe-ui-label';
import {Grid} from '@vtb/fe-ui-grid';
import {translate} from './../../../utils/translate';
import {OFFICIAL, UserContext} from './../../../modules/user-context';
import {TO_BANK, LetterDirection} from './../../../modules/define-letter-direction';
import {Text} from './../../../components/text';

type TopicAndContentProps = {
    letterDirection: LetterDirection;
    userContext: UserContext;
}

class OfficialField extends React.PureComponent {
    render() {
        return (
            <Grid.Row verticalAlign="start">
                <Grid.Col col={3}>
                    <Label text={translate('common.official')} />
                </Grid.Col>
                <Grid.Col col={8}>
                    {/* 010 */}
                    <Fields.TextInput
                        name="official.fio"
                        disabled
                    />
                </Grid.Col>
            </Grid.Row>
        );
    }
}

export const TopicAndContent = ({letterDirection, userContext}: TopicAndContentProps) => (
    <Grid.Grid>
        <Grid.Row margin={Grid.MARGIN.L}>
            <Text formHeader>{translate('common.letter')}</Text>
        </Grid.Row>
        <Grid.Row verticalAlign="start">
            <Grid.Col col={3}>
                <Label text={translate('common.subject')} forId="topic" />
            </Grid.Col>
            <Grid.Col col={8}>
                {/* 008 */}
                <Fields.TextInput
                    name="topic"
                    maxLength={120}
                    id="topic"
                />
            </Grid.Col>
        </Grid.Row>
        <Grid.Row vAlign={Grid.VERTICAL_ALIGN.TOP}>
            <Grid.Col col={3}>
                <Label text={translate('common.message')} forId="content" />
            </Grid.Col>
            <Grid.Col col={8}>
                {/* 009 */}
                <Fields.TextArea
                    name="content"
                    rows={6}
                    width="100%"
                    maxLength={2000}
                    id="content"
                    autoExpanded
                />
            </Grid.Col>
        </Grid.Row>
        {userContext.type === OFFICIAL && letterDirection === TO_BANK && <OfficialField />}
    </Grid.Grid>
);
