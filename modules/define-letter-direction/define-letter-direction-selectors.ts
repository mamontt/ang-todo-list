/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {createSelector} from 'reselect';
import {split, includes} from 'lodash';
import {FROM_BANK, TO_BANK} from './define-letter-direction-constants';

type paramType = {
    location?: string,
    pathname?: string
}
type Router = {};
type State = { router: Router };
const getRouter = (state: State) => state.router;
const getLocation: any = createSelector(getRouter, ({location}: paramType) => location);

const getPathname = createSelector(getLocation, ({pathname}: paramType) => pathname);
const getParsedPathname = createSelector(getPathname, (pathname: string) => split(pathname, '/'));
export const getLetterDirection = createSelector(
    getParsedPathname,
    path => (includes(path, FROM_BANK) ? FROM_BANK : TO_BANK)
);
