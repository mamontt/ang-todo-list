/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2018 VTB Group. All rights reserved.
 */
import {addNotification} from '@vtb/fe-ui-alert';
import {closeModal, showModal} from '@vtb/fe-ui-dialog';
import {debounce, get} from 'lodash';
import {MODAL_NAMES} from './../../constants/modal-names';
import {resource} from '../../modules/resource';
import {TemplateType} from '../../modules/templates';
import {DEFAULT_PAGE_SIZE} from './../../constants/size';
import {DEBOUNCE_WAIT} from './../../constants/timeouts';
import {debounceAction} from './../../utils/debounce-action';
import {QueryParamsType} from '../../modules/dictionary-new/flow-types';
import {TEMPLATES_DESCRIPTORS} from './template-descriptors';
import {
    TEMPLATE_NOTIFICATION_SUCCESS,
    TEMPLATE_NOTIFICATION_FAILURE,
    TEMPLATE_NOTIFICATION_DELETED
} from './notifications';
import {getIsUpdate, getName} from './create-template/selectors';
import {SEARCH, SAVE, UPDATE, RECOVER} from './constants';
import {
    CreateTemplateActionType,
    UpdateTemplateActionType,
    FindTemplateActionType,
    DeleteTemplateActionType,
    UpdateFieldsTipType,
    GetData,
    NotificationsType,
    Form
} from './flow-types';

type OpenCreateTemplatePropsType = {
    title?: string;
    validateMessage?: string;
    notifications?: NotificationsType;
    form: Form;
    findTemplateAction: FindTemplateActionType;
    createTemplateAction: CreateTemplateActionType;
    updateTemplateAction: UpdateTemplateActionType;
    deleteTemplateAction: DeleteTemplateActionType;
    updateFieldsTip: UpdateFieldsTipType;
    templates?: Array<TemplateType>;
    withChose?: boolean;
    initialValues?: TemplateType;
    validate?: () => void;
}

type OpenCreateTemplateScrollerType = {
    docTypeId: number;
    clientId?: number;
    createModalTemplates: (template: { attributeComposition: string; }) => void;
    deleteTemplateAction?: DeleteTemplateActionType;
}
export const openCreateTemplate = ({
    title,
    validateMessage,
    notifications,
    form,
    findTemplateAction,
    createTemplateAction,
    updateTemplateAction,
    deleteTemplateAction,
    updateFieldsTip,
    templates,
    withChose,
    initialValues,
    validate
}: OpenCreateTemplatePropsType) => (dispatch: Function) => {
    dispatch(
        showModal(MODAL_NAMES.FORM_TEMPLATE_CREATE, ({
            templates,
            title,
            validateMessage,
            notifications,
            form,
            findTemplates: findTemplateAction,
            createTemplate: createTemplateAction,
            updateTemplate: updateTemplateAction,
            deleteTemplate: deleteTemplateAction,
            updateFieldsTip,
            withChose,
            initialValues,
            validate
        }))
    );
};

export const openTemplatesScroller = ({
    docTypeId,
    clientId,
    createModalTemplates,
    deleteTemplateAction = () => Promise.reject()
}: OpenCreateTemplateScrollerType) => (dispatch: Function) => {
    dispatch(
        showModal(MODAL_NAMES.FORM_TEMPLATES_SCROLLER, ({
            docTypeId,
            clientId,
            createModalTemplates,
            deleteTemplate: deleteTemplateAction
        }))
    );
};

export const saveTemplate = (
    form: Form,
    createTemplateAction: CreateTemplateActionType,
    updateTemplateAction: UpdateTemplateActionType,
    deleteTemplate: DeleteTemplateActionType,
    notifications?: NotificationsType,
    template?: TemplateType,
    setFieldsTip?: (name: string, isConflictName?: boolean) => string,
) =>
    (dispatch: Function, getState: Function) => {
        const state = getState();
        const update = getIsUpdate(state);
        const name = getName(state);
        const templateId = get(template, 'id');

        const actionTemplate = (update && templateId)
            ? updateTemplateAction(template, name, form)
            : createTemplateAction(name, form);

        const notificationSuccess = (success: Function, deleted: Function, newTemplate: TemplateType) =>
            success(
                update,
                name,
                debounce(
                    debounceAction(
                        () => deleteTemplate(newTemplate)
                            .then(() => dispatch(addNotification(deleted(name))))
                    ),
                    DEBOUNCE_WAIT,
                    {leading: false, trailing: true}
                )
            );

        actionTemplate
            .then((newTemplate) => {
                dispatch(closeModal());
                dispatch(addNotification(
                    notificationSuccess(
                        notifications ? notifications.success : TEMPLATE_NOTIFICATION_SUCCESS,
                        notifications ? notifications.deleted : TEMPLATE_NOTIFICATION_DELETED,
                        newTemplate
                    )
                ));
            })
            .catch(({response}) => {
                if (response.status === 409) {
                    setFieldsTip(name, true);
                } else {
                    const action = update ? UPDATE : SAVE;
                    dispatch(addNotification(
                        notifications
                            ? notifications.failure(action, name)
                            : TEMPLATE_NOTIFICATION_FAILURE(action, name)
                    ));
                }
            });
    };

export const findTemplates = (
    url: string,
    data: TemplateType,
    queryParams: QueryParamsType = {
        page: 0,
        size: DEFAULT_PAGE_SIZE
    }

): Promise<Array<TemplateType>> => resource(url).post({...data, id: undefined}, queryParams)
    .then((response: {data: Array<Object>}) => response.data || []);

export const fetchTemplate = (url: string, id: number): Promise<TemplateType> => resource(`${url}/${id}`).get();

export const createTemplate = (url: string, data: TemplateType): Promise<TemplateType> => resource(url).create(data);

export const updateTemplate = (
    url: string,
    data: TemplateType,
    queryParams: QueryParamsType = {},
    id?: number
): Promise<TemplateType> => resource(id ? `${url}/${id}` : url).update(queryParams, data);

export const deleteTemplate = (url: string, id?: number): Promise<TemplateType> => resource(`${url}/${id}`).delete();

const getUrl = (docTypeId: number) => (TEMPLATES_DESCRIPTORS[docTypeId] ? TEMPLATES_DESCRIPTORS[docTypeId].url : '');

export const createApiTemplate = (docTypeId: number) => ({
    findTemplates: (data: TemplateType, queryParams: QueryParamsType) =>
        findTemplates(`${getUrl(docTypeId)}/${SEARCH}`, data, queryParams),
    fetchTemplate: (id: number) => fetchTemplate(getUrl(docTypeId), id),
    createTemplate: (data: TemplateType) => createTemplate(getUrl(docTypeId), data),
    updateTemplate: (
        data: TemplateType,
        queryParams: QueryParamsType = {},
        id?: number
    ) => updateTemplate(`${getUrl(docTypeId)}`, data, queryParams, id),
    deleteTemplate: (id: number) => deleteTemplate(getUrl(docTypeId), id)
});

export const removeTemplateNotification = (
    row: TemplateType,
    getData: GetData
) => (dispatch: Function) => {
    dispatch(addNotification(TEMPLATE_NOTIFICATION_DELETED(row, getData, dispatch)));
};

export const recoverDelete = (row: TemplateType, getData: GetData) => (dispatch: Function) => {
    const apiTemplate = createApiTemplate(row.docTypeId);
    apiTemplate.createTemplate(row)
        .then(() => getData())
        .catch(() => dispatch(addNotification(TEMPLATE_NOTIFICATION_FAILURE(RECOVER, row.name))));
};
