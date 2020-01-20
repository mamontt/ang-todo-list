/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {get} from 'lodash';
import {translate} from './utils/translate';
import {MDASH} from './constants/default-values';

type PropsType = {
    cancelEdocAdditionalFields: {
        letterType: {
            name: string;
        };
        topic: string;
        content: string;
    };
}

export const cancelRequestAdditionalForm = () => ({cancelEdocAdditionalFields}: PropsType) =>
    ([{
        title: translate('common.letterType'),
        value: get(cancelEdocAdditionalFields, ['letterType', 'name'], MDASH)
    }, {
        title: translate('common.subject'),
        value: get(cancelEdocAdditionalFields, ['topic'], MDASH)
    }, {
        title: translate('common.message'),
        value: get(cancelEdocAdditionalFields, ['content'], MDASH)
    }]);
