/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {connect} from 'react-redux';
import {AnyAction, Dispatch} from 'redux';
import {isEqual, isEmpty, noop, get} from 'lodash';
import {ValidationInspector} from '@vtb/fe-bi-validation-inspector';
import {Letter} from '../../common-types';

export type DataTransformer = (document: Letter, documentId: number) => any;
type NotifyValidationErrorsOnLoadClass = {
    lastCheckResults: Letter;
    onLoadValidationErrors: (
        document: Letter,
        namespace: string,
        documentId: number,
        dataTransformer: DataTransformer
    ) => void;
    documentId: number;
}

const getValidation = (key: string, errors: {key: string}) => {
    const validation = get(errors, key, null);
    return isEmpty(validation) ? null : validation;
};

const onLoadValidationErrors = (
    document: Letter,
    namespace: string,
    documentId: number,
    dataTransformer: DataTransformer
) => (dispatch: Dispatch<AnyAction>) => {
    const validationError = dataTransformer(document, documentId);
    const errors = getValidation('errors', validationError);
    const warnings = getValidation('warnings', validationError);
    if (errors || warnings) {
        dispatch(ValidationInspector.setErrors(namespace, errors, warnings));
        dispatch(ValidationInspector.setVisibility(namespace, true));
    }
};

export const notifyValidationErrorsOnLoad = (
    namespace: string,
    checkResultDataTransformer: DataTransformer = noop
) => (WrappedComponent: any) => {
    class NotifyValidationErrorsOnLoad extends React.Component<NotifyValidationErrorsOnLoadClass> {
        static displayName = `WithOnLoadValidationDisplay(${WrappedComponent.displayName || WrappedComponent.name})`;

        componentDidMount() {
            this.props.onLoadValidationErrors(
                this.props.lastCheckResults,
                namespace,
                this.props.documentId,
                checkResultDataTransformer
            );
        }

        componentWillReceiveProps(nextProps: NotifyValidationErrorsOnLoadClass) {
            if (!isEqual(nextProps.lastCheckResults, this.props.lastCheckResults)) {
                this.props.onLoadValidationErrors(
                    nextProps.lastCheckResults,
                    namespace,
                    this.props.documentId,
                    checkResultDataTransformer
                );
            }
        }

        render() {
            return (<WrappedComponent {...this.props} />);
        }
    }
    return connect(null, {
        onLoadValidationErrors
    })(NotifyValidationErrorsOnLoad);
};
