/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import moment from 'moment';
import {assign, get, isNil, isNaN, toString, toNumber} from 'lodash';
import {translate} from '../utils/translate';

const translateMessage = () => translate('document.validation.requiredField');

export const required = (fieldName: string, message = translateMessage) => (props: Object) => (
    isNil(get(props, fieldName)) ? {[fieldName]: message()} : {}
);

/**
 * Is field value numeric and it's length equals to expected
 * @param fieldName - form field name
 * @param length - expected length
 * @param message - error message
 */
export const numericWithLength = (
    fieldName: string,
    length: number,
    message: string = translate('document.validation.containDigits')
) => (props: Object) => (
    (isNaN(toString(get(props, fieldName))) || (toString(toNumber(get(props, fieldName))).length !== length))
        ? {[fieldName]: message}
        : {}
);

/**
 * is field date in the past
 * @param fieldName - form field name
 * @param includeNow - includes current date in diff
 * @param message - error message
 */
export const dateBeforeNow = (
    fieldName: string,
    includeNow: boolean = false,
    message: string = translate('document.validation.dateLessOrEqual')
) => (props: Object) => {
    const currentDate = moment().startOf('day');
    const fieldDate = moment(get(props, fieldName)).startOf('day');
    if (!fieldDate.isValid()) {
        return {[fieldName]: message};
    }
    const oneDayShift = moment.duration(1, 'day').milliseconds();
    const datesDiff = currentDate.diff(fieldDate) - (!includeNow && oneDayShift);
    return datesDiff < 0 ? {[fieldName]: message} : {};
};

export const combineValidators = (...validators: Array<Object>) => (props: Object) => (
    assign({}, ...validators.map((validator: Function) => validator(props)))
);
