/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {DOCUMENT_STATUS_FILTERS} from './../../modules/filters';
import {getCategoryNameByStatuses, filterActionsBarButtonsByFilterCategory} from './utils';
import {COPY, DELETE, SIGN} from './common/scroller-parts/action-bar/header-actions';

const onClickHandle = jest.fn();

describe('Scroller utils', () => {
    it('Get category name by statuses', () => {
        const statusFilters = [
            DOCUMENT_STATUS_FILTERS.ALL
        ];
        const statuses = 'ALL';
        const expectedData = 'filters.all';

        expect(getCategoryNameByStatuses(statusFilters, statuses)).toEqual(expectedData);
    });
    it('Filter actionBar buttons by filter category', () => {
        const buttons = {
            [COPY]: {
                id: COPY,
                title: 'Копировать',
                onClick: onClickHandle,
                icon: 'Copy',
                disabled: true
            },
            [SIGN]: {
                id: SIGN,
                title: 'На подпись',
                onClick: onClickHandle,
                icon: 'Sign',
                disabled: true
            },
            [DELETE]: {
                id: DELETE,
                title: 'Удалить',
                onClick: onClickHandle,
                icon: 'Delete',
                disabled: true
            }
        };

        const buttonsPerCategories = {
            'filters.all': [
                COPY,
                DELETE
            ]
        };
        const categoryName = 'filters.all';
        const performFiltering = true;

        const expectedButtons = [
            {
                id: COPY,
                title: 'Копировать',
                onClick: onClickHandle,
                icon: 'Copy',
                disabled: true
            },
            {
                id: DELETE,
                title: 'Удалить',
                onClick: onClickHandle,
                icon: 'Delete',
                disabled: true
            }
        ];
        expect(filterActionsBarButtonsByFilterCategory(
            buttons,
            buttonsPerCategories,
            categoryName,
            performFiltering
        )).toEqual(expectedButtons);
    });
});
