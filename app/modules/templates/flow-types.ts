/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2018 VTB Group. All rights reserved.
 */
import {closeModal} from '@vtb/fe-ui-dialog';
import {DataTableColumnType} from '@vtb/fe-ui-table';
import {Client} from '../../common-types';
import {RowType} from '../../pages/letter-scroller/flow-types';

export type TemplateType = {
    attributeComposition?: string;
    clientId?: number;
    docTypeId?: number;
    id?: number;
    name?: string;
}

export type GetData = () => Array<TemplateType>;
export type FormDocumentType = Object
export type CreateTemplateActionType = (name: string, form: FormDocumentType) => Promise<TemplateType>
export type UpdateTemplateActionType =
    (template: TemplateType, name: string, form: FormDocumentType) => Promise<TemplateType>
export type DeleteTemplateActionType = (template: TemplateType) => Promise<TemplateType | Array<Object>>
export type FindTemplateActionType = (obj: FormDocumentType) => Promise<Array<TemplateType>>
export type UpdateFieldsTipType = (form: FormDocumentType) => string
export type closeWithNotifyType = (obj: FormDocumentType) => void

export type ModalTemplatesType = {
    closeModal: typeof closeModal;
    modalParams: {
        docTypeId: number;
        clientId?: number;
        createModalTemplates: (row: RowType) => void;
        deleteTemplate: DeleteTemplateActionType;
    }
}

export type NotificationsType = {
    success: Function;
    failure: Function;
    deleted: Function;
    impossible: Function;
};

export type Form = {
    [fieldName: string]: any;
}

export type FormModalTemplateType = {
    modalParams: {
        title?: string;
        validateMessage?: string;
        notifications?: NotificationsType;
        form: Form;
        findTemplates: FindTemplateActionType;
        createTemplate: CreateTemplateActionType;
        updateTemplate: UpdateTemplateActionType;
        deleteTemplate: DeleteTemplateActionType;
        updateFieldsTip: UpdateFieldsTipType;
        templates?: Array<TemplateType>;
        withChose?: boolean;
        initialValues?: TemplateType;
        validate?: () => void;
    };
    clients: Array<Client>;
    closeModal: typeof closeModal;
    closeWithNotify: closeWithNotifyType;
    update: boolean;
    initialValues?: {
        name: string;
    },
    change?: (formName: string, fieldName: string, defaultValue?: any) => void;
    updateValue?: boolean;
    syncErrors?: Function;
    saveTemplate?: Function;
    handleSubmit?: Function;
    invalid?: boolean;
}

export type FilterFieldType = {
    label?: string;
    name?: string;
    reduxField: Function;
    props?: {
        name?: string;
        rows?: number;
    },
    customField?: boolean;
}

export type DescriptorType = {
    url: string;
    filterView: Function;
    columns: () => Array<typeof DataTableColumnType>;
    filterFields: () => Array<FilterFieldType>;
}

export type OnFilterTagsType = (fieldName: string, value: string) => boolean;
