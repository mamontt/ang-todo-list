/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2018 VTB Group. All rights reserved.
 */
import React, {PureComponent, Fragment} from 'react';
import {connect} from 'react-redux';
import {change} from 'redux-form';
import {translate} from '@vtb/services/i18n';
import {noop} from 'lodash';
import {Fields} from '@vtb/fe-ui-input';
import {ModalLayout} from '@vtb/fe-ui-grid';
import {Button} from '@vtb/fe-ui-button';
import {showModal, closeModal} from '@vtb/fe-ui-dialog';
import {DictionaryModalName} from '@vtb/fe-bi-dictionary';
import dictionary from '../../dictionary.json';
import {Footer} from './footer';

const i18n = translate.ui(dictionary);

type Reason = {
    id: number,
    reason: string
};
type CreateCancellationDocModalContentProps = {
    buttonsAreDisabled: boolean;
    isLoading?: boolean;
    multipleDocs: boolean;
    onChangeReason: (value?: string) => void;
    onClose: (event: any) => void;
    onSave: (event: any) => void;
    formName: string,
    showModal: Function,
    change: Function,
    clientId?: number,
    docTypeId?: number,
    close: () => void
}

export class CreateCancellationDocModalContentUI extends PureComponent<CreateCancellationDocModalContentProps> {
    static defaultProps = {
        showModal: noop,
        change: noop,
        closeModal: noop
    };

    onChange = (data: Reason) => {
        const {formName} = this.props;
        this.props.change(formName, 'reason', data.reason);
    };

    onClose = () => {
        const {close} = this.props;
        close();
        close();
    };

    normalizeInput = (value: string) => value.replace(/^\s+/, '');

    showCancelReqReasonModal = () => {
        this.props.showModal(DictionaryModalName.CANCEL_REQ_REASON, {
            onChoose: this.onChange,
            mainTableFilters: {
                clientId: this.props.clientId,
                docTypeId: this.props.docTypeId
            }
        });
    };

    renderContentView = () => {
        const {clientId, docTypeId} = this.props;
        const onFromCatalogClick = (clientId && docTypeId) ? this.showCancelReqReasonModal : null;

        return (
            <Fragment>
                <Fields.TextArea
                    placeholder={i18n('cancelation.reason')}
                    onChange={this.props.onChangeReason}
                    onFocus={noop}
                    onBlur={noop}
                    name="reason"
                    height={102}
                    maxLength={300}
                    disabled={this.props.isLoading}
                    onFromCatalogClick={onFromCatalogClick}
                    normalize={this.normalizeInput}
                />
            </Fragment>
        );
    };

    renderPanelButtons = () => (
        <Button.Group separatorSize="medium">
            <Button.Medium
                onClick={this.onClose}
            >
                {i18n('cancel')}
            </Button.Medium>
            <Button.Medium
                primary
                onClick={this.props.onSave}
                disabled={this.props.buttonsAreDisabled}
            >
                {i18n('save')}
            </Button.Medium>
        </Button.Group>
    );

    renderFooterView = () => (
        <Footer rightPanel={this.renderPanelButtons()} />
    );

    render() {
        return (
            <form>
                <ModalLayout.Large
                    title={this.props.multipleDocs ? i18n('createModal.titleMultiple') : i18n('createModal.title')}
                    withContentPadding={false}
                    content={this.renderContentView()}
                    footer={this.renderFooterView()}
                    onClose={this.props.onClose}
                />
            </form>
        );
    }
}

export const CreateCancellationDocModalContent = connect(
    null,
    {
        showModal,
        change,
        close: closeModal
    }
)(CreateCancellationDocModalContentUI);
