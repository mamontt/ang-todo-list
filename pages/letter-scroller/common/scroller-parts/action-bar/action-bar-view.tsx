/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {Component} from 'react';
import {AnyAction, bindActionCreators, Dispatch} from 'redux';
import {get, noop} from 'lodash';
import {connect} from 'react-redux';
import {Scroller, ActionsBar} from '@vtb/fe-ui-table';
import {translate} from './../../../../../utils/translate';
import {letter} from './../../../../../api/letter';
import {
    getCancellationDigestUrl,
    getCancellationUrl,
    cancelationOtrUrl,
    getEmployeeCancelltationSignUrl,
    getEmployeeCancelltationSendUrl
} from './../../../../../api/cancellation';
import {
    statusFiltersToCheckboxOptions,
    actionBarCheckboxStatusHandler,
    subFilterSelectHandled,
    getCategoryNameByStatuses,
    filterActionsBarButtonsByFilterCategory,
    statusFiltersToCheckboxOptionsTypes
} from '../../../../../pages/letter-scroller/utils';
import {getCheckedRowsIds} from '../../../../../pages/letter-scroller/selectors';
import {STATUS_CATEGORY} from './../../../../../constants/form-naming';
import {actionFabriqueToBank} from '../../../../../pages/letter-scroller/employee/letter-scroller-to-bank/action-fabrique-to-bank';
import {actionFabriqueFromBank} from '../../../../../pages/letter-scroller/employee/letter-scroller-from-bank/action-fabrique-from-bank';
import {
    buttonsPerCategoriesToBankEmployee,
    buttonsPerCategoriesFromBankEmployee
} from '../../../../../pages/letter-scroller/common/buttons-per-categories-employee';
import {
    LETTER_SCROLLER_NAME_TO_BANK,
    LETTER_SCROLLER_NAME_FROM_BANK
} from '../../../../../pages/letter-scroller/constants';
import {LETTER_PAGE_FETCH_NAMESPACE} from '../../../../../pages/letter-page/letter-page-constants';
import {CheckboxStatusType, RowType} from '../../../../../pages/letter-scroller/flow-types';
import {
    commonSign,
    printDocument,
    exportDocuments,
    multiToggleFavorite,
    ExportDocuments
} from '../../../../../pages/letter-scroller/actions';
import {showExportModal} from './../../../../../modules/export';
import {getCommonConfig, signDocumentsAction, getCancellationConfig} from '../../../../../modules/signable';
import {LetterDirection, TO_BANK} from './../../../../../modules/define-letter-direction';
import {
    getSignatureUrl,
    getDownloadUrl,
    getRemoveSignatureUrl,
    getSignaturesListUrl,
    getDigestsUrl
} from './../../../../../api/signature';
import {exportLetters} from './../../../../../utils/export/export-utils';
import {GoTo} from './../../../../../utils/routing';
import {getSelectedStatuses} from './utils';
import {
    SIGN,
    SEND,
    SIGN_AND_SEND,
    DELETE,
    RECALL,
    COPY,
    EXPORT,
    CHECK_SIGN,
    REMOVE_SIGN,
    CONFIRM_VIEW,
    FAVORITE,
    DELETE_FAVORITE,
    EXPORT_RECEIPT,
    EXPORT_VERIFY,
    PRINT
} from './header-actions';
import {employeeSubstTranslateKeys} from '../filter-view/employee-subst-translation-keys';
import {employeeStatusFilters} from '../filter-view/employee-filter-options';
import {download} from '../../../../../modules/export/services/download';
import {
    getChangesHistoryReceipt,
    EMPLOYEE_CAPABILITIES_URL,
    getUrlForSend,
    getUrlForOfficialSend,
    getUrlForActionBarSend
} from '../../../../../api/urls';
import {removeSignatures, RemoveSignaturesParams} from '../../../../../modules/signatures';
import {sendDocuments, deleteDocuments, GroupAction} from '../../../../../modules/group-actions';
import {getDeleteDocumentUrl, getSignatureChecksUrl, getUrlForReject} from '../../../../../api';
import {ActionBarButton} from './action-bar-button';
import {checkSignature, createCancelRequest, rejectDocuments} from '../../../../../modules/group-actions';
import {StoreType} from '../../../../../store/root-selector';
import {Row} from '../../table/recall-cell/row-type';
import {ResourceType} from '../../../../../modules/resource';
import {GetData} from '../../../../../modules/templates/flow-types';

