/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2018 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {Component} from 'react';
import {connect} from 'react-redux';
import {initialize as formInitialize} from 'redux-form';
import {isEmpty} from 'lodash';
import {Grid} from '@vtb/fe-ui-grid';
import {Select} from '@vtb/fe-ui-select';
import {Label} from '@vtb/fe-ui-label';
import {Icons} from '@vtb/fe-ui-icon';
import {Button} from '@vtb/fe-ui-button';
import {userIdSelector} from '@vtb/services/auth';
import {translate} from './../../../../../utils/translate';

import {openCreateTemplate as openCreateTemplateAction} from './../../../../../modules/templates';
import {getFilters, putFilter, deleteFilter} from './../../../../../api/scroller-filters';
import {getFormValuesSelector, getScrollerValuesSelector} from '../../../../../pages/letter-scroller/selectors';
import {LETTER_FILTER_FORM_NAME} from '../../../../../pages/letter-scroller/constants';
import {
    TEMPLATE_NOTIFICATION_DELETED,
    TEMPLATE_NOTIFICATION_FAILURE,
    TEMPLATE_NOTIFICATION_SUCCESS,
    TEMPLATE_SAVE_IMPOSSIBLE
} from './../../../../../modules/templates/notifications';
import {StoreType} from '../../../../../store/root-selector';
import {FiltersForm, FiltersType} from './convertor';
import {TemplateType} from '../../../../../modules/templates/flow-types';

type SavedFiltersPropType = {
    userId: string;
    formValues: FiltersForm;
    openCreateTemplate: typeof openCreateTemplateAction;
    initialize: typeof formInitialize;
    scrollerName: string;
    form: string;
    disableFindDoubleFilter?: boolean;
}

type SavedFiltersStateType = {
    filters: Array<FiltersType>;
    filterId?: number | string;
}

const defaultFilters: Array<Object> = [];

class SavedFiltersClass extends Component<SavedFiltersPropType, SavedFiltersStateType> {
    state = {
        filters: defaultFilters,
        filterId: ''
    };

    componentDidMount() {
        this.updateFiltersList();
    }

    updateFiltersList = () => getFilters(this.props.userId, this.props.scrollerName)
        .then(filters => {
            this.setState(() => ({filters}));
            return filters;
        })
        .catch(err => err);

    applyTemplate = (filterId: string) => {
        const selectFilter: {form?: string} = this.state.filters.find((filter: {id: string}) => filterId === filter.id);
        const {initialize, form} = this.props;
        initialize(form, selectFilter ? selectFilter.form : {});
        this.setState(() => ({filterId}));
    };

    deleteTemplate = ({value: id}: {value: number}) => {
        const {userId, scrollerName} = this.props;
        deleteFilter(userId, scrollerName, {id}).then(this.updateFiltersList);
    };

    handleClick = () => {
        const {
            openCreateTemplate,
            userId,
            formValues,
            scrollerName,
            disableFindDoubleFilter
        } = this.props;
        const {...ommitedFormValues} = formValues || {};

        openCreateTemplate({
            title: 'filters.form.save-filter',
            notifications: {
                success: TEMPLATE_NOTIFICATION_SUCCESS,
                failure: TEMPLATE_NOTIFICATION_FAILURE,
                deleted: TEMPLATE_NOTIFICATION_DELETED,
                impossible: TEMPLATE_SAVE_IMPOSSIBLE
            },
            form: {...ommitedFormValues},
            findTemplateAction:
                () => (disableFindDoubleFilter
                    ? Promise.resolve([])
                    : getFilters(userId, scrollerName, {...ommitedFormValues})),
            createTemplateAction: (name: string, form: string) =>
                putFilter(userId, scrollerName, {
                    name,
                    form
                })
                    .then((template: TemplateType) => {
                        this.updateFiltersList();
                        return template;
                    }),
            updateTemplateAction: (template: TemplateType, name: string, form: string) =>
                putFilter(userId, scrollerName, {
                    id: template.id,
                    name,
                    form
                })
                    .then((updatedTemplate: TemplateType) => {
                        this.updateFiltersList();
                        return updatedTemplate;
                    }),
            deleteTemplateAction: (template: TemplateType) =>
                getFilters(userId, scrollerName, {...ommitedFormValues})
                    .then(result => {
                        if (!isEmpty(result)) {
                            deleteFilter(userId, scrollerName, {id: template.id})
                                .then(this.updateFiltersList);
                        }
                        return result;
                    }),
            updateFieldsTip: () => translate('template.update-filter-comment')
        });
    };

    deleteAction = {
        handler: this.deleteTemplate,
        component: () => <Icons.Delete />
    };

    render() {
        const {filters, filterId} = this.state;
        const items = filters.map((filter: {id: number, name: string}) => ({
            value: filter.id,
            title: filter.name
        }));
        return (
            <Grid.Row vAlign={Grid.VERTICAL_ALIGN.MIDDLE} margin={Grid.MARGIN.ZERO}>
                <Grid.Col col={2}>
                    <Label text={translate('filters.form.savedFilters')} labelWidth="auto" />
                </Grid.Col>
                <Grid.Col col={5}>
                    <Select.Action
                        {...this.props}
                        emptyOption
                        items={items}
                        placeholder={translate('filters.form.choose-filters')}
                        value={filterId}
                        onChange={this.applyTemplate}
                        action={this.deleteAction}
                    />
                </Grid.Col>
                <Grid.Col col={2} vAlign={Grid.VERTICAL_ALIGN.TOP}>
                    <Button.SmallIcon
                        text={translate('filters.form.saveFilter')}
                        icon={Icons.Add}
                        onClick={this.handleClick}
                    />
                </Grid.Col>
            </Grid.Row>
        );
    }
}

export const SavedFilters = connect(
    (state: StoreType) => ({
        userId: userIdSelector(state),
        formValues: getFormValuesSelector(state),
        form: LETTER_FILTER_FORM_NAME,
        scrollerName: getScrollerValuesSelector(state)
    }),
    {
        openCreateTemplate: openCreateTemplateAction,
        initialize: formInitialize
    }
)<any>(SavedFiltersClass);
