/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {formValueSelector} from 'redux-form';
import {createSelector} from 'reselect';
import {get} from 'lodash';
import moment from 'moment';
import {isViewModeForm} from './../../modules/capabilities';
import {getDomain, StoreType} from './../../store/root-selector';
import {documentEnableExportReceiptsStatuses} from './../../constants/document-enable-receipt-statuses';
import {
    LETTER_DOCUMENT_NAME,
    LETTER_PAGE_STORE_KEY,
    LETTER_PAGE_NAME,
    DICTIONARY_STORE_KEY,
    idPAOVTB
} from './letter-page-constants';
import {Branch} from '../../common-types';

const VIEW_MODE_FIELD = 'viewMode';
const toggleViewMode = (initial = {}, viewMode: boolean) => ({
    ...initial,
    [VIEW_MODE_FIELD]: viewMode
});

export const getInitialValues = createSelector(
    getDomain(LETTER_PAGE_STORE_KEY),
    domain => domain.initialValues
);

export const getDocumentId = createSelector(
    getInitialValues,
    documentValues =>
        get(documentValues, 'id')
);

// TODO: VTBDBODSF-311, VTBDBODSF-312: added requests actions and document info when changing the tab
export const getActiveTabId = createSelector(
    getDomain(LETTER_PAGE_STORE_KEY),
    domain => domain.tabs.activeTab
);

export const getBranchSnapshotFromDictionary = createSelector(
    getDomain(DICTIONARY_STORE_KEY),
    domain =>
        get(domain, 'parametricDictionaries.branchSearch')
);

export const getInitialValuesWithViewMode = createSelector(
    getInitialValues, isViewModeForm(getDocumentId)(LETTER_DOCUMENT_NAME),
    toggleViewMode
);

export const getInitialValuesWithClients = createSelector(
    getInitialValuesWithViewMode,
    (values) => {
        const clientSnapshot = get(values, 'clientSnapshot');
        if (clientSnapshot) {
            return {
                ...values,
                clients: [clientSnapshot]
            };
        }
        return values;
    }
);

export const getInitialValuesWithDate = createSelector(
    getInitialValuesWithClients,
    (values) => {
        const documentDate = get(values, 'documentDate');
        return documentDate
            ? values
            : {
                ...values,
                documentDate: moment().startOf('day')
            };
    }
);

export const getViewMode = createSelector(
    getInitialValuesWithViewMode,
    initialValuesWithViewMode =>
        get(initialValuesWithViewMode, 'viewMode')
);

export const getDocumentStatus = (state: StoreType) => get(state, 'form["fe-letters/letter"].values.status.name');

export const getDocumentStatusId = (state: StoreType) => get(state, 'form["fe-letters/letter"].values.status.id');

export const getDocumentExtendedStatusName = (state: StoreType) =>
    get(state, 'form["fe-letters/letter"].values.status.extendedName');

export const getEnableExportReceipts = createSelector(
    getInitialValues,
    documentValues =>
        !!documentEnableExportReceiptsStatuses.find((item: string) => item === get(documentValues, ['status', 'id']))
);

export const getRead = createSelector(
    getInitialValues,
    documentValues =>
        get(documentValues, 'read')
);

export const getRelatedDocuments = createSelector(
    getInitialValues,
    documentValues =>
        get(documentValues, 'hasRelatedDocuments')
);

export const getEdocRefId = createSelector(
    getInitialValues,
    documentValues =>
        get(documentValues, 'edocRefId')
);

export const getLastCheckResults = createSelector(
    getInitialValues,
    documentValues =>
        get(documentValues, 'lastCheckResults')
);

export const getDocumentAttachments = createSelector(
    getInitialValues,
    documentValues =>
        get(documentValues, 'attachments')
);

export const getInitClientSnapshot = createSelector(
    getInitialValues,
    documentValues =>
        get(documentValues, 'clientSnapshot')
);

export const getInitTypeLetter = createSelector(getInitialValues,
    documentValues =>
        get(documentValues, 'letterType'));

export const valueSelector = formValueSelector(LETTER_PAGE_NAME);

export const getFavouriteFlag = (state: StoreType) => valueSelector(state, 'favourite');

export const getBranchId = (state: StoreType) => valueSelector(state, 'branchSnapshot.id');

export const getNumber = (state: StoreType) => valueSelector(state, 'documentNumber');

export const getMyDocumentNumber = (state: StoreType) => valueSelector(state, 'myDocumentNumber');

export const getCreateDate = (state: StoreType) => valueSelector(state, 'documentDate');

export const getClientSnapshot = (state: StoreType) => valueSelector(state, 'clientSnapshot');

export const getClients = (state: StoreType) => valueSelector(state, 'clients');

export const getBranchSnapshot = (state: StoreType) => valueSelector(state, 'branchSnapshot');

export const getContent = (state: StoreType) => valueSelector(state, 'content');

export const getBankResponsibleOfficerName = (state: StoreType) => valueSelector(state, 'bankResponsibleOfficer.name');

export const getClientResponsibleOfficerName = (state: StoreType) => valueSelector(state, 'clientResponsibleOfficer.name');

export const getTopic = (state: StoreType) => valueSelector(state, 'topic');

export const getCopyFlag = (state: StoreType) => valueSelector(state, '@@copied');

export const isBranchPAOVTB = createSelector(
    getBranchSnapshot,
    (branch: Branch) => branch && branch.id === idPAOVTB
);

/**
 * Get letter direction as boolean
 * @param {*} state
 * @returns boolean: true if to bank, false if to client
 */
export const getDirection = (state: StoreType) => valueSelector(state, 'toBank');

export const getCurrentValues = (state: StoreType) => valueSelector(
    state,
    'clientSnapshot',
    'branchSnapshot',
    'content',
    'topic',
    'clientResponsibleOfficer.name',
    'bankResponsibleOfficer.name'
);
