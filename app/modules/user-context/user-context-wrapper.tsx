/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {connect} from 'react-redux';
import {memoize} from 'lodash';
import {tokenTypeSelector} from '@vtb/services/auth';
import {UserType} from './constants/user-types';
import {StoreType} from '../../store/root-selector';

export type UserContext = {
    type: UserType;
}

const userContext = memoize((tokenType: string) => ({
    tokenType,
    userContext: {
        type: tokenType
    }
}));

export const withUserContext = (WrappedComponent: any) =>
    connect((state: StoreType) => {
        const tokenType = tokenTypeSelector(state);
        return userContext(tokenType);
    }, {})(WrappedComponent);
