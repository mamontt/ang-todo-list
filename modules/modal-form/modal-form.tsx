/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {Children, cloneElement, ComponentType, ReactElement, ReactNode} from 'react';
import {noop, identity} from 'lodash';
import styleNames from '@vtb/services/style-names';
import {ModalLayout} from '@vtb/fe-ui-grid';
import styles from './modal-form.scss';

type ModalFormProps = {
    title: string;
    fields: ReactNode;
    buttons: ReactNode;
    onSubmit: () => void;
    onClose: () => void;
    withCross: boolean;
    size: string;
    handleSubmit: (onSubmit: () => void) => any;
    type?: string;
}

const sn = styleNames(styles);

const getContentView = (fields: ReactNode) => (
    <div className={sn('modal-form__content')}>
        {Children.map(fields, (child: ReactElement<any>) => (
            cloneElement(child, {})
        ))}
    </div>
);
const getFooterView = (buttons: ReactNode) => (
    <div className={sn('modal-form__footer')}>
        {Children.map(buttons, (button) => (
            <div>
                {button}
            </div>
        ))}
    </div>
);

export const MODAL_SIZE_SMALL = 'small';
export const MODAL_SIZE_LARGE = 'large';

export const ModalForm: ComponentType<any> = ({
    title,
    size = MODAL_SIZE_SMALL,
    fields,
    buttons,
    type,
    onSubmit = noop,
    onClose = noop,
    handleSubmit = identity,
    withCross = true
}: ModalFormProps) => (
    <form className={sn('modal-form')} onSubmit={handleSubmit(onSubmit)}>
        <ModalLayout.Large
            type={type}
            size={size}
            title={title}
            onClose={withCross ? onClose : undefined}
            content={getContentView(fields)}
            footer={getFooterView(buttons)}
        />
    </form>
);

export const ContentLine = ({children}: any) =>
    <div className={sn('modal-form__content-line')}>{children}</div>;
