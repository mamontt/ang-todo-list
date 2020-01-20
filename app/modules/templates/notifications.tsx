/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2018 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {notificationTypes} from '@vtb/fe-ui-alert';
import {Icons} from '@vtb/fe-ui-icon';
import {Button} from '@vtb/fe-ui-button';
import {translate} from './../../utils/translate';
import {recoverDelete} from './actions';
import {SAVE} from './constants';
import {GetData, TemplateType} from './flow-types';

const NOTIFICATION_LIFETIME = 5000;

const recoverButton = (row: TemplateType, getData: GetData) => (dispatch: Function) => {
    const {name} = row;
    return (
        <div>
            <span>{translate('template.deleted-message', {name})}</span>
            <Button.SmallIcon
                onClick={() => dispatch(recoverDelete(row, getData))}
                icon={Icons.Repeat}
                text={translate('buttons.recover')}
            />
        </div>
    );
};

export const TEMPLATE_NOTIFICATION_SUCCESS = (update: boolean, name: string, cancel?: () => void) => ({
    title: update ? translate('template.update-success') : translate('template.save-success'),
    content: update ? translate('template.update-message-success', {name}) : translate('template.save-message-success', {name}),
    lifeTime: NOTIFICATION_LIFETIME,
    type: notificationTypes.success,
    action: (!update && cancel) && {
        title: translate('modal.reject.cancel'),
        action: () => cancel && cancel()
    }
});

const getContent = (action = SAVE, name: string) => translate(`template.${action}-message-failure`, {name});

export const TEMPLATE_NOTIFICATION_FAILURE = (action: string, name: string) => ({
    title: translate('template.save-failure'),
    content: getContent(action, name),
    lifeTime: NOTIFICATION_LIFETIME,
    type: notificationTypes.error
});

export const TEMPLATE_NOTIFICATION_DELETED = (
    row: TemplateType,
    getData: GetData,
    dispatch: Function
) => ({
    title: translate('template.deleted'),
    content: dispatch(recoverButton(row, getData)),
    lifeTime: NOTIFICATION_LIFETIME,
    type: notificationTypes.success
});

export const TEMPLATE_SAVE_IMPOSSIBLE = () => ({
    title: translate('notification.operation-error-title'),
    content: translate('template.save-critical-error-message'),
    lifeTime: NOTIFICATION_LIFETIME,
    type: notificationTypes.error
});
