/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {createSelector} from 'reselect';
import {toPairs, reduce} from 'lodash';
import {getDomain} from './../../store/root-selector';
import {LOADER_STORE_KEY} from './loader-constants';

export const getLoaderVisibleNamespaces = createSelector(
    getDomain(LOADER_STORE_KEY),
    (state = {}) => reduce(
        toPairs(state),
        (acc, [key, v]) => (v ? [...acc, key] : acc),
        []
    )
);
