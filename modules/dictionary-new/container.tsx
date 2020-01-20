/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2018 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {connect} from 'react-redux';
import {AnyAction, bindActionCreators, Dispatch} from 'redux';
import {ModalForm, Grid} from '@vtb/fe-ui-grid';
import {Scrollbar} from '@vtb/fe-ui-scrollbar';
import {closeModal as closeModalAction} from '@vtb/fe-ui-dialog';
import styleNames from '@vtb/services/style-names';
import {translate} from './../../utils/translate';
import {getDictionaryUrl} from './urls';
import {DICTIONARY_DESCRIPTORS} from './dictionary-descriptors';
import {DictionaryScroller} from './dictionary-scroller';
import {actionFabrique} from './dictionary-scroller/action-fabrique';
import styles from './container.scss';
import {CLIENT_SEARCH} from './dictionary-names';
import {Column} from '../../common-types';

const sn = styleNames(styles);

type AdditionalFetchParams = {
    params?: {
        fullTextQuery?: string;
        page?: number;
        size?: number;
    };
}

type $Keys<O extends object> = keyof O;
type DictionaryType = {
    modalParams: {
        setDictionaryValues: () => void;
        filterItems?: () => void;
        filterItemsCount?: number;
        name: $Keys<typeof DICTIONARY_DESCRIPTORS>;
        getTableColumns: () => Array<Column>;
        multi?: boolean;
        fetchParams?: AdditionalFetchParams;
        pathAdapter?: () => string;
        queryParams?: {
            method: string;
        };
    };
    closeModal: () => void;
    destroy: () => void;
}

type DictionaryStateType = {
    additionalFetchParams: AdditionalFetchParams;
}

const mapDispatchToProps = (
    dispatch: Dispatch<AnyAction>,
    {modalParams: {name}}: DictionaryType
) => bindActionCreators({
    closeModal: closeModalAction,
    ...actionFabrique(getDictionaryUrl(
        DICTIONARY_DESCRIPTORS[name]
    ), DICTIONARY_DESCRIPTORS[name].dataPath)
}, dispatch);

class CommonDictionary extends React.Component <DictionaryType, DictionaryStateType> {
    state = {
        additionalFetchParams: {}
    };

    changeContext = (additionalFetchParams: AdditionalFetchParams) => {
        this.setState({additionalFetchParams});
    };

    render() {
        const {additionalFetchParams} = this.state;
        const {
            modalParams,
            modalParams: {
                name,
                setDictionaryValues,
                filterItems,
                filterItemsCount,
                fetchParams,
                pathAdapter,
                multi
            },
            closeModal,
            destroy
        } = this.props;

        const descriptor = DICTIONARY_DESCRIPTORS[name];

        const {
            title,
            dataPath,
            columns,
            col,
            rowIdFieldName,
            joinColumns
        } = descriptor;

        const dictionaryKey = JSON.stringify(additionalFetchParams);
        const params = {...fetchParams.params, ...additionalFetchParams};
        const resultFetchParams = {...fetchParams, params};
        const defaultWrapper = name === CLIENT_SEARCH || multi;

        return (
            <ModalForm.Catalog
                onClose={() => {
                    closeModal();
                    destroy();
                }}
                title={translate(title)}
                contentView={() => (
                    <Grid.Grid sticky>
                        {
                            defaultWrapper ? null : (
                                <Grid.Separator margin={Grid.MARGIN.M} />
                            )
                        }
                        <Grid.Row margin={Grid.MARGIN.ZERO}>
                            <Grid.Col sticky col={col || 9}>
                                <div className={sn(defaultWrapper ? 'dictionary-wrapper' : 'dictionary-wrapper-with-search')}>
                                    <Scrollbar>
                                        <DictionaryScroller
                                            {...modalParams}
                                            url={
                                                getDictionaryUrl(
                                                    descriptor,
                                                    pathAdapter
                                                )}
                                            dataPath={dataPath}
                                            setDictionaryValues={setDictionaryValues}
                                            getTableColumns={columns}
                                            filterItems={filterItems}
                                            filterItemsCount={filterItemsCount}
                                            fetchParams={resultFetchParams}
                                            rowIdFieldName={rowIdFieldName}
                                            joinColumns={joinColumns}
                                            changeContext={this.changeContext}
                                            key={dictionaryKey}
                                        />
                                    </Scrollbar>
                                </div>
                            </Grid.Col>
                        </Grid.Row>
                    </Grid.Grid>
                )}
            />
        );
    }
}

export const ConnectedCommonDictionary = connect(
    null,
    mapDispatchToProps
)(CommonDictionary);
