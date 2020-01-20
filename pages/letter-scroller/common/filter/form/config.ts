/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {get} from 'lodash';
import {change} from 'redux-form';
import {AnyAction, Dispatch} from 'redux';
import {formatDateToShortISO} from '@vtb/services/l10n';
import {LETTER_FILTER_FORM_NAME} from '../../../../../pages/letter-scroller/constants';
import {FilterType} from '../../../../../pages/letter-scroller/flow-types';

const fieldChanged = (values: FilterType, prev: Props, fieldName: string) =>
    get(values, fieldName, null) !== get(prev, fieldName, null);

const presetChanged = (values: FilterType, prev: Props) => fieldChanged(values, prev, 'preset');

const periodChanged = (values: FilterType, prev: Props) =>
    fieldChanged(values, prev, 'period[0]') || fieldChanged(values, prev, 'period[1]');

const form = LETTER_FILTER_FORM_NAME;

const currentDate = () => formatDateToShortISO(new Date());

const prevWeek = () => formatDateToShortISO(new Date(+Date.now() - (24 * 60 * 60 * 6 * 1000)));

const prevMonth = () => {
    const today = new Date();
    return formatDateToShortISO(new Date(today.getFullYear(), today.getMonth() - 1, today.getDate() + 2));
};

const getPreset = (preset: Array<string>) => {
    switch (get(preset, '0')) {
        case 'month':
            return [prevMonth(), currentDate()];
        case 'week':
            return [prevWeek(), currentDate()];
        case 'day':
            return [currentDate(), currentDate()];
        default:
            return [null, null];
    }
};

type Props = Object;
type Param = (values:FilterType, dispatch:Dispatch<AnyAction>, props:Props, prev:Props) => void;

type TriggersType = {
    current: string;
    except: number;
    preset: Param;
    period: Param;
    any: Param;
    [method: string]: any;
};

const triggers: TriggersType = {
    current: 'any',
    except: NaN,
    preset(values: FilterType, dispatch: Dispatch<AnyAction>, props: Props, prev: Props) {
        if (presetChanged(values, prev) && this.except !== values.preset) {
            this.except = getPreset(values.preset);
            dispatch(change(form, 'period', this.except));
            this.current = 'period';
        }
    },
    period(values: FilterType, dispatch: Dispatch<AnyAction>, props: Props, prev: Props) {
        if (presetChanged(values, prev)) {
            this.except = getPreset(values.preset);
            dispatch(change(form, 'period', this.except));
            return;
        }
        if (periodChanged(values, prev) && this.except !== values.period) {
            this.except = null;
            dispatch(change(form, 'preset', this.except));
            this.current = 'preset';
        }
    },
    any(values: FilterType, dispatch: Dispatch<AnyAction>, props: Props, prev: Props) {
        this.preset(values, dispatch, props, prev);
        this.period(values, dispatch, props, prev);
    }
};

export const config = {
    form,
    onChange(values: FilterType, dispatch: Dispatch<AnyAction>, props: Props, prev: Props) {
        triggers[triggers.current](values, dispatch, props, prev);
    }
};
