/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {translate} from './../../utils/translate';

export const letterFieldNames = [
    'clientResponsibleOfficer.name',
    'clientResponsibleOfficer.phone',
    'documentNumber',
    'letterType.name',
    'topic',
    'content',
    'branchSnapshot',
    'clientSnapshot',
    'bankResponsibleOfficer.name',
    'documentDate',
    'number'
];

export const cancellationFieldNames = [
    'cancelEdocTypeId',
    'cancelEdocNumber',
    'cancelEdocDate',
    'cancelEdocOrg',
    'cancelEdocBic',
    'cancelEdocBranch',
    'cancelEdocStatus',
    'reason',
    'corrAccount',
    'cancelEdocAccountNumber',
    'cancelEdocCurrency',
    'cancelEdocAlphabeticCurrency',
    'cancelEdocSum',
    'documentReference'
];

export const getFieldNames = (fieldNames: Array<string>, translatePrefix: string) =>
    fieldNames.reduce(
        (mem, name: string) => ({
            ...mem,
            [name]: translate(`${translatePrefix}.${name}`)
        })
        , {}
    );
