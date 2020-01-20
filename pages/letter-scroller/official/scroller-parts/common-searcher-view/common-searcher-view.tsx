/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {Component} from 'react';
import {connect} from 'react-redux';
import {change as formChange, initialize as formInitialize} from 'redux-form';
import {get, isEmpty} from 'lodash';
import {Input} from '@vtb/fe-ui-input';
import {Searcher, SearchToggle} from '@vtb/fe-bi-searcher';
import {Scroller} from '@vtb/fe-ui-table';
import {
    getDictionaryClients,
    getDictionaryClientGroups,
    CLIENTS,
    CLIENT_GROUPS,
    putDictionaryToStore,
    ClientType
} from './../../../../../modules/dictionary-new';
import {StoreType} from './../../../../../store/root-selector';
import {translate} from '../../../../../utils/translate';
import {searcherDataFormatter, SearcherField} from './utils';
import {LETTER_PAGE_NAME} from '../../../../letter-page';

type Filters = {
    clientId?: number;
    statusCategory: {
        hide: boolean;
    };
}

type searcherPropType = {
    searchTypes?: Array<SearcherField>;
    searchGroups?: Array<SearcherField>;
    setFilters?: (filters: Filters) => void;
    putDictionary?: Function;
    clients?: Array<ClientType>;
    clientGroup?: Array<ClientType>;
    change?: (formName: string, fieldName: string, defaultValue?: any) => void;
    initialize?: (pageName: string, defaultValue: any) => void;
    filters: Filters;
};

type searcherStateType = {
    currentValue: string;
    currentSearchType: string;
    checked: boolean;
}

type commonSearcher = {
    actions: {
        setFilters: (filters: Filters) => void;
    };
    searcherFields: Array<SearcherField>;
    searcherGroups: Array<SearcherField>;
    scrollerName: string;
};

export const getCommonSearcher = (
    {
        actions,
        searcherFields,
        searcherGroups,
        scrollerName
    }: commonSearcher
) => {
    class SearcherComponent extends Component<searcherPropType, searcherStateType> {
        state = {
            currentSearchType: 'id',
            currentValue: '',
            checked: false
        };

        componentDidMount() {
            const {putDictionary} = this.props;
            putDictionary({
                name: CLIENTS
            });
            putDictionary({
                name: CLIENT_GROUPS
            });
        }

        onChange = ({currentValue, currentSearchType}: searcherStateType) => {
            const {currentValue: value, checked} = this.state;

            if (currentValue === value) {
                this.setState({
                    currentSearchType
                });
                return;
            }

            const {
                setFilters,
                initialize,
                filters
            } = this.props;
            const statusCategory = get(filters, 'statusCategory', null);
            this.setState({
                currentValue,
                currentSearchType
            });
            if (currentValue) {
                const {
                    clients,
                    clientGroup,
                    change
                } = this.props;
                const newClients = checked ? clientGroup : clients;
                const element = newClients.find(({id}) => id === Number(currentValue));
                setFilters({
                    ...filters,
                    clientId: element.id
                });
                initialize(LETTER_PAGE_NAME, {});
                change(LETTER_PAGE_NAME, 'clientId', element.id);
            } else if (isEmpty(currentValue)) {
                initialize(LETTER_PAGE_NAME, {});
                setFilters({statusCategory});
            }
        };

        changeToggle = (toggle: boolean) => {
            const {setFilters, filters} = this.props;
            this.setState({
                checked: toggle,
                currentSearchType: '',
                currentValue: ''
            });
            setFilters(filters);
        };

        render() {
            const {currentSearchType, currentValue, checked} = this.state;
            const {clients, clientGroup} = this.props;
            const searchTypes = checked ? searcherGroups : searcherFields;
            const newClients = checked ? clientGroup : clients;
            const currentType = currentSearchType || 'id';
            return (
                <React.Fragment>
                    <Searcher
                        searchTypes={searcherDataFormatter(searchTypes, newClients)}
                        currentSearchType={currentType}
                        currentValue={currentValue}
                        onChange={this.onChange}
                        symbolsToSearch={0}
                    />
                    <SearchToggle
                        label={translate('search.groupsСompanies')}
                        onChange={this.changeToggle}
                        value={checked}
                    />
                </React.Fragment>
            );
        }
    }

    return connect(
        (state: StoreType) => ({
            clients: getDictionaryClients(state),
            clientGroup: getDictionaryClientGroups(state),
            filters: Scroller.selectors.getFilters(state, scrollerName)
        }),
        {
            setFilters: actions.setFilters,
            putDictionary: putDictionaryToStore,
            initialize: formInitialize,
            change: formChange
        }
    )<any>(SearcherComponent);
};
