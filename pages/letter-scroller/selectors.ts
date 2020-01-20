/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {getFormValues} from 'redux-form';
import {get} from 'lodash';
import {FROM_BANK} from '../../modules/define-letter-direction';
import {LETTER_FILTER_FORM_NAME, LETTER_SCROLLER_NAME_TO_BANK} from './constants';
import {StoreType} from '../../store/root-selector';
import {RowType} from './flow-types';

type PropsType = {
    edocRefId: number;
    clientSnapshot: {
        id?: number;
    }
}

export const getCheckedRowsIdsArray = (rows: Array<RowType>) => rows.map((item: {id: string}) => item.id);
export const getCheckedRowsEdocRefIdsArray = (rows: Array<RowType>) => rows.map(
    ({edocRefId, clientSnapshot: {id: clientId}}: PropsType) => ({id: edocRefId, docTypeId: 1, clientId})
);
export const getCheckedRowsIds = (rows: Array<RowType>) => getCheckedRowsIdsArray(rows).join(',');
export const getFormValuesSelector = (state: StoreType) => getFormValues(LETTER_FILTER_FORM_NAME)(state);
export const getScrollerValuesSelector = (state: StoreType) => get(state, 'scroller[0]', LETTER_SCROLLER_NAME_TO_BANK);
export const getNewLetterFromBank = (isNew: boolean, letterDirection: string) => isNew && letterDirection === FROM_BANK;
