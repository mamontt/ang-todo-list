/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {translate as originalTranslate} from '@vtb/services/i18n';
import {keyBy} from 'lodash';
import {PACKAGE_NAME} from './../constants/root-namspace';

export const translate: any = (key: string, values?: Object) =>
    originalTranslate(`${PACKAGE_NAME}.${key}`, values);

export const mapToTranslate = (key: string, values: Array<string>) =>
    keyBy(values, item => `${key}.${item}`);
