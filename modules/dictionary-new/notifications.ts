/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2018 VTB Group. All rights reserved.
 */
import {notificationTypes} from '@vtb/fe-ui-alert';
import {translate} from './../../utils/translate';

const NOTIFICATION_LIFETIME = 5000;

export const NOTIFICATION_LOAD_FAILURE = () => ({
    title: translate('notification.load-failure'),
    content: translate('notification.load-message-failure'),
    lifeTime: NOTIFICATION_LIFETIME,
    type: notificationTypes.error
});
