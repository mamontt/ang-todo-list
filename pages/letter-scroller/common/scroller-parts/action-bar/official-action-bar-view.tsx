/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {get, noop} from 'lodash';
import {connect} from 'react-redux';
import {BackgroundDialog} from '@vtb/fe-ui-background-dialog';
import {taskManager} from '@vtb/services/background-operations';
import {Scroller, ActionsBar} from '@vtb/fe-ui-table';
import {translate} from './../../../../../utils/translate';
import {letterOfficial} from './../../../../../api/letter';
import {getCancellationDigestUrl} from './../../../../../api/cancellation';
import {
    statusFiltersToCheckboxOptions,
    actionBarCheckboxStatusHandler,
    subFilterSelectHandled,
    getCategoryNameByStatuses,
    filterActionsBarButtonsByFilterCategory
} from '../../../../../pages/letter-scroller/utils';
import {getCheckedRowsIds} from '../../../../../pages/letter-scroller/selectors';
import {STATUS_CATEGORY} from './../../../../../constants/form-naming';
import {officialActionFabriqueToBank} from '../../../../../pages/letter-scroller/official/letter-scroller-to-bank/official-action-fabrique-to-bank';
import {officialActionFabriqueFromBank} from '../../../../../pages/letter-scroller/official/letter-scroller-from-bank/official-action-fabrique-from-bank';
import {
    buttonsPerCategoriesFromBankOfficial,
    buttonsPerCategoriesToBankOfficial
} from '../../../../../pages/letter-scroller/common/buttons-per-categories-official';
import {LETTER_SCROLLER_NAME_FROM_BANK, LETTER_SCROLLER_NAME_TO_BANK} from '../../../../../pages/letter-scroller/constants';
import {
    commonSign,
    createCancellationDocument,
    assignDocument,
    printDocument,
    exportDocuments
} from '../../../../../pages/letter-scroller/actions';
import {showExportModal} from './../../../../../modules/export';
import {LetterDirection, TO_BANK} from './../../../../../modules/define-letter-direction';
import {getSignatureUrl} from './../../../../../api/signature';
import {exportLetters} from './../../../../../utils/export/export-utils';
import {CheckboxStatusType} from '../../../../../pages/letter-scroller/flow-types';
import {getSelectedStatuses} from './utils';
import {
    ADD_COMMENT,
    SIGN,
    SEND,
    SIGN_AND_SEND,
    DELETE,
    RECALL,
    CHECK_REQUISITES,
    COPY,
    EXPORT,
    CHECK_SIGN,
    REMOVE_SIGN,
    PRINT,
    PROCESS,
    PROCESS_COMPLETE,
    REJECT,
    START_SIGN_CHECKS,
    TAKE_IN_PROCESS
} from './header-actions';
import {officialSubstTranslateKeys} from '../filter-view/official-substr-translation-keys';
import {officialStatusFilters} from '../filter-view/official-filter-options';
import {ActionBarViewTypes} from './action-bar-view';
import {getDeleteDocumentOfficialUrl, getUrlForOfficialProcessComplete, OFFICIAL_CAPABILITIES_URL} from '../../../../../api';
import {getUrlForOfficialActionBarSend} from '../../../../../api/urls';
import {ActionBarButton} from './action-bar-button';
import {checkSignature, processComplete, deleteDocuments, rejectDocuments} from '../../../../../modules/group-actions';
import {getSignatureChecksUrl, getUrlForReject} from '../../../../../api/urls';

type ActionBarViewStateTypes = {
    selectedValue: string | Array<string>;
}

