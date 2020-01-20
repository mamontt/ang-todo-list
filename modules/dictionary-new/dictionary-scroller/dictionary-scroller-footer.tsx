/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2018 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {Fragment} from 'react';
import styleNames from '@vtb/services/style-names';
import {Pagination} from '@vtb/fe-ui-pagination';
import {Button} from '@vtb/fe-ui-button';
import {Grid} from '@vtb/fe-ui-grid';
import {translate} from './../../../utils/translate';
import styles from './dictionary-scroller-footer.scss';
import {DictionaryScrollerFooterType} from '../flow-types';

const sn = styleNames(styles);

export const DictionaryScrollerFooter = (props: DictionaryScrollerFooterType) => {
    const {
        setDictionaryValues,
        activeRow,
        checkedRows,
        closeModal,
        multi,
        pagination
    } = props;

    const submitBtn = {
        onClick: () => {
            setDictionaryValues(multi ? checkedRows : activeRow);
            closeModal();
        },
        title: 'buttons.choose',
        disabled: multi && checkedRows ? checkedRows.length === 0 : !activeRow
    };

    return (
        <Fragment>
            <Grid.Separator />
            <div className={sn('dictionary-footer dictionary-footer_with-pagination')}>
                <Button.Submit onClick={submitBtn.onClick} disabled={submitBtn.disabled}>
                    {translate(submitBtn.title)}
                </Button.Submit>
                {
                    pagination &&
                    <Pagination.Pagination
                        page={pagination.page + 1}
                        totalItems={pagination.totalRecords || 0}
                        itemsPerPage={pagination.itemsPerPage}
                        onChangePage={(nextPage: number) => pagination.onChangePage(nextPage)}
                        onChangeItemsPerPage={pagination.onChangeItemsPerPage}
                    />
                }
            </div>
        </Fragment>
    );
};
