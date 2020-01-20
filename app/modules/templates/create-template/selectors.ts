/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2018 VTB Group. All rights reserved.
 */
import {formValueSelector} from 'redux-form';
import {FORM_TEMPLATE_CREATE} from './../../../constants/forms';
import {TemplateType} from '../flow-types';
import * as FIELD from './fields';
import {TRUE} from '../constants';
import {StoreType} from '../../../store/root-selector';

const templateValueSelector = formValueSelector(FORM_TEMPLATE_CREATE);

export const getIsUpdate = (state: StoreType): boolean => templateValueSelector(state, FIELD.update) === TRUE;
export const getUpdateValue = (state: StoreType): boolean => templateValueSelector(state, FIELD.update);
export const getName = (state: StoreType): string => templateValueSelector(state, FIELD.name);
export const getTemplate = (state: StoreType): TemplateType => templateValueSelector(state, FIELD.template);
