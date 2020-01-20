/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2018 VTB Group. All rights reserved.
 */
import {ReactNode} from 'react';
import {DataTableColumnType} from '@vtb/fe-ui-table';
import {actionFabrique} from '@vtb/ui-kit/src/modules/src/scroller/actions/factory';
import * as dictionaryNames from './dictionary-names';
import {DICTIONARY_DESCRIPTORS} from './dictionary-descriptors';
import {BRANCH_TYPES} from './constants';
import {RowType} from '../../pages/letter-scroller/flow-types';
import {Column} from '../../common-types';

type $Values<O extends object> = O[keyof O];
type $Keys<O extends object> = keyof O;
// type ExtractReturnType = <R>((obj: Object) => R) => R;
export type ActionFabriqueType = typeof actionFabrique;

type BranchAddressCommonDto = {
    block: string;
    branchAddressTypeId: number;
    building: string;
    city: string;
    countryId: number;
    district: string;
    fullAddress: string;
    id: number;
    office: string;
    place: string;
    placeTypeId: number;
    state: string;
    street: string;
    version: number;
    zipCode: string;
}

type CityDto = {
    abs: boolean;
    city: string;
    id: number;
    version: number;
}

export type BranchType = {
    bankInt?: number;
    bankRu?: number;
    bic: string;
    branchAddresses?: Array<BranchAddressCommonDto>;
    branchCode?: string;
    branchType?: $Values<typeof BRANCH_TYPES>;
    city?: CityDto;
    code_TFU?: string;
    comments?: string;
    correspondentAccounts?: string;
    fullName?: string;
    headBranch?: string;
    id?: number;
    infResAccOnline?: boolean;
    isNotActive?: boolean;
    masterAbs?: number;
    resAccOnline?: boolean;
    shortName: string;
    shortNameInt?: string;
    swiftCode?: string;
    timeZone?: string;
    version?: number;
    kgrkoNumber?: string;
    registrationNumber?: string;
}

export type OfficialCommonDto = {
    actor: number;
    branch: BranchType;
    email: string;
    fio: string;
    id: number;
    jobTitle: string;
    phone: string;
    userRef: string;
    version: number;
}

export type ContractCurrency = {
    accuracy?: number;
    alphabeticCode: string;
    id: number;
    isActive: boolean;
    name: string;
    numericCode: string;
    okvName: string;
    sortOrder: number;
    version: number;
}

export type CountryType = {
    code?: string;
    codeIso?: string;
    id?: number;
    shortName?: string;
}

export type ClientAddressType = {
    block: string;
    building: string;
    city: string;
    district: string;
    fullAddress: string;
    office: string;
    place: string;
    state: string;
    street: string;
}

type AccountType = {
    accountNumber: string;
}

export type ClientKpp = {
    id: number;
    kpp: string;
    mainKpp: boolean;
    version: number;
}

export type ClientType = {
    clientAddressDtos?: Array<ClientAddressType>;
    clientKppDtos?: Array<ClientKpp>;
    addresses?: Array<ClientAddressType>;
    fiscalReasonCode?: string;
    id?: number;
    inn: string;
    ogrn?: string;
    registrationDate?: string;
    shortName: string;
    kpId?: string;
    accounts?: Array<AccountType>;
    [field: string]: any;
}

type DictionaryViewDescriptorType = {
    columns: Array<typeof DataTableColumnType>;
};

export type DescriptorType = {
    endPoint?: $Values<typeof dictionaryNames> | string;
    service: string;
    title?: string;
    dictionaryViewDescriptor?: DictionaryViewDescriptorType;
    dictionaryUrl?: string;
    dataPath?: string;
    filterField?: string;
    columns?: () => Array<typeof DataTableColumnType>;
    multi?: boolean;
    col?: number;
    rowIdFieldName?: string;
    joinColumns?: boolean;
    urlParams?: string;
    method?: string;
    additional?: {
        method: string;
        endPoint: string;
        dictionaryUrl: string;
    },
    fieldToDisplay?: string;
}

export type SortingProps = {
    column: string;
    direction: string;
}

export type QueryParams = {
    locale?: string;
    branchId?: number;
    size?: number;
    sort?: string;
}

export type QueryParamsType = {
    sorting?: SortingProps;
    page?: number;
    size?: number;
    sort?: {
        name: string;
        order: string;
    },
    condition?: string;
    method?: string;
    params?: {
        page?: number;
        size?: number;
        clientId?: number;
    };
    string?: string | number;
    queryParams?: QueryParams;
};

export type DictionaryNameType = $Values<typeof dictionaryNames>

export type DictionaryScrollerFooterType = {
    activeRow: RowType;
    closeModal: () => void;
    setActivePage: () => void;
    setRecordsCount?: () => void;
    page?: number;
    totalRecords?: number;
    recordsCount?: number;
    multi?: boolean;
    checkedRows?: Array<RowType>;
    setDictionaryValues: Function;
    pagination: {
        page: number;
        totalRecords: number;
        itemsPerPage: number;
        onChangePage: (nextPage: number) => void;
        onChangeItemsPerPage: () => void;
    }
}

type MapDispatchToPropsType = ActionFabriqueType & {closeModal: () => void}
type MapStateToPropsType = {
    activeRow: RowType;
    activePage: number;
    setActivePage?: () => void;
    setRecordsCount?: () => void;
    page: number;
    totalRecords: number;
    recordsCount: number;
    isLoading: boolean;
    checkedRows?: Array<RowType>;
    multi?: boolean;
}

type DictionaryScrollerType = {
    setDictionaryValues: Function;
    filterItems?: () => void;
    filterItemsCount?: number;
    name: $Keys<typeof DICTIONARY_DESCRIPTORS>;
    getTableColumns: () => Array<Column>;
    url: string;
    dataPath: string;
    filterView?: ReactNode;
}

export type ScrollerType = DictionaryScrollerType & MapDispatchToPropsType & MapStateToPropsType;
export type TableSelectionType = {
    checked?: boolean;
    row: RowType;
}