type Task = {
    active: boolean;
    completed: number;
    id: string;
    interruptLink: string;
    rejectLink: string;
    rejecting: boolean;
    resultUrl: string;
    serviceId: string;
    status: string;
    timeLeft: string;
    title: string;
    total: number;
    type: string;
    uiFormType: string;
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
        letterDirection
    } = props;
    const isActionEnabledWithCapabilities = (action: string) => isActionEnabled(action, capabilities);
    const refetchDataAndCapabilities = (dispatch: Function, getState: Function) => {
        getData();
        getCapabilities(getCheckedRowsIds(
            Scroller.selectors.getCheckedRows(getState(),
                LETTER_SCROLLER_NAME)
        ));
    };
    const noCheckedRows = checkedRows.length === 0;
    const noMultiAction = noCheckedRows || checkedRows.length !== 1;
    const filterStatuses = get(filters, STATUS_CATEGORY, 'ALL');
    const categoryName = getCategoryNameByStatuses(officialStatusFilters, filterStatuses);

    const checkLetterDirection = () => {
        return letterDirection === TO_BANK
            ? buttonsPerCategoriesToBankOfficial
            : buttonsPerCategoriesFromBankOfficial;
    };

    const resetDataAndCapabilities = () => {
        removeCheckedRows(checkedRows);
        getData();
        getCapabilities([]);
    };

    const commonSignFunc = (signAndSend: boolean) => props.commonSign(
        getSignatureUrl,
        getUrlForOfficialActionBarSend,
        LETTER_SCROLLER_NAME,
        (dispatch: Function) => {
            removeCheckedRows(checkedRows);
            dispatch(refetchDataAndCapabilities);
        },
        letterDirection,
        signAndSend
    );

    const buttons: {[key: string]: ActionBarButton} = {
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
            disabled: !isActionEnabledWithCapabilities(SIGN) || noCheckedRows
        },
        [SIGN_AND_SEND]: {
            id: SIGN_AND_SEND,
            title: translate('actions.do.sign-and-send'),
            onClick: () => commonSignFunc(true),
            icon: 'SignSend',
            disabled: !isActionEnabledWithCapabilities(SIGN_AND_SEND) || noMultiAction
        },
        [SEND]: {
            id: SEND,
            title: translate('actions.do.send'),
            onClick: () => {
                props.sendDocuments({
                    documents: checkedRows,
                    createTaskUrl: '/api/letters/bgo/employees/letters/send'
                });
                taskManager.subscribe({
                    serviceId: 'letters',
                    type: SIGN_AND_SEND,
                    callback: (task: Task) => {
                        taskManager.unsubscribe(task.id);
                        removeCheckedRows(checkedRows);
                        getData();
                    }
                });
            },
            icon: 'Send',
            disabled: !isActionEnabledWithCapabilities(SEND) || noCheckedRows
        },
        [RECALL]: {
            id: RECALL,
            title: translate('actions.do.recall'),
            onClick: () => props.recallDocument(
                LETTER_SCROLLER_NAME,
                refetchDataAndCapabilities,
                getCancellationDigestUrl,
                letterDirection
            ),
            icon: 'Withdraw',
            disabled: !isActionEnabledWithCapabilities(RECALL) || noCheckedRows
        },
        [EXPORT]:
            exportLetters({
                direction: letterDirection,
                isOfficial: true,
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
            onClick: () => props.checkSignature({allDocuments: checkedRows})
                .then(() => {
                    removeCheckedRows(checkedRows);
                    getData();
                    getCapabilities([]);
                }),
            icon: 'SignVerify',
            disabled: !isActionEnabledWithCapabilities(CHECK_SIGN) || noCheckedRows
        },
        [REMOVE_SIGN]: {
            id: REMOVE_SIGN,
            title: translate('actions.do.remove-signature'),
            onClick: () => noop,
            icon: 'Unsign',
            disabled: !isActionEnabledWithCapabilities(REMOVE_SIGN) || noCheckedRows
        },
        [TAKE_IN_PROCESS]: {
            id: TAKE_IN_PROCESS,
            title: translate('actions.do.take-in-process'),
            onClick: () => props.assignDocument({
                namespace: LETTER_SCROLLER_NAME,
                resource,
                after: () => (dispatch: Function) => {
                    removeCheckedRows(checkedRows);
                    return dispatch(refetchDataAndCapabilities);
                },
                capabilities
            }),
            icon: 'ToProcessing',
            disabled: !isActionEnabledWithCapabilities(TAKE_IN_PROCESS) || checkedRows.length === 0
        },
        [PROCESS_COMPLETE]: {
            id: PROCESS_COMPLETE,
            title: translate('actions.do.process-complete'),
            onClick: () => props.processComplete({allDocuments: checkedRows})
                .then(() => {
                    removeCheckedRows(checkedRows);
                    getData();
                    getCapabilities([]);
                }),
            icon: 'Confirm',
            disabled: !isActionEnabledWithCapabilities(PROCESS_COMPLETE)
        },
        [REJECT]: {
            id: REJECT,
            title: translate('actions.do.reject'),
            onClick: () => props.rejectDocument({allDocuments: checkedRows})
                .then(() => {
                    removeCheckedRows(checkedRows);
                    getData();
                    getCapabilities([]);
                }),
            icon: 'Refuse',
            disabled: !isActionEnabledWithCapabilities(REJECT)
        },
        [ADD_COMMENT]: {
            id: ADD_COMMENT,
            title: translate('actions.do.add-comment'),
            onClick: () => noop,
            icon: 'AddComment',
            disabled: !isActionEnabledWithCapabilities(ADD_COMMENT) || noCheckedRows
        },
        [CHECK_REQUISITES]: {
            id: CHECK_REQUISITES,
            title: translate('actions.do.check-requisites'),
            onClick: () => noop,
            icon: 'Check',
            disabled: !isActionEnabledWithCapabilities(CHECK_REQUISITES) || noCheckedRows
        },
        [PROCESS]: {
            id: PROCESS,
            title: translate('actions.do.process'),
            onClick: () => noop,
            icon: 'Processed',
            disabled: !isActionEnabledWithCapabilities(PROCESS) || noCheckedRows
        },
        [START_SIGN_CHECKS]: {
            id: START_SIGN_CHECKS,
            title: translate('actions.do.official-sign-verify'),
            onClick: () => noop,
            icon: 'Documents',
            disabled: !isActionEnabledWithCapabilities(START_SIGN_CHECKS) || noCheckedRows
        }
    };

    return filterActionsBarButtonsByFilterCategory(
        buttons,
        checkLetterDirection(),
        categoryName,
        PERFORM_BUTTONS_FILTERING
    );
};

