/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {includes, get, isEmpty, identity} from 'lodash';
import {connect} from 'react-redux';
import {getFormValues, isDirty} from 'redux-form';
import {memoizeLastWithNamedArgs} from '@vtb/services/utils';
import {TO_BANK, FROM_BANK} from '../../modules/define-letter-direction';
import {EMPLOYEE, OFFICIAL, UserContext} from '../../modules/user-context';
import {getDocumentCapabilities, fetchCapabilities} from '../../modules/capabilities';
import {
    CANCELLATION,
    COPY,
    CREATE,
    EDIT,
    EXPORT,
    PRINT,
    SEND,
    SIGN
} from './../../constants/document-action-capabilities';
import {getCopyFlag} from '../../pages/letter-page/selectors';
import {StoreType} from './../../store/root-selector';
import {SAVE, SAVE_TEMPLATE, CREATE_BY_TEMPLATE, SIGN_AND_SEND} from './actions';
import {Sidebar} from './components/sidebar';
import {Descriptor} from './components/flow-types';
import { LETTER_PAGE_NAME } from '../../pages/letter-page/letter-page-constants';
import {Letter} from '../../common-types';
import {ApiMethod} from '../../utils/fetchable';

interface FormSidebarWithCapabilitiesProps {
    descriptors?: {[Keys: string]: Descriptor};
    documentId?: number;
    disableFields?: boolean;
    capabilities?: Array<string>;
    fetchCapabilities?: (documentId: number) => void;
    userContext?: UserContext;
    direction?: string,
    formValues?: Letter;
    isCopy?: boolean;
    activeTab?: string;
    dirty?: boolean;
}

interface FormSidebarWithCapabilitiesType {
    documentName: string;
    formName: string;
    resource: {
        [method: string]: ApiMethod;
    },
    capabilitiesSubResource: string;
    actionPrefix: string;
}

export const formSidebarWithCapabilities = ({
    documentName,
    formName,
    resource,
    capabilitiesSubResource,
    actionPrefix
}: FormSidebarWithCapabilitiesType) => {
    class FormSidebarWithCapabilities extends React.PureComponent<FormSidebarWithCapabilitiesProps> {
        componentDidMount() {
            const {documentId} = this.props;
            if (documentId) {
                this.props.fetchCapabilities(documentId);
            }
        }

        // TODO: VTBDBODSF-311, VTBDBODSF-312: added requests actions and document info when changing the tab
        componentWillReceiveProps({documentId, activeTab, isCopy}: FormSidebarWithCapabilitiesProps) {
            if ((this.isDocumentChanged(documentId) || activeTab !== this.props.activeTab) && !isCopy) {
                this.props.fetchCapabilities(documentId);
            }
        }

        getCapabilities() {
            const {
                disableFields, capabilities
            } = this.props;
            if (disableFields) {
                return [];
            }
            if (this.isNew()) {
                return [EDIT];
            }
            return [...capabilities, CANCELLATION];
        }

        getActiveButtons = () => {
            const {descriptors} = this.props;
            const capabilities = this.getCapabilities();

            return Object.keys(descriptors).reduce((acc, key) => ({
                ...acc,
                [key]: !this.checkDisabled(capabilities, key)
            }), {});
        };

        cacheValue = memoizeLastWithNamedArgs(identity);

        isDocumentChanged(documentId: number) {
            return documentId !== null && !Number.isNaN(documentId) && documentId !== this.props.documentId;
        }

        checkDisabled = (capabilities: Array<string>, key: string) => {
            const { userContext, direction, formValues} = this.props;
            if (key === CREATE_BY_TEMPLATE) {
                return false;
            }
            if (
                key === SAVE &&
                userContext.type === EMPLOYEE &&
                direction === TO_BANK &&
                (isEmpty(get(formValues, 'clientSnapshot')) || isEmpty(get(formValues, 'branchSnapshot')))
            ) {
                return true;
            }

            if (key === SIGN || key === SEND || key === SIGN_AND_SEND ||
                key === COPY || key === EXPORT || key === PRINT) {
                return this.props.dirty || !includes(capabilities, key);
            }

            if (key === SAVE || key === SAVE_TEMPLATE || key === CREATE_BY_TEMPLATE) {
                if (userContext.type === EMPLOYEE && direction === TO_BANK && isEmpty(get(formValues, 'clientSnapshot'))) {
                    return true;
                }
                if (
                    userContext.type === OFFICIAL &&
                    direction === FROM_BANK &&
                    (isEmpty(get(formValues, 'clients')) || isEmpty(get(formValues, 'branchSnapshot')))
                ) {
                    return true;
                }

                if (get(formValues, 'processing')) {
                    return true;
                }
                return !(includes(capabilities, EDIT) || includes(capabilities, CREATE));
            }

            return !includes(capabilities, key);
        };

        isNew = () => !(this.props.formValues && (this.props.formValues.id));

        render() {
            const {descriptors} = this.props;
            return (
                <Sidebar
                    activeButtons={this.cacheValue(this.getActiveButtons())}
                    descriptors={descriptors}
                />
            );
        }
    }

    return connect((state: StoreType) => ({
        capabilities: getDocumentCapabilities(documentName)(state),
        formValues: getFormValues(formName)(state),
        isCopy: getCopyFlag(state),
        dirty: isDirty(LETTER_PAGE_NAME)(state)
    }), {
        fetchCapabilities: fetchCapabilities(
            {
                documentName,
                resource,
                form: formName,
                capabilitiesSubResource,
                actionPrefix
            }
        )
    })<any>(FormSidebarWithCapabilities);
};
