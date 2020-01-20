/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2018 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {isEmpty} from 'lodash';
import styleNames from '@vtb/services/style-names';
import {KEY_CODES} from '@vtb/services/utils';
import {Input} from '@vtb/fe-ui-input';
import {translate} from './../../../../utils/translate';
import styles from './styles.scss';
import {TargetEvent} from '../../../../common-types';

const sn = styleNames(styles);

type Props = {
    changeContext: (param?: {fullTextQuery?: string}) => void;
}

export function DictionaryScrollerInnSearch({changeContext}: Props) {
    const onStartSearch = (e: TargetEvent) => {
        if (e.keyCode === KEY_CODES.ENTER) {
            if (isEmpty(e.target.value)) {
                changeContext({});
            } else {
                changeContext({fullTextQuery: e.target.value});
            }
        }
    };

    return (
        <div className={sn('dictionary-scroller-inn-search')}>
            <Input
                placeholder={translate('filters.inn.placeholder')}
                onKeyUp={onStartSearch}
            />
        </div>
    );
}
