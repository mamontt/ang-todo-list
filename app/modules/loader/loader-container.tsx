/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {ReactNode} from 'react';
import {connect} from 'react-redux';
import {intersection} from 'lodash';
import {Loader as Spinner} from '@vtb/fe-ui-loader';
import {StoreType} from './../../store/root-selector';
import {Loader, SpinnerContainer} from './loader';
import {getLoaderVisibleNamespaces} from './loader-selectors';

type Props = {
    children?: ReactNode,
    fetchNamespaces?: Array<string>,
    visibleNamespaces?: Array<string>,
    visible?: boolean
}

export const LoaderContainer = connect(
    (state: StoreType) => ({visibleNamespaces: getLoaderVisibleNamespaces(state)}), {}
)(
    ({
        children, fetchNamespaces = [], visibleNamespaces = [], visible
    }: Props) => (
        <Loader>
            <SpinnerContainer
                visible={visible || intersection(visibleNamespaces, fetchNamespaces).length > 0}
            >
                <Spinner.InContainer />
            </SpinnerContainer>
            {children}
        </Loader>
    )
);
