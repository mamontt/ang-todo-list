/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {isArray} from 'lodash';
import {DETAIL_TYPE, extensionItems} from './../../modules/export';
import {translate} from '../../utils/translate';
import {EXPORT} from './../../pages/letter-scroller/common/scroller-parts/action-bar/header-actions';
import {DEFAULT_FIELDS} from './../../modules/export/constants';
import {ExportDocuments} from '../../pages/letter-scroller/actions';
import {LetterDirection} from '../../modules/define-letter-direction';
import {ActionBarButton} from '../../pages/letter-scroller/common/scroller-parts/action-bar/action-bar-button';

export type ExportParams = {
    type: string;
    extension: string;
    split: boolean;
};

export type ExportLettersParams = {
    direction: LetterDirection;
    isOfficial: boolean;
    showExportModal: Function;
    exportDocuments: ExportDocuments;
    letterScroller: string;
    checkedRows: {[key: string]: any};
    isActionEnabledWithCapabilities: Function;
    savedScrollerSettings: any;
    resetDataAndCapabilities: Function;
};

export type ExportLetters = (exportLettersParams: ExportLettersParams) => ActionBarButton;

export const exportLetters = ({
    direction,
    isOfficial,
    showExportModal,
    exportDocuments,
    letterScroller,
    checkedRows,
    isActionEnabledWithCapabilities,
    savedScrollerSettings,
    resetDataAndCapabilities
}: ExportLettersParams): ActionBarButton => {
    const noCheckedRows = checkedRows.length === 0;
    const fields =
        (isArray(savedScrollerSettings.columns) &&
            savedScrollerSettings.columns
                .filter((column: {visible: boolean}) => column.visible)
                .map((column: {name: string}) => column.name)
                .join(',')) ||
        DEFAULT_FIELDS;

    return {
        id: EXPORT,
        title: translate('actions.export'),
        onClick: () =>
            showExportModal({
                isMultiple: checkedRows.length > 1,
                onExport: (exportParams: ExportParams) =>
                    exportDocuments(
                        letterScroller,
                        checkedRows.length > 1
                            ? {
                                ...exportParams,
                                isOfficial,
                                letterDirection: direction,
                                fields
                            }
                            : {
                                ...exportParams,
                                type: DETAIL_TYPE,
                                split: false,
                                letterDirection: direction,
                                isOfficial,
                                fields
                            }
                    ),
                onReload: () => resetDataAndCapabilities(),
                extensionItems
            }),
        icon: 'Export',
        disabled: !isActionEnabledWithCapabilities(EXPORT) || noCheckedRows
    };
};
