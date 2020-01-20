/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {get} from 'lodash';
import {PhoneText} from '@vtb/fe-ui-text';
import {QuickView} from '@vtb/fe-bi-quick-view';
import {translate} from './../../../../../utils/translate';
import {MDASH} from './../../../../../constants/default-values';
import {QuickViewComponentProps} from '../../../../../pages/letter-scroller/flow-types';
import {getValueByCode, getPhoneByCode} from './selector';

export const Client = ({documentValues}: QuickViewComponentProps) => {
    const getValueByCodeInDocument = (code: string) => getValueByCode(documentValues, code);
    const getPhoneByCodeInDocument = (code: string) => getPhoneByCode(documentValues, code);

    const toBank = get(documentValues, 'toBank');

    return (
        <QuickView.Block title={translate(toBank === true ? 'common.sender' : 'common.receiver')}>

            <QuickView.Line label={translate('common.client')}>
                <QuickView.SimpleValue>{getValueByCodeInDocument('clientSnapshot.shortName')}</QuickView.SimpleValue>
            </QuickView.Line>

            <QuickView.Line label={translate('common.responsibleOfficer')}>
                <QuickView.SimpleValue>{getValueByCodeInDocument('clientResponsibleOfficer.name')}</QuickView.SimpleValue>
            </QuickView.Line>

            {toBank && (
                <QuickView.Line label={translate('common.phoneNumber')}>
                    <QuickView.SimpleValue>
                        {getPhoneByCodeInDocument('clientResponsibleOfficer.phone') ?
                            <PhoneText
                                phone={getPhoneByCodeInDocument('clientResponsibleOfficer.phone')}
                            />
                            : MDASH
                        }
                    </QuickView.SimpleValue>
                </QuickView.Line>
            )}

        </QuickView.Block>
    );
};
