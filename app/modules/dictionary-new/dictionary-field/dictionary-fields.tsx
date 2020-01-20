/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2018 VTB Group. All rights reserved.
 */
import {Fields} from '@vtb/fe-ui-input';
import {DictionaryInput} from './dictionary-input';
import {DictionarySelect} from './dictionary-select';

export const DictionaryField = Fields.createField(DictionaryInput);
export const DictionaryFieldSelect = Fields.createField(DictionarySelect);