export type ActionBarViewTypes = {
    // eslint-disable-next-line react/no-unused-prop-types
    isLoading: boolean;
    // eslint-disable-next-line react/no-unused-prop-types
    capabilities: Array<string>;
    letterDirection: LetterDirection;
    allRows: Array<Row>;
    checkedRows: Array<Row>;
    filters: {
        statuses: string;
        statusCategory: string;
        isFavourite: boolean;
    };
    addCheckedRows: (rows: Array<Row>) => void;
    setCheckedRows: (rows: Array<Row>) => void;
    removeCheckedRows: (rows: Array<Row>) => void;
    getCapabilities: (capabilities: Array<string> | string) => void;
    getActualCheckedRows: () => Array<RowType>;
    getData?: GetData;
    setActiveRow?: (row: Row) => void;
    activeRow?: Row;
    resource?: ResourceType;
    goTo?: GoTo;
    savedScrollerSettings?: Object;
    copyDocument?: (id: number, goToNew: GoTo, goToScroller: GoTo) => void;
    deleteDocument?: Function;
    commonSign?: Function;
    sendDocument?: Function;
    sendDocuments?: Function;
    recallDocument?: Function;
    showExportModal?: Function;
    exportDocuments?: ExportDocuments;
    printDocument?: Function;
    assignDocument?: Function;
    processComplete?: Function;
    rejectDocument: Function;
    signTools?: Array<Object>;
    multiToggleFavorite?: Function;
    removeSignatures: (params: RemoveSignaturesParams) => {};
    checkSignature?: Function;
    signDocuments?: Function;
};

type ActionBarViewStateTypes = {
    selectedValue: any;
}

