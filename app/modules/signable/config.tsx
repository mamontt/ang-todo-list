/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {Link} from '@vtb/fe-ui-link';
import {bytesToText} from '@vtb/services/utils';
import {formatDateToDDMMYYYY} from '@vtb/services/l10n';
import {getAttachmentDownloadUrl} from './../../api';
import {letterTitleFormatter, cancellationTitleFormatter} from './../../utils/digest-formatter';
import {translate} from './../../utils/translate';
import {letterFieldNames, cancellationFieldNames, getFieldNames} from './field-names';

function attachmentParse(field: string) { return field.match(/\.(\d+)\.fileName$/); }
function attachmentFieldName(name: string) {
    const [, index] = attachmentParse(name);
    const number = parseInt(index, 10) + 1;
    return translate('sign.attachment', {number});
}

const digestSchema = new Map([
    ['documentDate', formatDateToDDMMYYYY],
    ['attachments', (value: string, field: string, doc: {id: string}) => {
        const match = attachmentParse(field);
        if (match) {
            const prefix = field.replace(match[0], `.${match[1]}`);
            const getField = (name: string) => doc[`${prefix}.${name}`];

            return (
                <Link
                    href={getAttachmentDownloadUrl(doc.id, getField('attachmentId'))}
                    target="_blank"
                >
                    {value} ({bytesToText(getField('size'))})
                </Link>
            );
        }

        return value;
    }]
]);

const attachmentFormatter = (attachment: {attachmentId: string}, document: {edocId: string}) => ({
    ...attachment,
    link: getAttachmentDownloadUrl(document.edocId, attachment.attachmentId)
});


export const getCommonConfig = (after: Function) => ({
    afterAction: after,
    fieldsOptions: {
        title: letterTitleFormatter,
        valueMappers: digestSchema,
        excludeFields: [
            /^attachments\.\d+\.(?!fileName$).+$/,
            'documentNumber',
            'createDate',
            'documentDate',
            /^bankResponsibleOfficer(\.(?!name$).+)?$/,
            /^clientResponsibleOfficer(\.(?!(name|phone)$).+)?$/,
            'id',
            'letterType',
            /^branchSnapshot\.(?!shortName$).+$/,
            /^clientSnapshot\.(?!shortName$).+$/,
            ''
        ],
        fieldsGroups: {
            [translate('common.receiver')]: ['branchSnapshot.shortName', 'bankResponsibleOfficer.name'],
            [translate('common.sender')]: ['clientSnapshot.shortName', 'clientResponsibleOfficer.name', 'clientResponsibleOfficer.phone', 'topic', 'content'],
            [translate('common.attachments')]: ['attachments']
        },
        names: {...getFieldNames(letterFieldNames, 'filters.form.fields'), attachments: attachmentFieldName }
    },
    digestTitleFormatter: letterTitleFormatter,
    attachmentFormatter
});


export const getCancellationConfig = (after: Function) => ({
    afterAction: after,
    fieldsOptions: {
        title: cancellationTitleFormatter,
        valueMappers: digestSchema,
        excludeFields: [
            'corrAccount',
            'cancelEdocAccountNumber',
            'cancelEdocCurrency',
            'cancelEdocAlphabeticCurrency',
            'cancelEdocSum',
            'cancelEdocBic',
            'cancelEdocTypeName',
            'cancelEdocId',
            'documentNumber',
            'documentDate'
        ],
        fieldsGroups: {
            [translate('cancellation.main-requisites')]: [
                'cancelEdocTypeId',
                'cancelEdocNumber',
                'cancelEdocDate',
                'cancelEdocBranch',
                'cancelEdocOrg',
                'cancelEdocStatus',
                'documentReference',
                'reason'
            ]
        },
        names: {...getFieldNames(cancellationFieldNames, 'cancellation')}
    },
    digestTitleFormatter: cancellationTitleFormatter,
    attachmentFormatter
});
