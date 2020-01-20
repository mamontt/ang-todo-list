/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {ALL, FAVORITE, TO_SIGN, TO_BE_SENT} from './../../../../modules/filters/document-status-filters/common';
import {EXECUTED, INCOMING, WERE_READ, CLIENT_IN_PROCESS, TROUBLED} from './../../../../modules/filters/document-status-filters/client';
import {mergeFilters} from './utils';

const formFilterEmptyStatuses = {
    statusCategory: ''
};

const filterIsNotFavourite = {
    isFavourite: false,
    statusCategory: 'TO_SIGN'
};

const filterIsFavourite = {
    isFavourite: true,
    statusCategory: 'TO_SIGN'
};

describe('utils mergeFilters', () => {
    it('tab ALL', () => {
        expect(mergeFilters({}, ALL.query)).toEqual({});
    });
    it('tab ALL with empty formFilter statuses', () => {
        expect(mergeFilters(formFilterEmptyStatuses, ALL.query)).toEqual({});
    });
    it('tab FAVORITE', () => {
        expect(mergeFilters({}, FAVORITE.query)).toEqual({isFavourite: true});
    });
    it('tab TO_SIGN', () => {
        expect(mergeFilters({}, TO_SIGN.query)).toEqual({statusCategory: TO_SIGN.query});
    });
    it('tab TO_BE_SENT', () => {
        expect(mergeFilters({}, TO_BE_SENT.query)).toEqual({statusCategory: TO_BE_SENT.query});
    });
    it('tab EXECUTED', () => {
        expect(mergeFilters({}, EXECUTED.query)).toEqual({statusCategory: EXECUTED.query});
    });
    it('tab INCOMING', () => {
        expect(mergeFilters({}, INCOMING.query)).toEqual({statusCategory: INCOMING.query});
    });
    it('tab WERE_READ', () => {
        expect(mergeFilters({}, WERE_READ.query)).toEqual({statusCategory: WERE_READ.query});
    });
    it('tab CLIENT_IN_PROCESS', () => {
        expect(mergeFilters({}, CLIENT_IN_PROCESS.query)).toEqual({statusCategory: CLIENT_IN_PROCESS.query});
    });
    it('tab TROUBLED', () => {
        expect(mergeFilters({}, TROUBLED.query)).toEqual({statusCategory: TROUBLED.query});
    });
    it('tab TO_SIGN and filter', () => {
        expect(mergeFilters(filterIsNotFavourite, TO_SIGN.query))
            .toEqual({statusCategory: TO_SIGN.query});
    });
    it('tab FAVORITE and filter', () => {
        expect(mergeFilters(filterIsFavourite, FAVORITE.query)).toEqual({isFavourite: true});
    });
    it('tab ALL and filter', () => {
        expect(mergeFilters(filterIsNotFavourite, ALL.query)).toEqual({});
    });
});