const PERFORM_BUTTONS_FILTERING = true;
let LETTER_SCROLLER_NAME = LETTER_SCROLLER_NAME_TO_BANK;
const isActionEnabled = (action: string, capabilities: Array<string>) => capabilities.includes(action);
const getActions = (props: ActionBarViewTypes) => {
    const {
        getData,
        getCapabilities,
        removeCheckedRows,
        resource,
        capabilities,
        goTo,
        checkedRows,
        filters,
        savedScrollerSettings = {},
        letterDirection,
        signTools,
        signDocuments
    } = props;
    const isActionEnabledWithCapabilities = (action: string) => isActionEnabled(action, capabilities);
    const refetchDataAndCapabilities = (dispatch: Dispatch<AnyAction>, getState: () => StoreType) => {
        getData();
        getCapabilities(getCheckedRowsIds(Scroller.selectors.getCheckedRows(getState(), LETTER_SCROLLER_NAME)));
    };
    const resetDataAndCapabilities = () => {
        removeCheckedRows(checkedRows);
        getData();
        getCapabilities([]);
    };
    const noCheckedRows = checkedRows.length === 0;
    const noMultiAction = noCheckedRows || checkedRows.length !== 1;
    const filterStatuses = filters.isFavourite ? 'FAVORITE' : get(filters, STATUS_CATEGORY, 'ALL');
    const categoryName = getCategoryNameByStatuses(employeeStatusFilters, filterStatuses);

    const checkLetterDirection = () => {
        return letterDirection === TO_BANK ? buttonsPerCategoriesToBankEmployee : buttonsPerCategoriesFromBankEmployee;
    };

    const favorite = (addFavorite: boolean) =>
        props.multiToggleFavorite(
            checkedRows,
            resource,
            () => (dispatch: Function) => {
                removeCheckedRows(checkedRows);
                dispatch(refetchDataAndCapabilities);
            },
            LETTER_PAGE_FETCH_NAMESPACE,
            addFavorite
        );

    const existValueFavorite = (favourite: boolean) => checkedRows.some(row => row.favourite === favourite);

    const disabledBySignatureLimitations = !signTools || signTools.length === 0 ||
        (signTools.filter((tool: {typeSignature: string}) =>
            tool.typeSignature !== 'simple').length === 0 && checkedRows.length > 1);

    const commonSignFunc = (signAndSend: any) => props.commonSign(
        getSignatureUrl,
        getUrlForActionBarSend,
        LETTER_SCROLLER_NAME,
        (dispatch: Function) => {
            removeCheckedRows(checkedRows);
            dispatch(refetchDataAndCapabilities);
        },
        letterDirection,
        signAndSend
    );

    const buttons: {[key:string]: ActionBarButton} = {
        [COPY]: {
            id: COPY,
            title: translate('actions.do.copy'),
            onClick: () => goTo.newDocument({copyFrom: checkedRows[0].id}),
            icon: 'Copy',
            disabled: !isActionEnabledWithCapabilities(COPY) || noMultiAction
        },
        [DELETE]: {
            id: DELETE,
            title: translate('actions.do.delete'),
            onClick: () => props.deleteDocument({allDocuments: checkedRows})
                .then(() => {
                    removeCheckedRows(checkedRows);
                    getData();
                    getCapabilities([]);
                }),
            icon: 'Delete',
            disabled: !isActionEnabledWithCapabilities(DELETE) || noCheckedRows
        },
        [SIGN]: {
            id: SIGN,
            title: translate('actions.do.sign'),
            onClick: () => commonSignFunc(false),
            icon: 'Sign',
            disabled: !isActionEnabledWithCapabilities(SIGN) || noCheckedRows || disabledBySignatureLimitations
        },
        [SIGN_AND_SEND]: {
            id: SIGN_AND_SEND,
            title: translate('actions.do.sign-and-send'),
            onClick: () => commonSignFunc(true),
            icon: 'SignSend',
            disabled: !isActionEnabledWithCapabilities(SIGN_AND_SEND) || noCheckedRows || disabledBySignatureLimitations
        },
        [SEND]: {
            id: SEND,
            title: translate('actions.do.send'),
            onClick: () => props.sendDocuments({allDocuments: checkedRows}).then(resetDataAndCapabilities),
            icon: 'Send',
            disabled: !isActionEnabledWithCapabilities(SEND) || noCheckedRows
        },
        [RECALL]: {
            id: RECALL,
            title: translate('actions.do.recall'),
            onClick: () =>
                props.recallDocument({allDocuments: checkedRows}).then((results: any) => {
                    signDocuments({
                        getSignUrlFunc: getEmployeeCancelltationSignUrl,
                        getSendUrlFunc: getEmployeeCancelltationSendUrl,
                        getDigestFunc: getCancellationDigestUrl,
                        otrUrl: cancelationOtrUrl,
                        ids: results.successResults.map((r: any) => r.result.data.cancelRequestId),
                        after: () => resetDataAndCapabilities(),
                        getConfig: getCancellationConfig,
                        direction: TO_BANK,
                        signAndSend: true,
                        getSendSmsCodeUrl: () =>
                            '/api/letters/v3/ui/cancelRequests/ui/edocs/{documentId}/signatures/simple/smscode',
                        getOtpSignUrl: () =>
                            '/api/letters/v3/ui/cancelRequests/ui/edocs/{documentId}/signatures/simple',
                        fetchConfigUrl: '/api/otp/ui/operations/SIMPLE_SIGNATURE_SIGNING/params'
                    });
                    resetDataAndCapabilities();
                }),
            icon: 'Withdraw',
            disabled: !isActionEnabledWithCapabilities(RECALL) || noCheckedRows || disabledBySignatureLimitations
        },
        [EXPORT]: exportLetters({
            direction: letterDirection,
            isOfficial: false,
            showExportModal: props.showExportModal,
            exportDocuments: props.exportDocuments,
            letterScroller: LETTER_SCROLLER_NAME,
            checkedRows,
            isActionEnabledWithCapabilities,
            savedScrollerSettings,
            resetDataAndCapabilities
        }),
        [PRINT]: {
            id: PRINT,
            title: translate('actions.do.print'),
            onClick: () => props.printDocument(LETTER_SCROLLER_NAME, letterDirection).then(resetDataAndCapabilities),
            icon: 'Print',
            disabled: !isActionEnabledWithCapabilities(PRINT) || noCheckedRows
        },
        [CHECK_SIGN]: {
            id: CHECK_SIGN,
            title: translate('actions.do.verify-signature'),
            onClick: () =>
                props.checkSignature({allDocuments: checkedRows}).then(() => {
                    removeCheckedRows(checkedRows);
                    getData();
                    getCapabilities([]);
                }),
            icon: 'SignVerify',
            disabled: !isActionEnabledWithCapabilities(CHECK_SIGN) || noCheckedRows
        },
        [CONFIRM_VIEW]: {
            id: CONFIRM_VIEW,
            title: translate('actions.do.confirm-view'),
            onClick: () => noop,
            icon: 'View',
            disabled: !isActionEnabledWithCapabilities(CONFIRM_VIEW) || noCheckedRows
        },
        [REMOVE_SIGN]: {
            id: REMOVE_SIGN,
            title: translate('actions.do.remove-signature'),
            onClick: () =>
                props.removeSignatures({
                    checkedRows,
                    afterAction: (dispatch: Function) => {
                        removeCheckedRows(checkedRows);
                        dispatch(refetchDataAndCapabilities);
                    },
                    removeSignUrl: (edocId: string) => (signatureId: string) =>
                        getRemoveSignatureUrl(edocId, TO_BANK, signatureId),
                    listSignUrl: (id: string | number) => getSignaturesListUrl(id, TO_BANK),
                    digestSignUrl: (id: string) => getDigestsUrl({id, direction: TO_BANK}),
                    capabilitiesUrl: `${EMPLOYEE_CAPABILITIES_URL}?ids=${checkedRows.map(row => row.id).join(',')}`,
                    getConfig: getCommonConfig
                }),
            icon: 'Unsign',
            disabled: !isActionEnabledWithCapabilities(REMOVE_SIGN) || noCheckedRows
        },
        [FAVORITE]: {
            id: FAVORITE,
            title: translate('actions.do.add-to-favorite'),
            onClick: () => favorite(true),
            icon: 'Favorites',
            disabled:
                !isActionEnabledWithCapabilities(FAVORITE) ||
                noCheckedRows ||
                (checkedRows.length && !existValueFavorite(false))
        },
        [DELETE_FAVORITE]: {
            id: DELETE_FAVORITE,
            title: translate('actions.do.remove-from-favorite'),
            onClick: () => favorite(false),
            icon: 'FavoritesEmpty',
            disabled:
                !isActionEnabledWithCapabilities(DELETE_FAVORITE) ||
                noCheckedRows ||
                (checkedRows.length && !existValueFavorite(true))
        },
        [EXPORT_RECEIPT]: {
            id: EXPORT_RECEIPT,
            title: translate('actions.do.export-receipt'),
            onClick: () =>
                download({
                    downloadUrl: `${getChangesHistoryReceipt}?ids=${checkedRows
                        .map(row => row.id.toString())
                        .join(',')}`
                }),
            icon: 'ExportDoc',
            disabled: !isActionEnabledWithCapabilities(EXPORT_RECEIPT) || noCheckedRows
        },
        [EXPORT_VERIFY]: {
            id: EXPORT_VERIFY,
            title: translate('actions.do.export-verify-signature'),
            onClick: () => checkedRows.forEach(row => download({downloadUrl: getDownloadUrl(row.id, letterDirection)})),
            icon: 'Check',
            disabled: !isActionEnabledWithCapabilities(EXPORT_VERIFY) || noCheckedRows
        }
    };

    return filterActionsBarButtonsByFilterCategory(
        buttons,
        checkLetterDirection(),
        categoryName,
        PERFORM_BUTTONS_FILTERING
    );
};

