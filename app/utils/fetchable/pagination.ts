/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {get} from 'lodash';
import {FetchAction} from '../../utils/fetchable/actions';
import * as A from './actions';

export type Pagination = {
    count: number;
    page: number;
    total: number;
}

const INITIAL_PAGINATION: Pagination = {page: 0, count: 10000, total: 0};
const CLEAR_PAGINATION = (namespace: string) => `@@fetchable/${namespace}/CLEAR_PAGINATION`;
export const clearPagination = (namespace: string) => ({type: CLEAR_PAGINATION(namespace)});

export default (namespace: string) =>
    (state: Pagination = INITIAL_PAGINATION, {type, payload, meta}: FetchAction): Pagination => {
        switch (type) {
            case A.FETCH_START(namespace): {
                // Set requested pagination number and size
                return {
                    ...state,
                    page: get(meta, 'apiArgs[0].page', state.page),
                    count: get(meta, 'apiArgs[0].count', state.count)
                };
            }
            case A.FETCH_DONE(namespace): {
                const {err, data} = payload;
                if (err) {
                    return state;
                }
                return {...state, total: get(data, 'total', 0)};
            }
            case CLEAR_PAGINATION(namespace): {
                return INITIAL_PAGINATION;
            }
            default:
                return state;
        }
    };
