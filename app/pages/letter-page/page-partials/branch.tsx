/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {Fragment} from 'react';
import {isObject} from 'lodash';
import {Fields} from '@vtb/fe-ui-input';
import {Label} from '@vtb/fe-ui-label';
import {Grid} from '@vtb/fe-ui-grid';
import {translate} from '../../../utils/translate';
import {EMPLOYEE} from '../../../modules/user-context';
import {Text} from '../../../components/text';
import {BranchesDictionaryModal, fetchOfficials} from '../../../modules/dictionary-new/dictionary-modal/dictionary-modal';
import {LetterDirection, FROM_BANK} from '../../../modules/define-letter-direction';
import {OfficialsDictionaryModal} from '../../../modules/dictionary-new/dictionary-modal/dictionary-modal';

const getBranchTitle = (letterDirection: LetterDirection) =>
    translate(letterDirection === FROM_BANK ? 'common.sender' : 'common.receiver');

type Props = {
    letterDirection: LetterDirection;
    branchId: number;
    presetResponsibleOfficerPhone: (field: string) => void;
    userType: string;
    viewMode: boolean;
    documentStatus: string;
}

export const Branch = ({
    letterDirection,
    branchId,
    presetResponsibleOfficerPhone,
    userType,
    viewMode,
    documentStatus
}: Props) => (
    <Grid.Grid>
        <Grid.Row margin={Grid.MARGIN.L}>
            <Text formHeader>{getBranchTitle(letterDirection)}</Text>
        </Grid.Row>
        <Grid.Row>
            <Grid.Col col={3}>
                <Label text={translate('common.branch')} forId="branchSnapshot" />
            </Grid.Col>
            <Grid.Col col={8}>
                <BranchesDictionaryModal id="branchSnapshot" name="branchSnapshot" />
            </Grid.Col>
        </Grid.Row>
        {letterDirection === FROM_BANK && (
            <Fragment>
                <Grid.Row>
                    <Grid.Col col={3}>
                        <Label text={translate('common.responsibleOfficer')} forId="bankResponsibleOfficer" />
                    </Grid.Col>
                    <Grid.Col col={8}>
                        <OfficialsDictionaryModal
                            id="bankResponsibleOfficer"
                            name="bankResponsibleOfficer"
                            branchId={branchId}
                            normalize={(value: any) => {
                                const {fio = '', phone = null} = value || {};
                                if (!phone) {
                                    return value;
                                }
                                const onlyNumbers = isObject(phone) ? (phone.phoneNumber || '') :
                                    phone.replace(/[^\d]/g, '');
                                const phoneNumber = onlyNumbers && onlyNumbers.slice(-10);
                                const phoneCode = isObject(phone) ? (phone.phoneCode || '7') :
                                    (onlyNumbers && onlyNumbers.replace(phoneNumber, '')) || '7';
                                return {
                                    ...value,
                                    name: fio,
                                    phone: {
                                        phoneCode,
                                        phoneNumber
                                    }
                                };
                            }}
                        />
                    </Grid.Col>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Col col={3}>
                        <Label text={translate('common.phoneNumber')} forId="bankResponsibleOfficer.phone" />
                    </Grid.Col>
                    {/* 007 */}
                    <Grid.Col col={8}>
                        <Fields.Phone
                            name="bankResponsibleOfficer.phone"
                            forLabelId="bankResponsibleOfficer.phone"
                            disabled={(userType === EMPLOYEE || viewMode) && !!documentStatus}
                        />
                    </Grid.Col>
                </Grid.Row>
            </Fragment>
        )}
    </Grid.Grid>
);
