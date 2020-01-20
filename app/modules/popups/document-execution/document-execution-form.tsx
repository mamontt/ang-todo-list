/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {ModalLayout} from '@vtb/fe-ui-grid';
import {Fields} from '@vtb/fe-ui-input';
import {Label} from '@vtb/fe-ui-label';
import {Button} from '@vtb/fe-ui-button';
import styleNames from '@vtb/services/style-names';
import {formatDateToDDMMYYYY} from '@vtb/services/l10n';
import {fromDatePickerToISO8601} from './../../../utils/date-formatter';
import {translate} from './../../../utils/translate';
import styles from './document-execution.scss';

type DocumentExecutionFormProps = {
    handleSubmit: Function,
    onSubmit: Function,
    onClose: Function,
    className: string,
    submitting: boolean,
    valid: boolean
}

const sn = styleNames(styles);

export class DocumentExecutionForm extends React.Component<DocumentExecutionFormProps> {
    getFooter = (
        <div className={sn('execution-form__footer')}>
            <Button.Light onClick={this.props.onClose}>{translate('buttons.cancel')}</Button.Light>
            <Button.Submit
                disabled={this.props.submitting || !this.props.valid}
            >
                {translate('actions.do.sign')}
            </Button.Submit>
        </div>
    );

    getContent = (
        <div className={sn('execution-form__content')}>
            <div className={sn('execution-form__form-content')}>
                <div className={sn('execution-form__partial-ucn')}>
                    <Label text={translate('modals.contractNumber')}>
                        <Fields.MaskedInput
                            name="registrationDataPart1"
                            mask="11111111"
                            width={104}
                        />
                        <Fields.MaskedInput
                            name="complexPart"
                            mask="/ 1111 / 1111 / 1 / 1"
                            width={134}
                            disabled
                        />
                    </Label>
                </div>
                <div className={sn('execution-form__partial-date')}>
                    <Label text={translate('modals.acceptanceDate')} alignMiddle>
                        <Fields.DatePicker
                            name="acceptanceDate"
                            format={formatDateToDDMMYYYY}
                            parse={fromDatePickerToISO8601}
                        />
                    </Label>
                </div>
            </div>
        </div>
    );

    render() {
        const {
            handleSubmit, onSubmit, onClose, className
        } = this.props;
        return (
            <form onSubmit={handleSubmit(onSubmit)} name={className}>
                <ModalLayout.ModalLayout
                    size="small"
                    title={translate('modals.specifyContractNumber')}
                    onClose={onClose}
                    content={this.getContent}
                    footer={this.getFooter}
                />
            </form>
        );
    }
}

