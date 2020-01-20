/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2018 VTB Group. All rights reserved.
 */
export const searcherFields = [
    {
        field: 'id',
        additionalField: 'shortName',
        title: 'search.id',
        id: 'id'
    },
    {
        field: 'inn',
        additionalField: 'shortName',
        title: 'search.inn',
        id: 'id'
    },
    {
        field: 'shortName',
        additionalField: '',
        title: 'search.shortName',
        id: 'id'
    },
    {
        field: 'ogrn',
        additionalField: 'shortName',
        title: 'search.bill',
        id: 'id'
    }
];

export const searcherGroups = [
    {
        field: 'id',
        additionalField: 'name',
        title: 'search.groups',
        id: 'id'
    }
];
