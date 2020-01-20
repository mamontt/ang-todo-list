/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {get} from 'lodash';
import {fieldNames} from './../../../constants/field-names';

type FieldName = {
    [field: string]: string;
}

export const getFieldName = (key: string, fieldsNames: FieldName): string => get(fieldsNames, key, key);

export const formatError = (fieldsNames: FieldName, key: string, {message}: { message: string }) =>
    `${getFieldName(key, fieldNames())}: ${message}`;
