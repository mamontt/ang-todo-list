/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2018 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {ReactElement} from 'react';
import {GroupModal} from '@vtb/fe-bi-modals';
import {createInfoContent} from '../../../../modules/popups/group-modal';
import {translate} from './../../../../utils/translate';

type MultiplyPopupTypes = {
    onConfirm: Function,
    onCancel: Function,
    confirmButtonTitleKey: string,
    cancelButtonTitleKey: string,
    bottomElement: ReactElement<any>,
    title: string,
    documents: Array<Object>,
    loaded: boolean,
    disabled: boolean
};

export const MultiplyPopup = ({
    documents,
    onConfirm,
    onCancel,
    confirmButtonTitleKey,
    cancelButtonTitleKey,
    bottomElement,
    title,
    loaded,
    disabled
}: MultiplyPopupTypes) => (<GroupModal
    content={createInfoContent(documents, documents.length)}
    onConfirm={onConfirm}
    onCancel={onCancel}
    confirmButtonText={translate(confirmButtonTitleKey)}
    cancelButtonText={translate(cancelButtonTitleKey)}
    title={title}
    bottomElement={bottomElement}
    loading={!loaded}
    disabledSubmitButton={disabled}
/>);
