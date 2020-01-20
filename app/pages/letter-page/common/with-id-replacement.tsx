/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {Component, ComponentType} from 'react';
import {connect} from 'react-redux';
import {change} from 'redux-form';
import {LETTER_PAGE_NAME} from '../../../pages/letter-page/letter-page-constants';

type WithIdProps = {
    documentId?: number;
    dispatch: Function;
}

export function withIdReplacement(WrappedComponent: ComponentType<any>) {
    class WithId extends Component<WithIdProps> {
        state = {
            documentId: 0
        };
        // TODO: do redux action for change document id
        changeDocument = (documentId: number, toBank: string) => {
            this.setState({documentId});
            this.props.dispatch(change(LETTER_PAGE_NAME, 'id', documentId));
            this.props.dispatch(change(LETTER_PAGE_NAME, 'toBank', toBank));
        };

        render() {
            const documentId = this.state.documentId === null ? null : this.state.documentId || this.props.documentId;
            return (
                <WrappedComponent
                    {...this.props}
                    documentId={documentId}
                    onDocumentChange={this.changeDocument}
                />
            );
        }
    }

    return connect()(WithId);
}
