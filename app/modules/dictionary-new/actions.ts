/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2018 VTB Group. All rights reserved.
 */
import {AnyAction, Dispatch} from 'redux';
import {isEmpty} from 'lodash';
import {actionCreator} from '@vtb/services/redux-actions';
import {showModal} from '@vtb/fe-ui-dialog';
import {addNotification} from '@vtb/fe-ui-alert';
import {ROOT_NAMESPACE} from './../../constants/root-namspace';
import {GET} from '../../constants/request-types';
import {ResponseType} from './../../api/flow-types';
import {fetchDictionary} from './dictionary';
import {getDictionary} from './selectors';
import {DICTIONARY_MODAL_NAME} from './constants';
import {NOTIFICATION_LOAD_FAILURE} from './notifications';
import {DictionaryNameType} from './flow-types';
import {StoreType} from '../../store/root-selector';

export type DictionaryOptions = {};

const dictionaryActionCreator = actionCreator(ROOT_NAMESPACE);
export const loadDictionary = dictionaryActionCreator('fetch-dictionary');

const defaultFetchParams = {
    method: GET,
    params: {
        page: 0,
        size: 10000
    }
};

export type PutDictionaryToStoreType = {
    name: DictionaryNameType;
    fetchParams: {
        method?: string;
        queryParams?: {
            locale?: string;
            branchId?: number;
            size?: number;
            sort?: string;
        },
        params?: {
            page?: number;
            size?: number;
        }
    },
    pathAdapter?: () => string;
    mounting?: boolean;
    force?: boolean;
    refetch?: boolean;
}

export const putDictionaryToStore = ({
    name,
    fetchParams = {},
    pathAdapter,
    force,
    refetch
}: PutDictionaryToStoreType) => (
    dispatch: Dispatch<AnyAction>,
    getState: () => StoreType
): Promise<ResponseType | void> =>
    ((isEmpty(getDictionary(name, force)(getState())) || force || refetch)
        ? fetchDictionary({
            name,
            fetchParams: isEmpty(fetchParams.params) ? defaultFetchParams : fetchParams,
            pathAdapter
        })
            .then(response => {
                return dispatch(loadDictionary({
                    dictionary: response,
                    meta: {
                        name,
                        force
                    }
                }));
            })
            .catch(() => (
                dispatch(addNotification(NOTIFICATION_LOAD_FAILURE()))
            ))
        : Promise.resolve());

export const showDictionary = (name: string, options: DictionaryOptions, customModal?: string) =>
    showModal(customModal || DICTIONARY_MODAL_NAME, {
        name,
        ...options
    });
