/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2018 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {PureComponent} from 'react';
import {connect} from 'react-redux';
import {find} from 'lodash';
import {reduxForm} from 'redux-form';
import {compose} from 'redux';
import {closeModal as closeModalAction} from '@vtb/fe-ui-dialog';
import {Loader} from '@vtb/fe-ui-loader';
import styleNames from '@vtb/services/style-names';
import {OFFICIALS_ASSIGN, putDictionaryToStore} from '../../../modules/dictionary-new';
import {translate} from './../../../utils/translate';
import {StoreType} from './../../../store/root-selector';
import {combineValidators, required} from './../../../utils/common-validators';
import {POST} from '../../../constants/request-types';
import {
    assignDocument as assignDocumentAction,
    DOCUMENT_ASSIGN_FORM_NAME
} from './document-assign-actions';
import {getUserSelector, getCapability, getInitialValues, getFormValue, getOfficials} from './selectors';
import {SinglePopup, MultiplyPopup, DocumentAssignForm} from './components';
import styles from './document-assign-popup-loader-container.scss';
import {OfficialCommonDto} from '../../dictionary-new';

const sn = styleNames(styles);

type DocumentAssignPopupTypes = {
    modalParams: {
         onAssign: Function,
         branchId?: Array<string>,
         capabilities: Array<string>,
         multiply?: boolean,
        documents?: Array<Object>
    },
    officials: Array<OfficialCommonDto>,
    assignDocument: Function,
    loadOfficials: Function,
    closeModal: Function,
    id: string | number,
    capability: string,
    user: {
        fio: string,
        id: number
    }
};

type DocumentAssignStateTypes = {
    loaded: boolean
}

export class DocumentAssignPopupClass extends PureComponent<DocumentAssignPopupTypes, DocumentAssignStateTypes> {
    state = {
        loaded: false
    };

    componentDidMount() {
        this.props.loadOfficials(this.props.modalParams.branchId)
            .then(() => this.setState({loaded: true}));
    }

    onAssign = () => {
        const {
            modalParams: {
                onAssign
            },
            officials = [],
            assignDocument,
            id
        } = this.props;

        const user = find(officials, {id}) || {};

        assignDocument({ data: user, onAssign});
    };

    render() {
        const {
            closeModal, officials = [], capability, user, id, modalParams: {multiply, documents}
        } = this.props;

        const {loaded} = this.state;

        const commonParams = {
            title: translate('modals.takeInProcessModalTitle'),
            onCancel: closeModal,
            onConfirm: this.onAssign,
            cancelButtonTitleKey: 'buttons.cancel',
            confirmButtonTitleKey: 'buttons.continue',
            bottomElement: loaded ?
                <DocumentAssignForm
                    officials={officials}
                    capability={capability}
                    user={user}
                />
                :
                <div className={sn('document-assign-popup-loader-container')}>
                    <Loader.InContainer />
                </div>,
            disabled: !(loaded && (id || id === 0)),
            loaded
        };

        return (
            multiply
                ? <MultiplyPopup
                    {...commonParams}
                    documents={documents}

                />
                : <SinglePopup
                    {...commonParams}
                />
        );
    }
}

export const DocumentAssignPopup = compose(
    connect((state: StoreType, {modalParams: {capabilities}}: DocumentAssignPopupTypes) => ({
        officials: getOfficials(state),
        id: getFormValue(state, DOCUMENT_ASSIGN_FORM_NAME, 'userId'),
        user: getUserSelector(state),
        capability: getCapability(capabilities),
        initialValues: getInitialValues(capabilities)(state)
    }), {
        loadOfficials: (branchId: number) => putDictionaryToStore({
            name: OFFICIALS_ASSIGN,
            fetchParams:
                {
                    method: POST,
                    queryParams: {
                        locale: 'ru_RU',
                        branchId,
                        size: 10000,
                        sort: 'fio'
                    }
                },
            refetch: true
        }),
        assignDocument: assignDocumentAction,
        closeModal: closeModalAction
    }),
    reduxForm({
        form: DOCUMENT_ASSIGN_FORM_NAME,
        enableReinitialize: true,
        validate: combineValidators(
            required('userId')
        )
    })
)(DocumentAssignPopupClass as any);
