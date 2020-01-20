/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2018 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {ReactElement} from 'react';
import {ModalLayout} from '@vtb/fe-ui-grid';
import {FooterAlignRight} from './../../../../components/footers';

type createButtonTypes = {
    title: string,
    disabled: boolean,
    onClick: Function
}

const createButton = ({onClick, disabled, title}: createButtonTypes) => ({
    onClick,
    title,
    disabled
});

type SinglePopupTypes = {
    onConfirm: Function,
    onCancel: Function,
    confirmButtonTitleKey: string,
    cancelButtonTitleKey: string,
    bottomElement: ReactElement<any>,
    title: string,
    disabled: boolean,
};

export const SinglePopup = ({
    onConfirm,
    onCancel,
    confirmButtonTitleKey,
    cancelButtonTitleKey,
    bottomElement,
    title,
    disabled
}: SinglePopupTypes) => (<ModalLayout.Large
    title={title}
    onClose={onCancel}
    content={bottomElement}
    footer={
        <FooterAlignRight
            submitButton={createButton({onClick: onConfirm, disabled, title: confirmButtonTitleKey})}
            cancelButton={createButton({onClick: onCancel, disabled: false, title: cancelButtonTitleKey})}
        />
    }
    withContentPadding={false}
/>);

