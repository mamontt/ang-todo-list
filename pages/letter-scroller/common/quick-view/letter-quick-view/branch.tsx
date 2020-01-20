/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {Fragment} from 'react';
import {get} from 'lodash';
import {PhoneText} from '@vtb/fe-ui-text';
import {QuickView} from '@vtb/fe-bi-quick-view';
import {translate} from './../../../../../utils/translate';
import {MDASH} from './../../../../../constants/default-values';
import {QuickViewComponentProps} from '../../../../../pages/letter-scroller/flow-types';
import {getValueByCode, getPhoneByCode} from './selector';
import {ResponsibleOfficerType} from '../../../../letter-page/actions';

const ResponsibleOfficer = ({getValue, getPhone}: ResponsibleOfficerType) => (
    <Fragment>
        <QuickView.Line label={translate('common.responsibleOfficer')}>
            <QuickView.SimpleValue>{getValue('bankResponsibleOfficer.name')}</QuickView.SimpleValue>
        </QuickView.Line>

        <QuickView.Line label={translate('common.phoneNumber')}>
            <QuickView.SimpleValue>
                {getPhone('bankResponsibleOfficer.phone') ?
                    <PhoneText
                        phone={getPhone('bankResponsibleOfficer.phone')}
                    />
                    : MDASH
                }
            </QuickView.SimpleValue>
        </QuickView.Line>
    </Fragment>
);

export const Branch = ({documentValues}: QuickViewComponentProps) => {
    const getValueByCodeInDocument = (code: string) => getValueByCode(documentValues, code);
    const getPhoneByCodeInDocument = (code: string) => getPhoneByCode(documentValues, code);
    const toBank = get(documentValues, 'toBank');

    return (
        <QuickView.Block title={translate(toBank === true ? 'common.receiver' : 'common.sender')}>
            <QuickView.Line label={translate('common.branch')}>
                <QuickView.SimpleValue>{getValueByCodeInDocument('branchSnapshot.shortName')}</QuickView.SimpleValue>
            </QuickView.Line>
            {!toBank && <ResponsibleOfficer getValue={getValueByCodeInDocument} getPhone={getPhoneByCodeInDocument} />}
        </QuickView.Block>
    );
};
