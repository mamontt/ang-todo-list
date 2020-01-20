/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {ComponentType} from 'react';
import {ModalLayout} from '@vtb/fe-ui-grid';
import {FooterAlignRight} from './../../components/footers/index';
import {translate} from './../../utils/translate';
import {ExportContent} from './export-content';
import {
    extensionItems as defaultExtensionItems,
    exportTypes as defaultExportTypes
} from './constants';

export type ContentItems = {
    exportTypes?: Array<{value: string, label: string}>;
    extensionItems?: Array<{value: string, label: string}>;
    isMultiple?: boolean;
}

type TypeProps = {
    value: string;
    label: string;
}

export type ExportContentPropsType = ContentItems & {
    exportTypes?: Array<TypeProps>;
    extensionItems?: Array<TypeProps>;
    isMultiple?: boolean;
    formValues?: {[key: string]: string};
    onChange?: (param: string, format: string) => void;
}

type ExportModalTypes = ContentItems & {
    title?: string;
    content?: ComponentType<ExportContentPropsType>;
    onExport?: Function;
    exportButtonTitle?: string;
    closeModal: () => void;
    formValues?: {[key: string]: string};
    onChange: (param: string, format: string) => void;
}

const preventDefault = (func: Function, ...args: Array<any>): Function => (event: MouseEvent): void => {
    event.preventDefault();
    func(...args);
};

export const ExportModal = ({
    title,
    content,
    exportTypes = defaultExportTypes,
    extensionItems = defaultExtensionItems,
    isMultiple = true,
    onExport,
    exportButtonTitle,
    closeModal,
    formValues,
    onChange
}: ExportModalTypes) => {
    const submitBtn = {
        onClick: preventDefault(onExport),
        title: exportButtonTitle
    };
    const Content = content || ExportContent;
    return (
        <ModalLayout.Small
            title={translate(isMultiple ? 'modal.multiple-export.title' : title)}
            content={<Content
                isMultiple={isMultiple}
                extensionItems={extensionItems}
                exportTypes={exportTypes}
                formValues={formValues}
                onChange={onChange}
            />}
            footer={<FooterAlignRight submitButton={submitBtn} />}
            onClose={closeModal}
        />
    );
};
ExportModal.defaultProps = {
    title: 'modal.single-export.title',
    exportButtonTitle: 'buttons.export'
};
