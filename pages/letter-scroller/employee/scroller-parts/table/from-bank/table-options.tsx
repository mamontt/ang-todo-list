/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {get} from 'lodash';
import {formatDateToDDMMYYYY} from '@vtb/services/l10n';
import {translate} from './../../../../../../utils/translate';
import {FullEllipsisText} from './../../../../../../components/full-ellipsis-text';
import {AttachmentsCell} from '../../../../../../pages/letter-scroller/common/table/attachments-cell/attachments-cell';
import {RowType, SelectorType} from '../../../../../../pages/letter-scroller/flow-types';

export const getTableColumns = () => [
    {
        label: translate('lettersScroller.documentNumber'),
        name: 'documentNumber',
        width: 180,
        fixed: false,
        sortable: true,
        visible: true,
        joinWith: 'documentDate',
        resizable: true
    },
    {
        // TODO нужен форматтер dateTimeToDate
        label: translate('lettersScroller.documentDate'),
        name: 'documentDate',
        width: 200,
        fixed: false,
        sortable: true,
        selector: ({documentDate}: SelectorType) => formatDateToDDMMYYYY(documentDate),
        visible: true,
        resizable: true
    },
    {
        label: translate('lettersScroller.sender'),
        name: 'branchSnapshot.shortName',
        width: 300,
        stretch: true,
        joinWith: 'clientSnapshot.shortName',
        sortable: true,
        selector: ({branchSnapshot}: SelectorType) =>
            <FullEllipsisText>{get(branchSnapshot, 'shortName', null)}</FullEllipsisText>,
        visible: true,
        resizable: true
    },
    {
        label: translate('lettersScroller.receiver'),
        name: 'clientSnapshot.shortName',
        width: 300,
        stretch: true,
        sortable: true,
        selector: ({clientSnapshot}: SelectorType) =>
            <FullEllipsisText>{get(clientSnapshot, 'shortName', null)}</FullEllipsisText>,
        visible: true,
        resizable: true
    },
    {
        label: translate('lettersScroller.subject'),
        name: 'topic',
        width: 320,
        joinWith: 'letterType.name',
        selector: (row: RowType) => <FullEllipsisText>{get(row, 'topic', null)}</FullEllipsisText>,
        sortable: true,
        visible: true,
        resizable: true
    },
    {
        label: translate('lettersScroller.letterType'),
        name: 'letterType.name',
        width: 320,
        sortable: true,
        selector: (row: RowType) => get(row, 'letterType.name'),
        visible: true,
        resizable: true
    },
    {
        label: translate('lettersScroller.status'),
        name: 'status.name',
        width: 228,
        joinWith: 'status.extendedName',
        sortable: true,
        visible: true,
        resizable: true
    },
    {
        label: translate('lettersScroller.statusExtended'),
        name: 'status.extendedName',
        width: 228,
        sortable: true,
        visible: true,
        resizable: true
    },
    {
        label: '',
        name: 'attachments',
        width: 40,
        cell: AttachmentsCell,
        required: true,
        sortable: true,
        visible: true,
        settingsLabel: translate('lettersScroller.attachments'),
        resizable: true
    }
];
