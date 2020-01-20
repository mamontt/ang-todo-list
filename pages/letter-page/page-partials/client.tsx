/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {get} from 'lodash';
import {Fields} from '@vtb/fe-ui-input';
import {Label} from '@vtb/fe-ui-label';
import {Grid} from '@vtb/fe-ui-grid';
import {AUTHORIZED_PERSON_MODAL_NAME_LEGACY} from '@vtb/fe-bi-dictionary';
import {OFFICIAL} from './../../../modules/user-context';
import {GET} from '../../../constants/request-types';
import {CatalogedInput} from './../../../components/cataloged-input';
import {translate} from './../../../utils/translate';
import {DictionaryField, CLIENT_SEARCH} from './../../../modules/dictionary-new';
import {LetterDirection, FROM_BANK, TO_BANK} from './../../../modules/define-letter-direction';
import {Text} from './../../../components/text';
import {LETTER_PAGE_NAME} from '../letter-page-constants';
import {fetchItems} from './fetch-client-employees-items';
import {RESPONSIBLE_OFFICER_MAX_LENGTH} from './constants';
import {getNewLetterFromBank} from '../../letter-scroller/selectors';
import {Branch} from '../../../common-types';

const getClientTitle = (letterDirection: LetterDirection) =>
    translate((letterDirection === FROM_BANK ? 'common.receiver' : 'common.sender'));

const getBranchId = (branchSnapshot: Branch) => get(branchSnapshot, 'id', null);

type Props = {
    letterDirection: LetterDirection;
    isNew: boolean;
    branchSnapshot: Branch;
    isVTB?: boolean;
    clientId: number;
    clearResponsibleOfficer: (field: string) => void;
    presetResponsibleOfficerPhone: (field: string) => void;
    userType: string;
    viewMode: boolean;
    moreOneClient: boolean;
    documentStatus: string;
}

export const Client = ({
    letterDirection,
    isNew,
    branchSnapshot,
    isVTB,
    clientId,
    clearResponsibleOfficer,
    presetResponsibleOfficerPhone,
    userType,
    viewMode,
    moreOneClient,
    documentStatus
}: Props) => {
    const isNewLetterFromBank = getNewLetterFromBank(isNew, letterDirection);
    const branchId = isVTB ? null : getBranchId(branchSnapshot);
    return (
        <Grid.Grid>
            <Grid.Row margin={Grid.MARGIN.L}>
                <Text formHeader>{getClientTitle(letterDirection)}</Text>
            </Grid.Row>
            <Grid.Row>
                <Grid.Col col={3}>
                    <Label text={translate('common.client')} forId="client" />
                </Grid.Col>
                <Grid.Col col={8}>
                    <DictionaryField
                        id="client"
                        name={isNewLetterFromBank ? 'clients' : 'clientSnapshot'}
                        dictionaryName={CLIENT_SEARCH}
                        fetchParams={{
                            method: GET,
                            params: {
                                ...branchId ? {branchId} : null
                            }
                        }}
                        multi={isNewLetterFromBank}
                        onChange={clearResponsibleOfficer}
                    />
                </Grid.Col>
            </Grid.Row>
            <Grid.Row>
                <Grid.Col col={3}>
                    <Label text={translate('common.responsibleOfficer')} forId="clientResponsibleOfficer.name" />
                </Grid.Col>
                <Grid.Col col={8}>
                    {/* 006 */}
                    {letterDirection === TO_BANK ?
                        <CatalogedInput
                            forLabelId="clientResponsibleOfficer.name"
                            form={LETTER_PAGE_NAME}
                            name="clientResponsibleOfficer.name"
                            displayValue="fullName"
                            fetch={fetchItems(clientId)}
                            modalName={AUTHORIZED_PERSON_MODAL_NAME_LEGACY}
                            filters={{clientId}}
                            onChange={letterDirection === TO_BANK && presetResponsibleOfficerPhone}
                            maxLength={RESPONSIBLE_OFFICER_MAX_LENGTH}
                            disabled={(isNewLetterFromBank && moreOneClient) || (viewMode && !!documentStatus)}
                        />
                        :
                        <Fields.TextInput
                            forLabelId="clientResponsibleOfficer.name"
                            name="clientResponsibleOfficer.name"
                            maxLength={RESPONSIBLE_OFFICER_MAX_LENGTH}
                        />
                    }
                </Grid.Col>
            </Grid.Row>
            {letterDirection === TO_BANK && (
                <Grid.Row>
                    <Grid.Col col={3}>
                        <Label text={translate('common.phoneNumber')} forId="clientResponsibleOfficer.phone" />
                    </Grid.Col>
                    {/* 007 */}
                    <Grid.Col col={8}>
                        <Fields.Phone
                            forLabelId="clientResponsibleOfficer.phone"
                            name="clientResponsibleOfficer.phone"
                            disabled={(userType === OFFICIAL || viewMode) && !!documentStatus}
                        />
                    </Grid.Col>
                </Grid.Row>
            )}
        </Grid.Grid>
    );
};
