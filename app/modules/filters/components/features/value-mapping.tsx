/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {ComponentType, PureComponent} from 'react';
import {FormBinding} from './form-binding';
import {FilterTabItemType} from '../../../../pages/letter-scroller/common/filter/container';

type Props = {
    value: {
        [fieldName: string]: string
    };
    onChange: (filters: Object) => void;
    tab: {
        tabs: Array<FilterTabItemType>;
        active: string;
        onChange: (activeTab: string) => void;
    };
    tags: any;
    formComponent: ComponentType<any>;
    formOptions?: {
        form?: string;
    },
    setOverlayVisibility: () => void;
    SearcherView: ComponentType<any>;
}

export type NewFiltersType = {
    [fieldName: string]: string;
}

type ClearFilterType = {
    statuses: Array<string>;
    body: string;
    number: number;
    topic: string;
}

export class ValueMapping extends PureComponent<Props> {
    handleAdd = (fieldName: string, fieldValue: string) => {
        const {value, onChange} = this.props;
        const newFilters = {...value, [fieldName]: fieldValue};

        if (onChange) {
            onChange(newFilters);
        }
    };

    handleRemove = (fieldName: string) => {
        const {value, onChange} = this.props;
        const newFilters: NewFiltersType = {...value, [fieldName]: undefined};
        const clearFilter: ClearFilterType = {
            statuses: null,
            body: null,
            number: null,
            topic: null
        };

        if (onChange) {
            onChange(fieldName === 'clear-filter' ? clearFilter : newFilters);
        }
    };

    render() {
        return (
            <FormBinding {...this.props} onFilterAdd={this.handleAdd} onDeleteField={this.handleRemove} />
        );
    }
}

