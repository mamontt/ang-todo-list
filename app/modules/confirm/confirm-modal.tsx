/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {isArray, map} from 'lodash';
import {Button} from '@vtb/fe-ui-button';
import {ModalForm, ContentLine} from '../../modules/modal-form';
import {translate} from './../../utils/translate';
import {TargetEvent} from '../../common-types';

export type ConfirmModalProps = {
    title: string;
    onCancel?: () => void;
    onConfirm?: () => void;
    afterConfirm?: () => void,
    afterCancel?: (event?: TargetEvent) => void;
    confirmButtonText: string;
    cancelButtonText: string;
    text?: string | Array<string>;
    type?: string;
};

const preventDefault = (func: Function, ...args: Array<any>): Function => (event: MouseEvent): void => {
    event.preventDefault();
    func(...args);
};

export const ConfirmModal = ({
    type,
    text,
    onCancel,
    onConfirm,
    confirmButtonText = translate('buttons.ok'),
    cancelButtonText = null,
    title = translate('actions.title.actionConfirm')
}: ConfirmModalProps) => {
    const buttonSubmit = (
        <Button.Submit>
            {confirmButtonText}
        </Button.Submit>
    );

    const buttonCancel = (
        <Button.Light onClick={onCancel}>
            {cancelButtonText}
        </Button.Light>);

    const renderButtons = (cancelButtonFlag: string) =>
        (cancelButtonFlag
            ? [buttonCancel, buttonSubmit]
            : [buttonSubmit]
        );

    return (
        <ModalForm
            type={type}
            title={title}
            onSubmit={preventDefault(onConfirm)}
            onClose={onCancel}
            fields={map(isArray(text) ? text : [text], (line, i) => <ContentLine key={i}>{line}</ContentLine>)}
            buttons={renderButtons(cancelButtonText)}
        />
    );
};
