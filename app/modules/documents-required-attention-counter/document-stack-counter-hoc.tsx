/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {isEmpty} from 'lodash';
import {connect} from 'react-redux';
import {callStream as callStreamAction} from '@vtb/services/stream';
import {fetchCounter} from '../../modules/documents-required-attention-counter/actions';
import {getDocumentStackCounter} from '../../modules/documents-required-attention-counter/selectors';
import {StoreType} from './../../store/root-selector';

type DocumentStackProps = {
    quantity: number;
    docTypeId?: number;
    isProductMenu?: boolean;
    name?: string;
    stage?: string;
}

type StackCounterProps = {
    fetchCounter: () => void;
    documentsStack: Array<DocumentStackProps>;
}

type itemType = {
    quantity: number;
}

export const withStackCounterContext = (WrappedComponent: any) => {
    class StackCounter extends React.Component<StackCounterProps> {
        componentDidMount() {
            this.props.fetchCounter();
        }

        render() {
            const {documentsStack} = this.props;
            const reducer = (acc: itemType, val: itemType) => ({quantity: acc.quantity + val.quantity});
            const count = !isEmpty(documentsStack) ? documentsStack.reduce(reducer) : {quantity: 0};
            return <WrappedComponent counter={count} {...this.props} />;
        }
    }
    return connect((state: StoreType) => ({
        documentsStack: getDocumentStackCounter(state)
    }), {
        fetchCounter,
        callStream: callStreamAction
    })(StackCounter);
};
