/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2018 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {isEmpty, get} from 'lodash';
import {Grid} from '@vtb/fe-ui-grid';
import {formatDateToDDMMYYYY} from '@vtb/services/l10n';
import {Fields} from '@vtb/fe-ui-input';
import {Label} from '@vtb/fe-ui-label';
import {UserContext} from './../../../modules/user-context';
import {translate} from './../../../utils/translate';
import {LetterTypesDictionaryModal} from './../../../modules/dictionary-new/dictionary-modal/dictionary-modal';
import {LetterDirection} from '../../../modules/define-letter-direction';
import {Client, TargetEvent} from '../../../common-types';

type Props = {
    viewMode: boolean;
    userContext: UserContext;
    letterDirection: LetterDirection;
    clientSnapshot: Client;
    fetchDocumentNumber: (letterDirection: LetterDirection, clientSnapshot: Client) => void;
    setMyDocumentNumber: (value: boolean) => void;
    setNumber: (value: string) => void;
    isDisabledNumber: boolean;
    isNew: boolean;
    clients: Array<Client>;
    documentStatus: string;
    initialValues: {
        documentNumber: string;
    };
};

export const SystemInformation = ({
    userContext,
    viewMode,
    letterDirection,
    clientSnapshot,
    fetchDocumentNumber,
    setMyDocumentNumber,
    setNumber,
    isDisabledNumber,
    isNew,
    clients,
    documentStatus,
    initialValues
}: Props) => {
    const isDisabledStatus = documentStatus && documentStatus !== 'Новый' && documentStatus !== 'Черновик';
    const numbersOnly = (value: string) => value && value.replace(/[^\d]/g, '');
    const client = (isNew && clients) ? clients[0] : clientSnapshot;
    const handleBlur = ({target}: TargetEvent) => {
        if (isEmpty(target.value)) {
            setMyDocumentNumber(false);
            if (!initialValues || get(client, 'id') !== get(initialValues, 'clientSnapshot.id')) {
                fetchDocumentNumber(letterDirection, client);
            } else {
                Promise.resolve().then(() => setNumber(initialValues.documentNumber));
            }
        } else {
            setMyDocumentNumber(true);
        }
    };

    return (
        <Grid.Grid>
            <Grid.Row margin={Grid.MARGIN.M}>
                <Grid.Col col={3}>
                    <Label text="№" labelWidth="auto" alignMiddle withTooltip>
                        {/* 001 */}
                        <Fields.TextInput
                            name="documentNumber"
                            maxLength={10}
                            width={175}
                            onBlur={handleBlur}
                            normalize={numbersOnly}
                            disabled={isDisabledNumber || isDisabledStatus}
                        />
                    </Label>
                </Grid.Col>
                <Grid.Col col={3} sticky >
                    <Label text={translate('common.date')} labelWidth="auto" alignMiddle withTooltip>
                        {/* 002 */}
                        <Fields.DatePicker
                            width={130}
                            name="documentDate"
                            getDateInputValue={formatDateToDDMMYYYY}
                            disabled
                        />
                    </Label>
                </Grid.Col>
                {/* TODO [sf] 21.11.2017 a bit weird, fix when design will be in accordance with grid */}
                <Grid.Col col={7} sticky >
                    <Label text={translate('common.letterType')} labelWidth="auto" alignMiddle forId="dsfTypeDto">
                        {/* 003 */}
                        <LetterTypesDictionaryModal
                            id="dsfTypeDto"
                            name="dsfTypeDto"
                            letterDirection={letterDirection}
                        />
                    </Label>
                </Grid.Col>
            </Grid.Row>
            <Grid.Row />
        </Grid.Grid>
    );
};
