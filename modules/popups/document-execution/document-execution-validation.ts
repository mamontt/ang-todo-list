/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {combineValidators, numericWithLength, dateBeforeNow} from './../../../utils/common-validators';
import {translate} from './../../../utils/translate';

export const documentExecutionValidation = combineValidators(
    numericWithLength('registrationDataPart1', 8, translate('document.validation.eightDigits')),
    dateBeforeNow('acceptanceDate', true, translate('document.validation.dateLessOrEqual'))
);
