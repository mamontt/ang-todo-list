/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2018 VTB Group. All rights reserved.
 */
import {get} from 'lodash';
import {GET} from './../../constants/request-types';
import {translate} from './../../utils/translate';
import {
    BRANCHES,
    CLIENTS,
    OFFICIALS,
    OFFICIALS_ASSIGN,
    CLIENT_SEARCH,
    BRANCH_SEARCH,
    LETTER_TYPE,
    CLIENT_GROUPS
} from './dictionary-names';
import {ClientKpp, DescriptorType} from './flow-types';

export const DICTIONARY_DESCRIPTORS: {
    [DictionaryNameType: string ]: DescriptorType
} = {
    [BRANCHES]: {
        endPoint: 'branches',
        service: 'branch',
        title: 'dictionary.branch.title',
        fieldToDisplay: 'shortName',
        urlParams: 'page=0&size=10000',
        columns: () => [
            {
                label: translate('dictionary.bank-name'),
                name: 'shortName',
                width: 485,
                sortable: true,
                visible: true
            },
            {
                label: translate('dictionary.bic'),
                name: 'shortName',
                width: 150,
                sortable: true,
                visible: true
            }
        ]
    },
    [CLIENTS]: {
        endPoint: 'clients',
        service: 'client',
        title: 'dictionary.client.title',
        urlParams: 'page=0&size=10000',
        fieldToDisplay: 'shortName',
        columns: () => [
            {
                label: translate('dictionary.client'),
                name: 'shortName',
                width: 235,
                sortable: true,
                visible: true
            },
            {
                label: translate('dictionary.inn'),
                name: 'inn',
                width: 100,
                sortable: true,
                visible: true
            },
            {
                label: translate('dictionary.kpp'),
                name: 'kpp',
                width: 100,
                sortable: true,
                visible: true
            },
            {
                label: translate('dictionary.ogrn'),
                name: 'ogrn',
                width: 100,
                sortable: true,
                visible: true
            },
            {
                label: translate('main-reference.ogrn-date'),
                name: 'ogrnDate',
                width: 100,
                sortable: true,
                visible: true
            }
        ]
    },
    [OFFICIALS]: {
        endPoint: 'officials',
        service: 'branch',
        title: 'dictionary.officials.title',
        fieldToDisplay: 'fio',
        columns: () => [
            {
                label: translate('dictionary.fio'),
                name: 'fio',
                width: 250,
                sortable: true,
                visible: true
            },
            {
                label: translate('dictionary.job-title'),
                name: 'jobTitle',
                width: 230,
                sortable: true,
                visible: true
            },
            {
                label: translate('dictionary.branch'),
                name: 'branchSnapshot.shortName',
                width: 155,
                sortable: true,
                visible: true
            }
        ]
    },
    [OFFICIALS_ASSIGN]: {
        endPoint: 'officials',
        service: 'branch',
        fieldToDisplay: 'fio'
    },
    [CLIENT_GROUPS]: {
        endPoint: 'client-groups',
        service: 'client',
        fieldToDisplay: 'clientGroups'
    },
    [CLIENT_SEARCH]: {
        endPoint: 'clients',
        service: 'client',
        title: 'dictionary.client.title',
        method: GET,
        fieldToDisplay: 'shortName',
        dataPath: 'data',
        columns: () => [
            {
                label: translate('dictionary.client'),
                name: 'fullName',
                width: 250,
                sortable: true,
                visible: true,
                stretch: true
            },
            {
                label: translate('dictionary.inn-kio'),
                name: 'inn',
                width: 100,
                sortable: true,
                visible: true
            },
            {
                label: translate('dictionary.kpp'),
                name: 'kpp',
                width: 100,
                sortable: true,
                visible: true,
                selector: ({clientKppDtos = []}: {clientKppDtos: Array<ClientKpp>}) =>
                    get(clientKppDtos.find(kppDto => get(kppDto, 'mainKpp')), 'kpp', '')
            }
        ]
    },
    [BRANCH_SEARCH]: {
        endPoint: 'branches/search',
        service: 'branch',
        title: 'dictionary.branch.title',
        fieldToDisplay: 'shortName',
        dataPath: 'data',
        urlParams: 'page=0&size=10000',
        columns: () => [
            {
                label: translate('dictionary.bank-name'),
                name: 'fullName',
                width: 250,
                sortable: true,
                visible: true,
                stretch: true
            }
        ]
    },
    [LETTER_TYPE]: {
        endPoint: 'letterType',
        service: 'letters',
        dictionaryUrl: 'ui/dictionary/',
        title: 'dictionary.letter-type.title',
        fieldToDisplay: 'name',
        dataPath: 'data',
        columns: () => [
            {
                label: translate('dictionary.letter-type'),
                name: 'name',
                width: 250,
                sortable: true,
                visible: true,
                stretch: true
            }
        ]
    }
};
