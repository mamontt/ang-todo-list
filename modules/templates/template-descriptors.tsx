/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2018 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {get} from 'lodash';
import {Grid} from '@vtb/fe-ui-grid';
import {Fields} from '@vtb/fe-ui-input';
import {TEMPLATE_URL} from './../../api/letter';
import {translate} from './../../utils/translate';
import {LETTER_TYPE_CODE} from './../../constants/doc-types';
import {Text} from './../../components/text';
import {FullEllipsisText} from './../../components/full-ellipsis-text';
import {
    ClientsDictionaryModal,
    BranchesDictionaryModal,
    LetterTypesDictionaryModal
} from '../../modules/dictionary-new/dictionary-modal/dictionary-modal';
import {LETTER_TYPE_NAME, RECEIVER, RESPONSIBLE_OFFICER, SENDER, TOPIC} from './../../constants/form-naming';
import {Filter} from './filters';

import {DescriptorType, TemplateType} from './flow-types';
import {FilterViewProps} from '../../pages/letter-scroller/common/filter/container';

export const FilterView = (props: FilterViewProps) => (
    <Filter
        {...props}
    />
);

const getHeaderFilterField = (label: string) => ({
    customField: true,
    reduxField: () => (
        <Grid.Row margin={Grid.MARGIN.L}>
            <Text formHeader>{translate(label)}</Text>
        </Grid.Row>
    )
});

export const TEMPLATES_DESCRIPTORS: {
    [number: number]: DescriptorType,
} = {
    [LETTER_TYPE_CODE]: {
        url: `${TEMPLATE_URL}`,
        filterView: FilterView,
        columns: () => [
            {
                label: translate('template.name'),
                name: 'name',
                width: 180,
                stretch: true,
                sortable: true,
                selector: ({name}: {name: string}) => (
                    <FullEllipsisText>
                        {name}
                    </FullEllipsisText>
                ),
                visible: true
            },
            {
                label: translate('common.letterType'),
                name: 'letterType',
                width: 180,
                sortable: true,
                stretch: true,
                selector: ({attributeComposition}: TemplateType) => {
                    const parsedData = JSON.parse(attributeComposition);
                    if (get(parsedData, LETTER_TYPE_NAME)) {
                        return (
                            <FullEllipsisText>
                                {get(parsedData, LETTER_TYPE_NAME)}
                            </FullEllipsisText>
                        );
                    }
                    return null;
                },
                visible: true
            },
            {
                label: translate('common.subject'),
                name: 'subject',
                width: 180,
                sortable: true,
                selector: ({attributeComposition}: TemplateType) => {
                    const parsedData = JSON.parse(attributeComposition);
                    if (get(parsedData, TOPIC)) {
                        return (
                            <FullEllipsisText>
                                {get(parsedData, TOPIC)}
                            </FullEllipsisText>
                        );
                    }
                    return null;
                },
                visible: true
            },
            {
                label: translate('common.sender'),
                name: 'sender',
                width: 180,
                sortable: true,
                selector: ({attributeComposition}: TemplateType) => {
                    const parsedData = JSON.parse(attributeComposition);
                    if (get(parsedData, SENDER)) {
                        return (
                            <FullEllipsisText>
                                {get(parsedData, SENDER)}
                            </FullEllipsisText>
                        );
                    }
                    return null;
                },
                visible: true
            },
            {
                label: translate('common.responsibleOfficer'),
                name: 'responsibleOfficer',
                width: 180,
                sortable: true,
                selector: ({attributeComposition}: TemplateType) => {
                    const parsedData = JSON.parse(attributeComposition);
                    if (get(parsedData, RESPONSIBLE_OFFICER)) {
                        return (
                            <FullEllipsisText>
                                {get(parsedData, RESPONSIBLE_OFFICER)}
                            </FullEllipsisText>
                        );
                    }
                    return null;
                },
                visible: true
            },
            {
                label: translate('common.receiver'),
                name: 'receiver',
                width: 250,
                sortable: true,
                selector: ({attributeComposition}: TemplateType) => {
                    const parsedData = JSON.parse(attributeComposition);
                    if (get(parsedData, RECEIVER)) {
                        return (
                            <FullEllipsisText>
                                {get(parsedData, RECEIVER)}
                            </FullEllipsisText>
                        );
                    }
                    return null;
                },
                visible: true
            }
        ],
        filterFields: () => [
            {
                label: translate('template.name'),
                name: 'name',
                reduxField: Fields.TextInput
            },
            {
                label: translate('filters.form.fields.letterType.name'),
                name: 'attributeComposition.letterType',
                reduxField: LetterTypesDictionaryModal
            },
            {
                label: translate('filters.form.fields.topic'),
                name: 'attributeComposition.topic',
                reduxField: Fields.TextArea,
                props: {
                    rows: 3
                }
            },
            getHeaderFilterField('common.sender'),
            {
                label: translate('filters.form.fields.clientSnapshot.name'),
                name: 'attributeComposition.clients',
                reduxField: ClientsDictionaryModal
            },
            {
                label: translate('common.responsibleOfficer'),
                name: 'attributeComposition.clientResponsibleOfficer',
                reduxField: Fields.TextInput
            },
            getHeaderFilterField('common.receiver'),
            {
                label: translate('filters.form.fields.branchSnapshot.name'),
                name: 'attributeComposition.branches',
                reduxField: BranchesDictionaryModal
            }
        ]
    }
};
