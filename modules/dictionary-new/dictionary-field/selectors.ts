/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2018 VTB Group. All rights reserved.
 */
import {createSelector} from 'reselect';
import {get} from 'lodash';
import {DICTIONARY_DESCRIPTORS} from '../dictionary-descriptors';

export const getFormattedSelectItems = () => createSelector(

    ({value, items = value}: any) => items,
    ({dictionaryName}) => dictionaryName,
    ({fieldToDisplay}) => fieldToDisplay,
    ({showDescription}) => showDescription,
    (
        itemsOrValue = [],
        dictionaryName,
        fieldToDisplay,
        showDescription
    ) => [].concat(itemsOrValue).map((obj: {id: number}) =>
        ({

            value: get(obj, <any>get(DICTIONARY_DESCRIPTORS, `${dictionaryName}.rowIdFieldName`, 'id')),
            title: `${get(obj, fieldToDisplay || get(DICTIONARY_DESCRIPTORS, `${dictionaryName}.fieldToDisplay`), obj.id)}`,
            ...showDescription
                ? {valueText: `${get(obj, showDescription, showDescription)}`}
                : {}
        }))
);

export const getIdField: any = () => createSelector(
    ({dictionaryName}) => dictionaryName,
    dictionaryName => get(DICTIONARY_DESCRIPTORS, `${dictionaryName}.rowIdFieldName`, 'id')
);
