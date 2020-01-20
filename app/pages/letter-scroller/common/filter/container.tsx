/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {Component, ComponentType} from 'react';
import {connect} from 'react-redux';
import {Scroller} from '@vtb/fe-ui-table';
import {ValueMapping} from './../../../../modules/filters/components/features/value-mapping';
import {fetchCounter as documentStackCounter} from './../../../../modules/documents-required-attention-counter/actions';
import {LETTER_DEFAULT_ACTIVE_TAB} from '../../../../pages/letter-scroller/constants';
import {FilterForm, config as formConfig, filtersToForm, formToFilters, FiltersForm, FiltersType} from './form';
import {getFilterTabItem, mergeFilters} from './utils';
import {getTags} from './tags';
import {LetterDirection} from '../../../../modules/define-letter-direction';
import {UserType} from '../../../../modules/user-context';
import {Row} from '../table/recall-cell/row-type';
import {Actions} from '../footer/container';
import {ResourceType} from '../../../../modules/resource';
import {FormCounterparts} from '../../official/scroller-parts/filter/from-bank/filter-options';
import {StoreType} from '../../../../store/root-selector';

export type FilterViewProps = {
    filters?: FiltersType;
    setFilters?: (filters: FiltersType, dictionaryName?: string) => void;
    setCheckedRows?: (row: Row | undefined[]) => void;
    documentStackCounter?: () => void;
    filterCounters?: {[key: string]: number};
    setOverlayVisibility?: () => void;
}

export type FilterTabItemType = {
    query?: string;
    name?: string;
    badgeSpecial: boolean;
    id: string;
    title: string;
    badge: boolean;
}

type FilterViewState = {
    activeTab: string;
    formFilters: FiltersForm;
}

type FormCounterparts = {
    branch?: string;
    client?: string;
}

const {getLoadingState, getFilters, getFilterCounters} = Scroller.selectors;

export interface GetCommonFilterViewParams {
    scrollerName: string;
    actions: Actions;
    resource: ResourceType;
    tabs: Array<Object>;
    statusItems: any;
    formCounterparts: FormCounterparts;
    SearcherView?: ComponentType<any>;
    letterDirection: LetterDirection;
    userContext: UserType;
}

export const getCommonFilterView = ({
    scrollerName,
    actions,
    resource,
    tabs,
    statusItems = [],
    formCounterparts = {},
    SearcherView,
    letterDirection,
    userContext
}: GetCommonFilterViewParams) => {
    class FilterView extends Component<FilterViewProps, FilterViewState> {
        static getDerivedStateFromProps(props: FilterViewProps, state: FilterViewState) {
            const activeTab = props.filters.statusCategory || (state ? state.activeTab : LETTER_DEFAULT_ACTIVE_TAB);
            return {
                activeTab,
                formFilters: state ? state.formFilters : filtersToForm(props.filters)
            };
        }

        updateFilters = () => {
            this.props.setFilters(mergeFilters(formToFilters(this.state.formFilters), this.state.activeTab));
            this.props.documentStackCounter();
            this.props.setCheckedRows([]);
        };

        handleStatusCategoryChange = (activeTab: string) => this.setState({activeTab}, this.updateFilters);

        handleFiltersChange = (formFilters: FiltersForm) => this.setState({formFilters}, this.updateFilters);

        formComponent = FilterForm.bind(null, statusItems, formCounterparts, letterDirection, userContext);

        render() {
            const {filterCounters, setOverlayVisibility} = this.props;
            const currentTab = {
                tabs: tabs.map((filterTabItem: FilterTabItemType) => getFilterTabItem(filterTabItem, filterCounters)),
                active: this.state.activeTab,
                onChange: this.handleStatusCategoryChange
            };
            const tags = getTags();

            return (
                <ValueMapping
                    tab={currentTab}
                    tags={tags}
                    value={this.state.formFilters}
                    onChange={this.handleFiltersChange}
                    formComponent={this.formComponent}
                    formOptions={formConfig}
                    setOverlayVisibility={setOverlayVisibility}
                    SearcherView={SearcherView}
                />
            );
        }
    }

    return connect(
        (state: StoreType) => ({
            isLoading: getLoadingState(state, scrollerName),
            filters: getFilters(state, scrollerName),
            filterCounters: getFilterCounters(state, scrollerName),
            resource
        }),
        {...actions, documentStackCounter},
    )(FilterView);
};
