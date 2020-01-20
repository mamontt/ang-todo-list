/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {get, cloneDeep} from 'lodash';
import * as A from './actions';

type DefaultArgsType = {
    contentPath: string;
    initialState: Array<Object>;
}

const defaultArgs: DefaultArgsType = {contentPath: null, initialState: []};

export type DocumentStackProps = {
    quantity: number;
    docTypeId?: number;
    isProductMenu?: boolean;
    name?: string;
    stage?: string;
    isShowCase?: boolean;
}

type PropsType = {
    type: string;
    payload: {
        data: Array<DocumentStackProps>
    };
}

export default (namespace: string, initArgs = {}) => {
    const {initialState, contentPath} = {...defaultArgs, ...initArgs};
    return (state = initialState, {type, payload}: PropsType) => {
        switch (type) {
            case A.FETCH_DONE(namespace): {
                const {data} = payload;
                if (contentPath === null) {
                    return cloneDeep(data);
                }
                return cloneDeep(get(data, contentPath, state));
            }
            default:
                return state;
        }
    };
};
