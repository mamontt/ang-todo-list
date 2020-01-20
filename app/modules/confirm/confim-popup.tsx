/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {noop} from 'lodash';
import {ConfirmModal} from './confirm-modal';

type ConfirmPopupProps = {
    modalParams: {
        title: string;
        afterCancel: () => void;
        afterConfirm: () => void;
        confirmButtonText: string;
        cancelButtonText: string;
        labelText: string | Array<string>;
        type?: string;
    };
};
export const ConfirmPopup = (props: ConfirmPopupProps) => {
    const {
        modalParams: {
            labelText = null,
            confirmButtonText = null,
            cancelButtonText = null,
            title = null,
            type = null,
            afterConfirm = noop,
            afterCancel = noop
        } = {}
    } = props;
    return (
        <ConfirmModal
            title={title}
            type={type}
            text={labelText}
            onCancel={afterCancel}
            onConfirm={afterConfirm}
            confirmButtonText={confirmButtonText}
            cancelButtonText={cancelButtonText}
        />
    );
};
