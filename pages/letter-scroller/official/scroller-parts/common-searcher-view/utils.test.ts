/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
/* eslint-disable import/first */
jest.mock('./../../../../../utils/translate');

import {translate} from './../../../../../utils/translate';
import {searcherDataFormatter} from './utils';

translate.mockImplementation((str: string): string => str.replace(/\./g, ' '));

describe('Searcher data formatter', () => {
    const fields = [
        {
            field: 'id',
            additionalField: 'shortName',
            title: 'search.id',
            id: 'id'
        }
    ];
    const items = [
        {
            id: 1,
            inn: '7728029110',
            shortName: 'АО "Торговый дом "ПЕРЕКРЕСТОК"',
            fullName: 'Акционерное общество "Торговый дом "ПЕРЕКРЕСТОК"'
        },
        {
            id: 2,
            inn: '4028034110',
            shortName: 'ООО "Бизнес Тренд"',
            fullName: 'Общество с ограниченной ответственностью  "Бизнес Тренд"'
        }
    ];

    test('Format data for searcher', () => {
        const expectedData = [
            {
                value: 'id',
                title: 'search id',
                searchItems: [
                    {
                        id: 1,
                        value: '1',
                        title: '1',
                        valueText: 'АО "Торговый дом "ПЕРЕКРЕСТОК"'
                    },
                    {
                        id: 2,
                        value: '2',
                        title: '2',
                        valueText: 'ООО "Бизнес Тренд"'
                    }
                ]
            }
        ];

        expect(searcherDataFormatter(fields, items)[0].searchItems).toEqual(expectedData[0].searchItems);
    });
});
