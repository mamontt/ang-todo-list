/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {FormEvent, LegacyRef} from 'react';
import {Fields} from '@vtb/fe-ui-input';
import {Grid} from '@vtb/fe-ui-grid';
import {TooltipFollow} from './../../../../../components/tooltips';
import {Text} from './../../../../../components/text';
import {translate} from './../../../../../utils/translate';
import {
    BranchesDictionaryModal,
    ClientsDictionaryModal,
    LetterTypesDictionaryModal,
    ClientOfficialsDictionaryModal
} from './../../../../../modules/dictionary-new/dictionary-modal/dictionary-modal';
import {Row, ThreeColumnsRow} from './row';
import {SavedFilters} from './saved-filters';
import {LetterDirection} from '../../../../../modules/define-letter-direction';
import {EMPLOYEE, UserType} from '../../../../../modules/user-context';

function getPeriods() {
    function Item(key: string) {
        return {
            value: key,
            label: translate(`filters.form.periods.${key}`)
        };
    }

    return ['day', 'week', 'month'].map(Item);
}

type StatusItemsType = {
   [item: string]: number
}

function getItems(statusItems: StatusItemsType) {
    return Object.keys(statusItems).map((item: string) => ({
        title: translate(`statuses.${item}`),
        value: statusItems[item],
        disabled: false
    }));
}

// eslint-disable-next-line react/prop-types
export function FilterForm(
    statusItems: StatusItemsType,
    formCounterparts: {
        branch: string,
        client: string
    },
    letterDirection: LetterDirection,
    userContext: UserType,
    {handleSubmit, withRef}: {
        handleSubmit: (event: FormEvent<HTMLFormElement>) => void,
        withRef: LegacyRef<HTMLFormElement>
    }
) {
    return (
        <form onSubmit={handleSubmit} ref={withRef}>
            <Grid.Grid>
                <SavedFilters />
                <Grid.Separator sticky margin={Grid.MARGIN.L} />
                <ThreeColumnsRow
                    text="filters.form.fields.createDate"
                    one={<Fields.DateRange name="period" width="506px" allowHalfRange />}
                    two={<Fields.ButtonCheckboxGroup name="preset" width="300px" items={getPeriods()} />}
                />
                <Row text="filters.form.fields.documentNumber" >
                    <Fields.TextInput name="number" width="300px" />
                </Row>
                <Row text="filters.form.status" >

                    <Fields.MultiSelect name="statuses" items={getItems(statusItems)} />
                </Row>
                <Row text="filters.form.fields.letterType.name" >
                    <TooltipFollow tooltip={translate('filters.form.tooltip.letterType')}>
                        <LetterTypesDictionaryModal name="dsfTypeId" letterDirection={letterDirection} />
                    </TooltipFollow>
                </Row>
                <Row text="filters.form.topic" >
                    <TooltipFollow tooltip={translate('filters.form.tooltip.topic')}>
                        <Fields.TextInput name="topic" />
                    </TooltipFollow>
                </Row>
                <Row text="filters.form.text" >
                    <TooltipFollow tooltip={translate('filters.form.tooltip.text')}>
                        <Fields.TextInput name="body" />
                    </TooltipFollow>
                </Row>
                {userContext === EMPLOYEE && (
                    <Row text="filters.in_favorite" >
                        <Fields.SmallToggle name="isFavourite" />
                    </Row>
                )}
                <Row text="filters.attachments" >
                    <TooltipFollow tooltip={translate('filters.form.tooltip.attachments')}>
                        <Fields.SmallToggle name="hasAttachments" />
                    </TooltipFollow>
                </Row>
                <Text formHeaderFilter>{translate(formCounterparts.client)}</Text>
                <Row text="filters.form.fields.clientSnapshot" >
                    <TooltipFollow tooltip={translate('filters.form.tooltip.clientSnapshot')}>
                        <ClientsDictionaryModal name="clientId" />
                    </TooltipFollow>
                </Row>
                <Row text="filters.form.fields.clientResponsibleOfficer.name" >
                    <TooltipFollow tooltip={translate('filters.form.tooltip.clientResponsibleOfficer')}>
                        <ClientOfficialsDictionaryModal name="clientOfficerId" />
                    </TooltipFollow>
                </Row>
                <Row text="filters.form.fields.clientPhone" >
                    <TooltipFollow tooltip={translate('filters.form.tooltip.clientPhone')}>
                        <Fields.Phone name="phone" />
                    </TooltipFollow>
                </Row>
                <Text formHeaderFilter>{translate(formCounterparts.branch)}</Text>
                <Row text="filters.form.fields.branchSnapshot" >
                    <TooltipFollow tooltip={translate('filters.form.tooltip.branchSnapshot')}>
                        <BranchesDictionaryModal name="branchId" />
                    </TooltipFollow>
                </Row>
            </Grid.Grid>
        </form>
    );
}
