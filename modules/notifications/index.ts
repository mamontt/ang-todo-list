/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {notificationTypes} from '@vtb/fe-ui-alert';
import {translate} from './../../utils/translate';

// TODO extract constant
const NOTIFICATION_LIFETIME = 5000;

export const NOTIFICATION_SEND_SUCCESS = () => ({
    title: translate('notification.send-success'),
    content: translate('notification.send-message-success'),
    lifeTime: NOTIFICATION_LIFETIME,
    type: notificationTypes.success
});

export const NOTIFICATION_SEND_FAILURE = () => ({
    title: translate('notification.send-failure'),
    content: translate('notification.send-message-failure'),
    lifeTime: NOTIFICATION_LIFETIME,
    type: notificationTypes.error
});

export const NOTIFICATION_SAVE_SUCCESS = () => ({
    title: translate('notification.save-success'),
    content: translate('notification.save-message-success'),
    lifeTime: NOTIFICATION_LIFETIME,
    type: notificationTypes.success
});

export const NOTIFICATION_SAVE_WITH_ISSUES = () => ({
    title: translate('notification.save-success'),
    content: translate('notification.save-with-issues'),
    lifeTime: NOTIFICATION_LIFETIME,
    type: notificationTypes.error
});

export const NOTIFICATION_SAVE_FAILURE = () => ({
    title: translate('notification.save-failure'),
    content: translate('notification.save-message-failure'),
    lifeTime: NOTIFICATION_LIFETIME,
    type: notificationTypes.error
});

export const NOTIFICATION_LOAD_FAILURE = () => ({
    title: translate('notification.load-failure'),
    content: translate('notification.load-message-failure'),
    lifeTime: NOTIFICATION_LIFETIME,
    type: notificationTypes.error
});

export const NOTIFICATION_DELETE_FAILURE = () => ({
    title: translate('notification.operation-error-title'),
    content: translate('notification.operation-error'),
    lifeTime: NOTIFICATION_LIFETIME,
    type: notificationTypes.error
});

export const NOTIFICATION_DELETE_SUCCESS = (number?: number) => ({
    title: translate('notification.operation-success-title'),
    content: number
        ? translate('notification.delete-message-success-number', {number})
        : translate('notification.delete-message-success'),
    lifeTime: NOTIFICATION_LIFETIME,
    type: notificationTypes.success
});

export const NOTIFICATION_DONE_SUCCESS = () => ({
    title: translate('notification.operation-success-title'),
    content: translate('notification.operation-success'),
    lifeTime: NOTIFICATION_LIFETIME,
    type: notificationTypes.success
});


export const NOTIFICATION_DONE_ERROR = () => ({
    title: translate('notification.operation-error-title'),
    content: translate('notification.operation-error'),
    lifeTime: NOTIFICATION_LIFETIME,
    type: notificationTypes.error
});

export const NOTIFICATION_PRELIMINARY_DATA_FETCH_FAILURE = () => ({
    title: translate('notification.preliminary-data-fetch-failure'),
    content: translate('notification.preliminary-data-fetch-message-failure'),
    lifeTime: NOTIFICATION_LIFETIME,
    type: notificationTypes.error
});

export const NOTIFICATION_PROCEEDING_SUCCESS = () => ({
    title: translate('notification.proceeding-success'),
    content: translate('notification.proceeding-message-success'),
    lifeTime: NOTIFICATION_LIFETIME,
    type: notificationTypes.success
});

export const NOTIFICATION_PROCEEDING_FAILURE = () => ({
    title: translate('notification.proceeding-failure'),
    content: translate('notification.proceeding-message-failure'),
    lifeTime: NOTIFICATION_LIFETIME,
    type: notificationTypes.error
});

export const NOTIFICATION_CONFIRM_SUCCESS = () => ({
    title: translate('notification.confirm-success'),
    content: translate('notification.confirm-message-success'),
    lifeTime: NOTIFICATION_LIFETIME,
    type: notificationTypes.success
});

export const NOTIFICATION_CONFIRM_FAILURE = () => ({
    title: translate('notification.confirm-failure'),
    content: translate('notification.confirm-message-failure'),
    lifeTime: NOTIFICATION_LIFETIME,
    type: notificationTypes.error
});

export const NOTIFICATION_REJECT_SUCCESS = () => ({
    title: translate('notification.reject-success'),
    content: translate('notification.reject-message-success'),
    lifeTime: NOTIFICATION_LIFETIME,
    type: notificationTypes.success
});

export const NOTIFICATION_REJECT_FAILURE = () => ({
    title: translate('notification.reject-failure'),
    content: translate('notification.reject-message-failure'),
    lifeTime: NOTIFICATION_LIFETIME,
    type: notificationTypes.error
});

export const NOTIFICATION_COPY_FAILURE = () => ({
    title: translate('notification.copy-failure'),
    content: translate('notification.copy-message-failure'),
    lifeTime: NOTIFICATION_LIFETIME,
    type: notificationTypes.error
});

export const NOTIFICATION_PRINT_FAILURE = () => ({
    title: translate('notification.print-failure'),
    content: translate('notification.print-message-failure'),
    lifeTime: NOTIFICATION_LIFETIME,
    type: notificationTypes.error
});

export const NOTIFICATION_HANDLE_SINGLE_SUCCESS = () => ({
    title: translate('notification.handle-success'),
    content: translate('notification.handle-single-message-success'),
    lifeTime: NOTIFICATION_LIFETIME,
    type: notificationTypes.success
});

export const NOTIFICATION_HANDLE_FAILURE = () => ({
    title: translate('notification.handle-failure'),
    content: translate('notification.handle-message-failure'),
    lifeTime: NOTIFICATION_LIFETIME,
    type: notificationTypes.error
});

export const NOTIFICATION_STATUSES_FAILURE = () => ({
    title: translate('notification.statuses-failure'),
    content: translate('notification.statuses-message-failure'),
    lifeTime: NOTIFICATION_LIFETIME,
    type: notificationTypes.error
});

// TODO: remove when UI Signature2 massive signatures removal created
export const NOTIFICATION_REMOVESIGN_FAILURE = () => ({
    title: translate('notification.remove-signature-failure'),
    content: translate('notification.remove-signature-message-failure'),
    lifeTime: NOTIFICATION_LIFETIME,
    type: notificationTypes.error
});

export const NOTIFICATION_EXECUTE_SUCCESS = () => ({
    title: translate('notification.execute-success'),
    content: translate('notification.execute-message-success'),
    lifeTime: NOTIFICATION_LIFETIME,
    type: notificationTypes.success
});

export const NOTIFICATION_EXECUTE_FAILURE = () => ({
    title: translate('notification.execute-failure'),
    content: translate('notification.execute-message-failure'),
    lifeTime: NOTIFICATION_LIFETIME,
    type: notificationTypes.error
});

export const NOTIFICATION_SAVE_CLIENT_FAILURE = () => ({
    title: translate('notification.save-document-failed-title'),
    content: translate('notification.save-client-failed-text'),
    lifeTime: NOTIFICATION_LIFETIME,
    type: notificationTypes.error
});

export const NOTIFICATION_SAVE_BRANCH_FAILURE = () => ({
    title: translate('notification.save-document-failed-title'),
    content: translate('notification.save-branch-failed-text'),
    lifeTime: NOTIFICATION_LIFETIME,
    type: notificationTypes.error
});

