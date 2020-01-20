/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2018 VTB Group. All rights reserved.
 */
import {memoize, isObject, isEmpty, isNil, get, omitBy} from 'lodash';
import {TagsItemProps} from '@vtb/fe-ui-table';
import {TEMPLATE_SCROLLER_FILTER_FORM} from '../constants';
import {FilterFieldType, OnFilterTagsType} from '../flow-types';
import {Branch, Client} from '../../../common-types';

export type FormType = {
    attributeComposition?: AttributeCompositionType;
    name?: string;
}

type FilterType = {
    topic?: string;
    ['clientResponsibleOfficer.name']?: string;
    ['branchSnapshot.fullName']?: string;
}

type AttributeCompositionType = {
    topic?: string;
    clientResponsibleOfficer?: string;
    name?: string;
    clients?: Client;
    branches?: Branch;
    clientId?: number;
    letterType?: {
        id?: number | string;
        name?: string;
    }
}

const formDefault = {
    attributeComposition: {}
};

export const buildFormName = (docTypeId: number) => `${TEMPLATE_SCROLLER_FILTER_FORM}-${docTypeId}`;
export const convertFormToFilterTemplate = (form: FormType = formDefault) => {
    const {attributeComposition = {}, name} = form;
    const {
        topic,
        clientResponsibleOfficer,
        branches = {},
        clients = {},
        letterType
    } = attributeComposition;
    const filterExtensionAttributes: FilterType = {};
    const isLetterExist = get(letterType, 'id', null);
    const newLetterType = isLetterExist ? {name: letterType.name, id: String(letterType.id)} : null;
    filterExtensionAttributes.topic = topic;
    filterExtensionAttributes['clientResponsibleOfficer.name'] = clientResponsibleOfficer;
    filterExtensionAttributes['branchSnapshot.shortName'] = get(branches, 'shortName', null);

    const attributeCompositionNew: AttributeCompositionType = {
        ...attributeComposition,
        letterType: newLetterType,
        topic: null,
        clients: null,
        branches: null,
        clientResponsibleOfficer: null
    };
    const omittedAttributeComposition = omitBy(attributeCompositionNew, isNil);
    const omittedFilterExtensionAttributes = omitBy(filterExtensionAttributes, isNil);
    const clientId = get(clients, 'id', null);

    return {
        name,
        clientId,
        filterExtensionAttributes: !isEmpty(omittedFilterExtensionAttributes)
            ? JSON.stringify(omittedFilterExtensionAttributes)
            : null,
        attributeComposition: !isEmpty(omittedAttributeComposition)
            ? JSON.stringify(omittedAttributeComposition)
            : null
    };
};

export const buildTranslate = memoize((filterFields: Array<FilterFieldType>) => filterFields.reduce(
    (currentValue, field) => ({
        ...currentValue,
        [field.name]: field.label
    }), {}
));

type TranslateType = {
    name?: string;
    [key: string]: string;
}

export const buildTagsFilter = memoize((
    form: FormType = {},
    translate: TranslateType = {},
    onFilterTags?: OnFilterTagsType
): Array<typeof TagsItemProps> => {
    return Object.keys(form.attributeComposition || {})
        .map(key => ({
            value: translate[`attributeComposition.${key}`] || key,
            fieldName: `attributeComposition.${key}`
        }))
        .concat([
            form.name && {
                value: translate.name || 'name',
                fieldName: 'name'
            }
        ])
        .filter(tag => {
            const fieldName = get(tag, 'fieldName');
            if (!fieldName) return false;

            const value = get(form, fieldName);
            if (onFilterTags && !onFilterTags(fieldName, value)) {
                return false;
            }

            return isObject(value) ? !isEmpty(value) : !isNil(value);
        });
});
