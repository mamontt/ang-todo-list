/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {showModal} from '@vtb/fe-ui-dialog';
import {modalNameWithRootNamespace} from './../../../utils/modals';
import {ValidationModalParams} from './validation-popup';

export const VALIDATION_MODAL_NAME = modalNameWithRootNamespace('validation-modal');

export const showValidationModal = (extras: ValidationModalParams) => showModal(VALIDATION_MODAL_NAME, extras);
