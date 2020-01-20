/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {PureComponent} from 'react';
import {Fields} from '@vtb/fe-ui-input';
import {DictionaryModalName} from '@vtb/fe-bi-dictionary';
import request from '@vtb/services/request';
import {GET} from '../../../constants/request-types-big';
import {fetchDictionaryItems} from '../../../pages/letter-page/page-partials/fetch-client-employees-items';
import {
    DICTIONARY_CLIENTS_URL,
    DICTIONARY_BRANCHES_URL,
    DICTIONARY_LETTER_TYPE_URL,
    DICTIONARY_OFFICIALS_URL,
    DICTIONARY_CLIENT_OFFICIALS_URL
} from '../../../api/dictionaries';
import {LetterTypeToBankModal, LetterTypeFromBankModal} from '../../../modules/dictionary-new/letter-type-dictionary';
import {OfficialsModal} from '../../../modules/dictionary-new/officials-dictionary';
import {RESPONSIBLE_OFFICER_MAX_LENGTH} from '../../../pages/letter-page/page-partials/constants';
import {ClientsOfficialsModal} from '../clients-dictionary';
import {LetterDirection, TO_BANK} from '../../define-letter-direction';

type DictionaryModalProps = {
    name: string;
    letterDirection?: LetterDirection;
    id?: string;
};

type Normalize = (value: ValueType) => {
    name: string;
    id: number;
}

type LetterDictionaryModalProps = {
    disabled?: boolean;
    normalize?: Normalize;
    letterDirection?: string;
} & DictionaryModalProps;

type ItemType = {
    id: number;
};

type ValueType = {
    shortName: string;
    fullName: string;
    name: string;
    fio: string;
};

type DsfLetterType = {
    active: boolean;
    codeTypeDbo: number;
    dsfSubTypeDto: {
        id: number;
        version: number;
        subNameTypeDbo: string;
        createDateTime: string;
    };
    edkTypeCode: number;
    id: number;
    isDeleted: false;
    lastModifyDate: string;
    nameDocDbo: string;
    version: number;
}

type LetterTypeOld = {
    id: number;
    name: string;
}

export type LetterType = DsfLetterType & LetterTypeOld;

const discriminator = (item: ItemType) => item.id;
export const letterTypeFormatter = (value: LetterType) =>
    (value ? value.name || (value.dsfSubTypeDto && value.dsfSubTypeDto.subNameTypeDbo) : '');
export const letterTypeNormalize = (value: LetterType) => {
    return value
        ? {
            name: value.name || value.dsfSubTypeDto.subNameTypeDbo,
            id: value.id
        }
        : null;
};

export const ClientsDictionaryModal = (props: DictionaryModalProps) => (
    <Fields.CatalogedInputWithModal
        modalName={DictionaryModalName.CLIENTS}
        discriminator={discriminator}
        formatter={(value: ValueType) => value.shortName}
        fetch={fetchDictionaryItems(DICTIONARY_CLIENTS_URL)}
        {...props}
    />
);

export const BranchesDictionaryModal = (props: DictionaryModalProps) => (
    <Fields.CatalogedInputWithModal
        modalName={DictionaryModalName.BRANCHES}
        discriminator={discriminator}
        formatter={(value: ValueType) => value.shortName}
        fetch={fetchDictionaryItems(DICTIONARY_BRANCHES_URL)}
        {...props}
    />
);

export const fetchLetterTypes = (letterDirection: LetterDirection = TO_BANK) => (fullTextQuery: string) =>
    request({
        GET,
        params: {
            fullTextQuery,
            locale: 'ru_RU',
            codeTypeDbo: letterDirection === TO_BANK ? 1 : 2,
            isDeleted: false,
            active: true
        },
        url: DICTIONARY_LETTER_TYPE_URL
    }).then((response: {data: Array<LetterType>}) => response.data);

// TODO: VTBDBODSF-2270 fixed for unnecessary sending of requests
export class LetterTypesDictionaryModal extends PureComponent<LetterDictionaryModalProps> {
    render() {
        const {letterDirection = TO_BANK} = this.props;
        return (
            <Fields.CatalogedInputWithModal
                modalName={letterDirection === TO_BANK ? LetterTypeToBankModal.view : LetterTypeFromBankModal.view}
                discriminator={discriminator}
                formatter={letterTypeFormatter}
                fetch={fetchLetterTypes(this.props.letterDirection)}
                normalize={letterTypeNormalize}
                {...this.props}
            />
        );
    }
}

export type OfficialsDictionaryModalProps = DictionaryModalProps & {
    normalize?: Normalize;
    branchId: number;
};

export const fetchOfficials = (branchId: number) => (fullTextQuery: string) =>
    request({
        GET,
        params: {
            fullTextQuery,
            branchId,
            size: 5
        },
        url: DICTIONARY_OFFICIALS_URL
    }).then((response: {data: Array<Official>}) => response.data);

export type Official = {
    shortName: string;
    name: string;
    fio: string;
    id: number | string;
};

export const officialsFormatter = (value: Official) => {
    const title = value.name || value.fio;
    return title === 'N/A' ? `${title} (id: ${value.id})` : title;
};

export const OfficialsDictionaryModal = (props: OfficialsDictionaryModalProps) => (
    <Fields.CatalogedInputWithModal
        modalName={OfficialsModal.view}
        modalParams={{mainTableFilters: {branchId: props.branchId}}}
        discriminator={discriminator}
        formatter={officialsFormatter}
        fetch={fetchOfficials(props.branchId)}
        maxLength={RESPONSIBLE_OFFICER_MAX_LENGTH}
        {...props}
    />
);

export const ClientOfficialsDictionaryModal = (props: DictionaryModalProps) => (
    <Fields.CatalogedInputWithModal
        modalName={ClientsOfficialsModal.view}
        discriminator={discriminator}
        formatter={(value: ValueType) => value.fullName}
        fetch={fetchDictionaryItems(DICTIONARY_CLIENT_OFFICIALS_URL)}
        maxLength={RESPONSIBLE_OFFICER_MAX_LENGTH}
        {...props}
    />
);