class ActionBarView extends Component <ActionBarViewTypes, ActionBarViewStateTypes> {
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

        const currentTabFilters = statusFiltersToCheckboxOptions({
            translationKeysMatch: officialSubstTranslateKeys,
            rows: allRows
        });

        LETTER_SCROLLER_NAME = letterDirection === TO_BANK
            ? LETTER_SCROLLER_NAME_TO_BANK
            : LETTER_SCROLLER_NAME_FROM_BANK;

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
    return letterDirection === TO_BANK
        ? { ...officialActionFabriqueToBank}
        : { ...officialActionFabriqueFromBank};
};

const getActualCheckedRows = () =>
    (dispatch: Function, getState: Function) =>
        Scroller.selectors.getCheckedRows(getState(), LETTER_SCROLLER_NAME);

export const OfficialConnectedActionBarView =
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
            resource: letterOfficial(letterDirection)
        }),
        (dispatch, {letterDirection}) => bindActionCreators({
            ...getActionFabrique(letterDirection),
            sendDocuments: BackgroundDialog.sendDocuments,
            deleteDocument: deleteDocuments({
                capabilitiesUrl: OFFICIAL_CAPABILITIES_URL,
                sendUrl: (id: string) => getDeleteDocumentOfficialUrl(id)
            }),
            commonSign,
            recallDocument: createCancellationDocument,
            printDocument,
            processComplete: processComplete({
                capabilitiesUrl: OFFICIAL_CAPABILITIES_URL,
                sendUrl: getUrlForOfficialProcessComplete
            }),
            checkSignature: checkSignature({
                capabilitiesUrl: OFFICIAL_CAPABILITIES_URL,
                sendUrl: getSignatureChecksUrl(letterDirection)
            }),
            assignDocument,
            showExportModal,
            exportDocuments,
            getActualCheckedRows,
            rejectDocument: rejectDocuments({
                capabilitiesUrl: OFFICIAL_CAPABILITIES_URL,
                getUrlForReject
            })
        }, dispatch)
    )<any>(ActionBarView);
