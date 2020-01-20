/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2018 VTB Group. All rights reserved.
 */
import * as React from 'react';
import styleNames from '@vtb/services/style-names';
import {Pagination} from '@vtb/fe-ui-pagination';
import {Button} from '@vtb/fe-ui-button';
import {translate} from './../../utils/translate';
import styles from './footer-view.scss';
import {FooterViewType} from './flow-types';

const sn = styleNames(styles);

export const FooterWithPagination = ({submitButton, pagination}: FooterViewType) => (
    <div className={sn('footer footer__with-pagination')}>
        <Button.Submit onClick={submitButton.onClick} disabled={submitButton.disabled}>
            {translate(submitButton.title)}
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
);
