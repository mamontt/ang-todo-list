/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {showModal} from '@vtb/fe-ui-dialog';
import {modalNameWithRootNamespace} from './../../utils/modals';
import {ShowExportModalType} from './export-popup';

export const EXPORT_MODAL_NAME = modalNameWithRootNamespace('export');
export const showExportModal = (props: ShowExportModalType) => (showModal(EXPORT_MODAL_NAME, {...props}));
