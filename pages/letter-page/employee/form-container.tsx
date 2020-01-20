/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {connect} from 'react-redux';
import {ComponentType} from 'react';
import {get} from 'lodash';
import {compose} from 'redux';
import {onChange} from './../../../modules/common-form-hocs';
import {LetterDirection} from './../../../modules/define-letter-direction';
import {StoreType} from './../../../store/root-selector';
import {UserType} from './../../../modules/user-context';
import {withRenderOnSelected} from '../common/with-render-on-selected';
import {GeneralFormPartial} from '../page-partials';
import {disableSave, enableSave, fetchDocumentNumber, rejectedFile} from '../actions';
import {presetBranch} from './actions';

import {
    getClientSnapshot,
    getDocumentAttachments,
    getInitialValuesWithDate,
    getViewMode,
    getDocumentStatus,
    getCurrentValues,
    getClientResponsibleOfficerName,
    getBankResponsibleOfficerName,
    getContent,
    getTopic,
    getNumber
} from '../selectors';
import {setMyDocumentNumber, setNumber} from '../official/actions';
import {Client, Letter} from '../../../common-types';
import {AttachmentType} from '../../../modules/attachments/attachment';

type Props = {
    initialValues: Object;
    viewMode: boolean;
    clientSnapshot: Client;
    documentAttachments: Array<AttachmentType>;
    currentValues: Letter;
    clientResponsibleOfficerName: string;
    bankResponsibleOfficerName: string;
    content: string;
    topic: string;
    number: number;
    documentStatus: string;
    documentId?: number | string;
    disableSave?: () => void;
    enableSave?: () => void;
    rejectedFile?: () => void;
    presetBranch?: () => void;
};

type PropType = {
    letterDirection: LetterDirection;
    userContext: UserType;
    formValues: Letter;
}

export const FormContainer: ComponentType<any> = compose(
    withRenderOnSelected([
        'documentId',
        'letterDirection',
        'disableSave',
        'enableSave',
        'clientSnapshot',
        'rejectedFile',
        'documentAttachments',
        'viewMode',
        'documentStatus',
        'userContext'
    ]),
    onChange(['formValues.clientSnapshot'], (newProps: PropType, oldProps: PropType) => {
        presetBranch(
            newProps.letterDirection,
            get(oldProps, 'formValues.clientSnapshot'),
            get(newProps, 'formValues.branchSnapshot'),
            oldProps.formValues,
            newProps.formValues
        );
    }),
    connect(
        (state: StoreType): Props => ({
            initialValues: getInitialValuesWithDate(state),
            viewMode: getViewMode(state),
            documentStatus: getDocumentStatus(state),
            clientSnapshot: getClientSnapshot(state),
            documentAttachments: getDocumentAttachments(state),
            currentValues: getCurrentValues(state),
            clientResponsibleOfficerName: getClientResponsibleOfficerName(state),
            bankResponsibleOfficerName: getBankResponsibleOfficerName(state),
            content: getContent(state),
            topic: getTopic(state),
            number: getNumber(state)
        }),
        {
            disableSave,
            enableSave,
            rejectedFile,
            presetBranch,
            fetchDocumentNumber,
            setMyDocumentNumber,
            setNumber
        }
    )
)(GeneralFormPartial);
