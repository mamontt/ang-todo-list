/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {ComponentType} from 'react';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {onChange} from './../../../modules/common-form-hocs';
import {StoreType} from './../../../store/root-selector';
import {LetterDirection} from './../../../modules/define-letter-direction';
import {GeneralFormPartial} from '../page-partials';
import {disableSave, enableSave, fetchDocumentNumber, rejectedFile} from '../actions';
import {presetClient, setMyDocumentNumber, setNumber} from './actions';
import {withRenderOnSelected} from '../common/with-render-on-selected';
import {getClients, getCurrentValues, getDocumentStatus, getInitialValuesWithDate} from '../selectors';
import {Branch, Client, Letter} from '../../../common-types';
import {AttachmentType} from '../../../modules/attachments/attachment';

export type PropsFormContainer = {
    initialValues: Object;
    currentValues: Letter;
    clients: Array<Client>;
    documentId?: number;
    viewMode?: boolean;
    documentStatus?: boolean;
    branchSnapshot?: Branch;
    clientSnapshot?: Client;
    documentAttachments?: Array<AttachmentType>;
    clientResponsibleOfficerName?: string;
    bankResponsibleOfficerName?: string;
    content?: string;
    number?: number;
    isVTB?: boolean;
    disableSave?: () => void;
    enableSave?: () => void;
    rejectedFile?: () => void;
    presetClient?: (
        letterDirection: LetterDirection,
        clientSnapshot: Client,
        branchSnapshot: Branch,
        initialValues: Object,
        currentValues: Letter,
        isVTB: boolean,
        clients: Array<Client>,
        documentId: number
    ) => void;
    letterDirection?: LetterDirection;
    isBranchPAO_VTB?: boolean;
}

export const FormContainer: ComponentType<any> = compose(
    withRenderOnSelected([
        'documentId',
        'letterDirection',
        'enableSave',
        'disableSave',
        'clientSnapshot',
        'branchSnapshot',
        'rejectedFile',
        'documentAttachments',
        'viewMode',
        'userContext',
        'isNew',
        'documentStatus',
        'isVTB'
    ]),
    connect((state: StoreType): PropsFormContainer => ({
        initialValues: getInitialValuesWithDate(state),
        currentValues: getCurrentValues(state),
        clients: getClients(state),
        documentStatus: getDocumentStatus(state)
    }), {
        disableSave,
        enableSave,
        rejectedFile,
        presetClient,
        fetchDocumentNumber,
        setMyDocumentNumber,
        setNumber
    }),
    onChange(
        'branchSnapshot',
        ({
            letterDirection,
            clientSnapshot,
            branchSnapshot,
            initialValues,
            currentValues,
            isVTB,
            clients,
            documentId,
            ...props
        }: PropsFormContainer) => props.presetClient(
            letterDirection,
            clientSnapshot,
            branchSnapshot,
            initialValues,
            currentValues,
            isVTB,
            clients,
            documentId
        )
    )
)(GeneralFormPartial);
