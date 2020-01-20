/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2018 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {PureComponent} from 'react';
import {connect} from 'react-redux';
import {AnyAction, bindActionCreators, Dispatch} from 'redux';
import styleNames from '@vtb/services/style-names';
import {Grid} from '@vtb/fe-ui-grid';
import {Input} from '@vtb/fe-ui-input';
import {translate} from '../../../../utils/translate';
import {getFilters} from '../../selectors';
import {actionFabrique} from '../action-fabrique';
import {OwnPropsType} from '../index';
import styles from './styles.scss';
import {StoreType} from '../../../../store/root-selector';
import {TargetEvent} from '../../../../common-types';

const sn = styleNames(styles);

type FiltersType = {
    [searchQueryField: string]: string;
}

export type SearchBlockPropType = {
    filters: FiltersType;
    setFilters: (filters: FiltersType, dictionaryName: string) => void;
    dictionaryName: string;
    searchQueryField: string;
}

export type SearchBlockStateType = {
    search: string;
}

class DictionaryScrollerSearch extends PureComponent <SearchBlockPropType, SearchBlockStateType> {
    static getDerivedStateFromProps(nextProps: SearchBlockPropType) {
        const {searchQueryField} = nextProps;
        return { search: nextProps.filters[searchQueryField] };
    }
    state = {
        search: ''
    };

    onChangeSearch = (e: TargetEvent) => {
        this.setState({
            search: e ? e.target.value : '' // "e" can be empty string, if 'clear' button was clicked in the component
        });
        this.search();
    };
    timeout: NodeJS.Timeout;

    search = () => {
        const {searchQueryField} = this.props;
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        this.timeout = setTimeout(() => {
            const filters = {...this.props.filters};

            if (this.state.search) {
                filters[searchQueryField] = this.state.search;
            } else {
                filters[searchQueryField] = '';
            }

            this.props.setFilters(filters, this.props.dictionaryName);
        }, 400);
    };

    render() {
        return (
            <div className={sn('dictionary-scroller-search')}>
                <Grid.Grid>
                    <Grid.Row>
                        <Grid.Col sticky col={8}>
                            <Input
                                placeholder={translate('filters.placeholder')}
                                value={this.state.search}
                                onChange={this.onChangeSearch}
                            />
                        </Grid.Col>
                    </Grid.Row>
                </Grid.Grid>
            </div>
        );
    }
}

const mapStateToProps = (state: StoreType) => ({
    filters: getFilters(state) // TODO use common selector
});
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>, ownProps: OwnPropsType) => bindActionCreators({
    ...actionFabrique(ownProps.url, ownProps.dataPath)
}, dispatch);

export const ConnectedDictionaryScrollerSearch = connect(
    mapStateToProps,
    mapDispatchToProps
)(DictionaryScrollerSearch);
