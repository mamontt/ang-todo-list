/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {get, includes} from 'lodash';
import {formatDateToDDMMYYYY} from '@vtb/services/l10n';
import {QuickView} from '@vtb/fe-bi-quick-view';
import {Icons} from '@vtb/fe-ui-icon';
import {translate} from './../../../../../utils/translate';
import {QuickViewComponentProps} from '../../../../../pages/letter-scroller/flow-types';
import {getValueByCode} from './selector';
import {EMPLOYEE} from '../../../../../modules/user-context';
import {hiddenRecallIconStatuses} from './../../table/recall-cell';

export const NumberDateStatus = ({documentValues, recallAction, userContext}: QuickViewComponentProps) => {
    const getValueByCodeInDocument = (code: string) => getValueByCode(documentValues, code);
    const renderTitle = (text: string, isFavourite: boolean) => (
        <React.Fragment>
            {text} {isFavourite && <Icons.Favorites primary />}
        </React.Fragment>
    );
    const edocRefId = get(documentValues, 'edocRefId');
    const cancelReason = get(documentValues, 'cancelReq.reason');
    const cancelReqDocumentId = get(documentValues, 'cancelReq.id', null);
    const cancelBaseStatusName = get(documentValues, 'cancelReq.baseStatusName', translate('common.recall'));
    const cancelBaseStatus = get(documentValues, 'cancelReq.baseStatus', null);
    const showIcon = cancelReason && !includes(hiddenRecallIconStatuses, cancelBaseStatus);
    const buttons = [{
        iconType: Icons.Recall,
        onClick: () => recallAction && recallAction({
            id: cancelReqDocumentId,
            edocRefId,
            userRoleType: userContext.type === EMPLOYEE ? 'client' : 'bank',
            type: 'LETTER_TO_BANK'
        }),
        tooltipText: cancelBaseStatusName
    }];
    return (
        <QuickView.Header
            mainTitle={renderTitle(
                `№ ${getValueByCodeInDocument('documentNumber')} ${translate('common.from')} ${formatDateToDDMMYYYY(getValueByCodeInDocument('documentDate'))}`,
                documentValues.favourite
            )}
            status={getValueByCodeInDocument('status.name')}
            buttons={showIcon ? buttons : []}
        />
    );
};
