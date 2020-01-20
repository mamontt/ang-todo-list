/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {isNil} from 'lodash';
import {onChange} from './on-change';

type FetchType = (id: number, letterDirection: string) => void;
type ClearType = () => {type: string};
type FormFetchAndClearProps = {
    clear: ClearType;
}

type onChangeType = {
    documentId: number;
    fetch: FetchType;
    letterDirection: string;
}

export const formFetchAndClear = (
    fetch: FetchType,
    clear: ClearType
) => (WrappedComponent: any) => {
    class FormFetchAndClear extends React.Component <FormFetchAndClearProps> {
        static displayName = `WithFormFetchAndClear(${WrappedComponent.displayName || WrappedComponent.name})`;

        componentWillUnmount() {
            this.props.clear();
        }

        render() {
            return (<WrappedComponent {...this.props} />);
        }
    }

    return compose(
        connect(null, {fetch, clear}),
        onChange('documentId', ({
            documentId: id,
            fetch: fetchData,
            letterDirection
        }: onChangeType) => !isNil(id) && !Number.isNaN(id) && fetchData(id, letterDirection)),
    )(FormFetchAndClear);
};
