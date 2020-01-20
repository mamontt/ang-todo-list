/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {isFunction} from 'lodash';
import {Fields} from '@vtb/fe-ui-input';
import styleNames from '@vtb/services/style-names';
import {translate} from './../../utils/translate';
import {DETAIL_TYPE, LIST_TYPE} from './constants';
import {ExportContentPropsType} from './export-modal';
import styles from './export-content.scss';
import {PDF, RTF, CSV, XLS} from './export-formats';

export const EXPORT_FORM = 'export_form';

const sn = styleNames(styles);

const MultipleExport = ({
    exportTypes,
    extensionItems,
    formValues,
    onChange,
    isMultiple
}: ExportContentPropsType) => {
    const isDetailType = formValues && formValues.type === DETAIL_TYPE;
    const isXLSCSV = [XLS, CSV].indexOf(formValues && formValues.extension) !== -1;
    const exportTypesTranslated = exportTypes && exportTypes.map(item => ({
        ...item,
        label: translate(item.label),
        disabled: (item.value === LIST_TYPE && !isMultiple) || (item.value === DETAIL_TYPE && isXLSCSV)
    }));
    const extensionItemsTranslated = extensionItems && extensionItems.map(item => ({
        ...item,
        disabled: (!isMultiple || isDetailType) &&
            (item.label === CSV.toUpperCase() || item.label === XLS.toUpperCase())
    }));
    const isResetToPDF = isDetailType && ([PDF, RTF].indexOf(formValues && formValues.extension) === -1);

    if (isResetToPDF && isFunction(onChange)) {
        onChange('extension', PDF);
    }

    return (
        <form className={sn('export-form')}>
            <h4>{translate('modal.export.type')}</h4>
            <Fields.RadioGroup
                name="type"
                items={exportTypesTranslated}
            />
            <h4>{translate('modal.export.extension')}</h4>
            <Fields.RadioGroup
                name="extension"
                items={extensionItemsTranslated}
                horizontal
            />
            <span className={sn('export-form__content-toggle')}>
                <Fields.SmallToggle
                    name="split"
                    label={translate('modal.export.split-by-file')}
                    disabled={!isMultiple || !isDetailType || isXLSCSV}
                />
            </span>
        </form>
    );
};

export const ExportContent = ({
    isMultiple, extensionItems, exportTypes, formValues, onChange
}: ExportContentPropsType) => (
    MultipleExport({
        exportTypes,
        extensionItems,
        formValues,
        onChange,
        isMultiple
    })
);