class ActionBarView extends Component<ActionBarViewTypes, ActionBarViewStateTypes> {
    static getDerivedStateFromProps(nextProps: CheckboxStatusType, prevState: CheckboxStatusType) {
        return actionBarCheckboxStatusHandler(nextProps, prevState);
    }

    state = {
        selectedValue: ''
    };

    render() {
        const {
            allRows,
            checkedRows,
            addCheckedRows,
            setCheckedRows,
            removeCheckedRows,
            getCapabilities,
            getActualCheckedRows,
            letterDirection
        } = this.props;

        const statusFilters: statusFiltersToCheckboxOptionsTypes = {
            translationKeysMatch: employeeSubstTranslateKeys,
            rows: allRows
        };

        const currentTabFilters = statusFiltersToCheckboxOptions(statusFilters);

        LETTER_SCROLLER_NAME =
            letterDirection === TO_BANK ? LETTER_SCROLLER_NAME_TO_BANK : LETTER_SCROLLER_NAME_FROM_BANK;

        const getCapabilitiesWrapper = () => {
            getCapabilities(getCheckedRowsIds(getActualCheckedRows()));
        };

        return (
            <ActionsBar
                selectedValue={getSelectedStatuses(checkedRows, allRows)}
                actions={getActions(this.props)}
                filters={currentTabFilters}
                onFilterSelect={(filterValue: string) => {
                    if (filterValue !== this.state.selectedValue) {
                        this.setState(() => ({
                            selectedValue: subFilterSelectHandled({
                                filterValue,
                                allRows,
                                checkedRows,
                                addCheckedRows,
                                setCheckedRows,
                                removeCheckedRows,
                                getCapabilitiesWrapper
                            })
                        }));
                    }
                }}
                isCheckboxIndeterminate
            />
        );
    }
}

