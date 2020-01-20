/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {noop} from 'lodash';
import {connect} from 'react-redux';
import {closeModal} from '@vtb/fe-ui-dialog';
import {ValidationInspectorElement as ValidationInspector, ValidationInspector as InspectorModule} from '@vtb/fe-bi-validation-inspector';
import {translate} from './../../../utils/translate';
import {StoreType} from '../../../store/root-selector';

type ErrorObject = {
    [nameField: string]: Array<Error>;
};

export type ValidationModalParams = {
    errors?: ErrorObject;
    warnings?: ErrorObject;
    fieldsNames: {
        [field: string]: string;
    };
    onGoToCorrection: () => void;
    onDismiss: () => void;
    namespace: string;
}
type Props = {
    closeModal: () => void;
    validationItems?: Array<ErrorObject>;
    modalParams: ValidationModalParams;
}

class ValidationPopupClass extends React.Component<Props> {
    onGoToCorrection = () => {
        const {modalParams: {onGoToCorrection = noop} = {}} = this.props;
        this.props.closeModal();
        onGoToCorrection();
    };

    onDismiss = () => {
        const {modalParams: {onDismiss = noop} = {}} = this.props;
        this.props.closeModal();
        onDismiss();
    };

    render() {
        const {modalParams: {fieldsNames = {}} = {}, validationItems} = this.props;
        const modalParams = {
            items: validationItems,
            onNext: this.onGoToCorrection,
            onDismiss: () => {
                this.onGoToCorrection();
            },
            fieldsNames
        };

        return (
            <ValidationInspector.Modal
                modalParams={modalParams}
                closeModal={noop}
                button={
                    {
                        name: translate('actions.do.save-and-close'),
                        onClick: this.onDismiss
                    }
                }
            />
        );
    }
}

export const ValidationPopup = connect((state: StoreType, props: Props) =>
    ({ ...InspectorModule.inspectorSelector(state, props.modalParams.namespace)}),
{closeModal})(ValidationPopupClass);
