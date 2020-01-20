/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {memoizeLast} from '@vtb/services/utils';
import {translate} from './../../../../../utils/translate';
import {ClientType} from './../../../../../modules/dictionary-new';

type SearchItem = {
    title: string;
    value: string;
    valueText: string;
}

export type SearcherField = {
    field: string;
    additionalField: string;
    title: string;
    id: string;
}

type SearcherData = {
    value: string;
    title: string;
    searchItems: Array<SearchItem>;
}

const searcherItemsFormatter = (items: Array<ClientType>, field: SearcherField) =>
    items.reduce((acc: Array<SearchItem>, current: ClientType) => (
        [
            ...acc,
            {
                value: String(current[field.id]),
                title: String(current[field.field]),
                valueText: current[field.additionalField],
                id: current[field.id]
            }
        ]
    ), []);

const searchFormatter = (clients: Array<ClientType>, {field}: SearcherField, text: string) => new Promise((resolve) => {
    const partSearch = clients.filter((client) => {
        const clientString = String(client[field]).toLowerCase();
        return clientString.indexOf(text.toLowerCase()) > -1;
    });
    const getFullSearch = () => clients.filter((client) => String(client.id) === text);
    const data = partSearch.length ? partSearch : getFullSearch();
    return resolve({data});
});

const fieldsMapFormatter = ({data = []}: {data: Array<{inn: string, shortName: string}>}, {field}: SearcherField) =>
    data.map((client: {[key: string]: string}) => {
        return {value: client.id, title: client[field] || '-', valueText: client.shortName || client.name};
    });

const getSearchFields = ({field, title}: SearcherField) => ({
    value: field,
    title: translate(title) || ''
});

export const searcherDataFormatter = memoizeLast(
    (fields: Array<SearcherField>, clients: Array<ClientType>) =>
        fields.reduce((acc: Array<SearcherData>, field: SearcherField) => (
            [
                ...acc,
                {
                    ...getSearchFields(field),
                    searchItems: searcherItemsFormatter(clients, field),
                    search: (text: string) => searchFormatter(clients, field, text),
                    fieldsMap: (data: any) => fieldsMapFormatter(data, field)
                }
            ]
        ), [])
);
