/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {ComponentType, ReactNode} from 'react';
import {Branch, Client} from '../../common-types';
import {UserContext} from './../../modules/user-context';
import {AttachmentType} from '../../modules/attachments/attachment';

export type DocumentValues = {
    number: string;
    createDate: string;
    status: {
        id: string;
    };
    client: Client;
    branch: Branch;
    official: string;
    topic: string;
    content: string;
    attachments: Array<AttachmentType>;
    toBank: boolean;
    cancelReq: {
        id: number;
        reason: string;
    };
    id?: number | string;
    favourite?: boolean;
}

export type QuickViewComponentProps = {
    documentValues: DocumentValues;
    userContext?: UserContext;
    recallAction?: (action: any) => void;
}

export type LetterScrollerProps = {
    showEmptyView?: ReactNode;
    location?: {
        state: any;
    };
    component: ComponentType<any>;
}

export type PropsType = {
    scrollerName?: string;
    initParams?: ReactNode;
    currentParams?: ReactNode;
    actionBarView?: ReactNode;
    tableView?: ReactNode;
    quickViewView?: ReactNode;
    filterView?: ReactNode;
    footerView?: ReactNode;
    showEmptyView?: ReactNode;
    emptyView?: ReactNode;
}

export type RowType = {
    id?: number | string;
    favourite?: boolean;
    edocRefId?: number;
    topic?: string;
    official?: {
        fio?: string;
    };
    letterType?: {
        name?: string;
    };
    rowIdFieldName?: string | number;
}

export type RowsType = {
    row: RowType;
    checked: boolean;
}

export type CheckboxStatusType = {
    checkedRows: Array<RowType>;
    allRows: Array<RowType>;
    selectedValue: string;
}

export type SelectorType = {
    clientSnapshot: Client;
    branchSnapshot: Branch;
    documentDate: string;
}

type BranchAddressesType = {
    branchAddressTypeId: number;
    countryCode: string;
    countryCodeIso: string;
    countryId: number;
    fullAddress: string;
    id: number;
    place: string;
    placeTypeId: number;
    version: number;
    zipCode: string;
}

type BranchContactsType = {
    branchContactTypeId: number;
    contact: string;
    contactFullName: string;
    contactJobTitle: string;
    id: number;
    mainContact: boolean;
    version: number;
}

type branchInformationalIdsType = {
    externalId: string;
    id: number;
    system: number;
    version: number;
}

type BranchIdType = {
    bic: string;
    branchAddresses: Array<BranchAddressesType>;
    branchCode: string;
    branchContacts: Array<BranchContactsType>;
    branchInformationalIds: Array<branchInformationalIdsType>;
    branchType: string;
    calendars: Array<string>;
    centralizedDocumentary: boolean;
    cib: boolean;
    correspondentAccounts: string;
    fullName: string;
    id: number;
    infResAccOnline: boolean;
    isNotActive: boolean;
    kgrkoNumber: string;
    masterAbs: number;
    registrationNumber: string;
    resAccOnline: boolean;
    shortName: string;
    swiftCode: string;
    timeZone: string;
    timeZoneEnum: string;
    version: number;
}

type СlientAddressDtosType = {
    addressType: number;
    block: string;
    building: string;
    countryCode: string;
    countryCodeIso: string;
    countryId: number;
    district: string;
    fullAddress: string;
    id: number;
    place: string;
    placeType: number;
    state: string;
    street: string;
    version: number;
    zipCode: string;
}

type СlientContactsType = {
    contact: string;
    contactFullName: string;
    contactJobTitle: string;
    contactType: number;
    id: number;
    isMainContact: boolean;
    nonSynchronized: boolean;
    version: number;
}

type ClientInformationalIdsType = {
    externalId: string;
    id: number;
    system: number;
    version: number;
}

type ClientKppDtosType = {
    id: number;
    kpp: string;
    mainKpp: boolean;
    version: number;
}

export type ClientIdType = {
    blockType: string;
    clientAddressDtos: Array<СlientAddressDtosType>;
    clientContacts: Array<СlientContactsType>;
    clientInformationalIds: Array<ClientInformationalIdsType>;
    clientKppDtos: Array<ClientKppDtosType>;
    clientType: {
        id: number;
        version: number;
        shortName: string;
        fullName: string;
        clientTypeCode: number;
    };
    fullName: string;
    headOrganization: boolean;
    id: number;
    inn: string;
    internationalName: string;
    kpId: string;
    migrated: boolean;
    ogrn: string;
    okpo: string;
    poolingAvailable: boolean;
    registrationDate: string;
    resident: boolean;
    segment: {
        id: number;
        version: number;
        segmentName: string;
        segmentCode: number;
    };
    shortName: string;
    status: string;
    twoWayTls: boolean;
    version: number;
    vipClient: boolean;
}

export type FilterType = {
    attachments?: boolean;
    body?: string;
    branchId?: BranchIdType;
    clientId?: ClientIdType;
    clientOfficerId?: {
        actor: number;
        branch: BranchIdType;
        email: string;
        fio: string;
        id: number;
        jobTitle: string;
        phone: string;
        userRef: string;
        version: number;
    };
    isFavourite?: boolean;
    letterTypeId?: {
        id?: string;
        name?: string;
    };
    number?: string;
    period?: Array<string>;
    phone?: {
        phoneCode?: string;
        phoneNumber?: string;
    };
    preset?: Array<string>;
    statuses?: Array<string>;
    topic?: string;
}