const getActionFabrique = (letterDirection: LetterDirection) => {
    return letterDirection === TO_BANK ? {...actionFabriqueToBank} : {...actionFabriqueFromBank};
};
const getActualCheckedRows = () =>
    (dispatch: Dispatch<AnyAction>, getState: () => StoreType) =>
        Scroller.selectors.getCheckedRows(getState(), LETTER_SCROLLER_NAME);

export const ConnectedActionBarView =
    connect(
        (state, {letterDirection}: {letterDirection: LetterDirection}) => ({
            isLoading: Scroller.selectors.getLoadingState(state, LETTER_SCROLLER_NAME),
            capabilities: Scroller.selectors.getCapabilities(state, LETTER_SCROLLER_NAME),
            checkedRows: Scroller.selectors.getCheckedRows(state, LETTER_SCROLLER_NAME),
            allRows: Scroller.selectors.getData(state, LETTER_SCROLLER_NAME),
            filters: Scroller.selectors.getFilters(state, LETTER_SCROLLER_NAME),
            activeRow: Scroller.selectors.getActiveRow(state, LETTER_SCROLLER_NAME),
            savedScrollerSettings: Scroller.selectors.getSavedSettings(
                state,
                LETTER_SCROLLER_NAME
            ),
            resource: letter(letterDirection),
            signTools: get(state, 'auth.payload.signTools')
        }),
        (dispatch, {letterDirection}) => bindActionCreators({
            ...getActionFabrique(letterDirection),
            deleteDocument: deleteDocuments({
                capabilitiesUrl: EMPLOYEE_CAPABILITIES_URL,
                sendUrl: (id: string) => getDeleteDocumentUrl(id)
            }),
            commonSign,
            signDocuments: signDocumentsAction,
            recallDocument: createCancelRequest({
                capabilitiesUrl: EMPLOYEE_CAPABILITIES_URL,
                cancelRequestUrl: getCancellationUrl()
            }),
            printDocument,
            showExportModal,
            exportDocuments,
            multiToggleFavorite,
            removeSignatures,
            getActualCheckedRows,
            sendDocuments: sendDocuments({
                capabilitiesUrl: EMPLOYEE_CAPABILITIES_URL,
                sendUrl: (id: string) => (letterDirection === TO_BANK ? getUrlForSend(id) : getUrlForOfficialSend(id))
            }),
            rejectDocument: rejectDocuments({
                capabilitiesUrl: EMPLOYEE_CAPABILITIES_URL,
                getUrlForReject
            }),
            checkSignature: checkSignature({
                capabilitiesUrl: EMPLOYEE_CAPABILITIES_URL,
                sendUrl: getSignatureChecksUrl(letterDirection)
            })
        }, dispatch)
    )<any>(ActionBarView);
