/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {SHOW_RIGHT} from '@vtb/fe-ui-dialog';
import {DICTIONARY_MODAL_NAME} from './constants';
import {ConnectedCommonDictionary} from './container';

export const DictionaryModal =
    {
        view: DICTIONARY_MODAL_NAME,
        type: SHOW_RIGHT,
        component: ConnectedCommonDictionary,
        closable: false,
        params: {
            width: 636
        }
    };

