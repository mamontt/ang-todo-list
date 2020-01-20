/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {bindActionCreators} from 'redux';
import { getFormValues } from 'redux-form';
import {connect} from 'react-redux';
import {closeModal} from '@vtb/fe-ui-dialog';
import {addNotification} from '@vtb/fe-ui-alert';
import {omit} from 'lodash';
import {showConfirmModal} from '../../modules/confirm';
import {getDocumentCapabilities} from '../../modules/capabilities';
import {GoTo} from './../../utils/routing';
import {StoreType} from './../../store/root-selector';
import {UserContext} from '../../modules/user-context';
import {createSidebarActions} from './form-sidebar-actions';
import {Descriptors, formSidebarWithButtonDescriptors} from './form-sidebar-with-button-descriptors';
import {getDefaultButtonClickHandlers} from './default-form-sidebar-buttons-descriptors';
import {LetterDirection, TO_BANK} from '../define-letter-direction';
import {Letter, Client} from '../../common-types';
import {
    EMPLOYEE_CAPABILITIES_URL,
    OFFICIAL_CAPABILITIES_URL,
    getUrlForSend,
    getUrlForOfficialSend,
    getUrlForOfficialProcessComplete
} from '../../api';
import {processComplete, sendDocuments} from '../group-actions';
import {fetchStart, fetchDone, AfterFetch, FetchStart} from '../../utils/fetchable';
import {AddNotification} from '../../common-types/add-notification';

export type FormSidebarWithButtonHandlersProps = {
    addNotification: AddNotification
    withReload?: boolean;
    documentId: number;
    edocRefId: number;
    number: number;
    branchId?: string;
    createDate: string;
    direction: LetterDirection;
    goTo: GoTo;
    getSignUrlFunc: () => string;
    getSendUrlFunc: () => string;
    getChangesHistoryUrl: (id: number) => string;
    activeTabId: string;
    submitting?: boolean;
    createCancellationDocument?: Function;
    saveDocument?: Function;
    signDocument?: Function;
    sendLetters?: Function;
    signAndSendDocument?: Function;
    deleteDocument?: Function;
    rejectDocument?: Function;
    assignDocument?: Function;
    copyDocument?: Function;
    showConfirmModal?: Function;
    removeSignature?: Function;
    returnDocument?: Function;
    processComplete?: Function;
    onDocumentChange?: (id: number, toBank: boolean) => void;
    getSignAndSendUrlFunc?: () => string;
    closeModal?: () => void;
    userContext: UserContext;
    validationNamespace?: string;
    getSidebarButtonsDescriptors?: (letterDirection: LetterDirection) => Array<Descriptors>;
    signaturesStoreUid?: number;
    changesHistoryStoreUid?: number;
    changesHistoryNamespace?: string;
    activeTab: string;
    initialValues?: Letter;
    clientSnapshot?: Client;
    disableValidation: boolean;
    capabilities: Array<string>;
    pathCreateResponse: any;
    recallAction?: (action: any) => void;
    reloadAction: Function;
    printDocument: Function;
    exportDocument: Function;
    favorite?: (id: number) => void;
    saveTemplate: (param: any) => void;
    createDocumentByTemplate: Function;
    document: Letter;
    fetchStart: FetchStart,
    fetchDone: AfterFetch
}

export const formSidebarWithButtonHandlers = (options: any) => {
    const {
        documentName,
        fetchNamespace,
        formName,
        validationNamespace,
        resource,
        beforeSaveTransducer,
        capabilitiesSubResource,
        actionPrefix
    } = options;
    const FormSidebarWithButtonDescriptors = formSidebarWithButtonDescriptors(options);

    class FormSidebarWithButtonHandlers extends React.PureComponent<FormSidebarWithButtonHandlersProps> {
        render() {
            const {submitting} = this.props;
            const otherProps = omit(this.props,
                'submitting',
                'copyDocument',
                'assignDocument',
                'rejectDocument',
                'showConfirmModal',
                'signDocument',
                'signAndSendDocument',
                'sendLetters',
                'deleteDocument',
                'saveDocument',
                'favorite',
                'removeSignature',
                'returnDocument');

            return (
                <FormSidebarWithButtonDescriptors
                    {...otherProps}
                    disableFields={submitting}
                    defaultHandlers={getDefaultButtonClickHandlers(this.props, beforeSaveTransducer)}
                />
            );
        }
    }

    return connect(
        (state: StoreType) => ({
            capabilities: getDocumentCapabilities(documentName)(state),
            document: getFormValues(formName)(state) as Letter
        }),
        (dispatch, {direction}: any) => bindActionCreators({
            ...createSidebarActions(
                documentName,
                fetchNamespace,
                formName,
                validationNamespace,
                resource,
                capabilitiesSubResource,
                actionPrefix
            ),
            fetchStart,
            fetchDone,
            addNotification,
            showConfirmModal,
            closeModal,
            processComplete: processComplete({
                capabilitiesUrl: OFFICIAL_CAPABILITIES_URL,
                sendUrl: getUrlForOfficialProcessComplete
            }),
            sendLetters: sendDocuments({
                capabilitiesUrl: direction === TO_BANK ? EMPLOYEE_CAPABILITIES_URL : OFFICIAL_CAPABILITIES_URL,
                sendUrl: (id: string) => (direction === TO_BANK ? getUrlForSend(id) : getUrlForOfficialSend(id))
            })
        }, dispatch)
    )(FormSidebarWithButtonHandlers);
};
