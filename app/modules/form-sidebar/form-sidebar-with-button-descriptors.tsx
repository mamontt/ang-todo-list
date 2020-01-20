/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {connect} from 'react-redux';
import {isSubmitting} from 'redux-form';
import {omit, isEmpty, noop, isString, fromPairs, map} from 'lodash';
import {EMPLOYEE, UserContext} from '../../modules/user-context';
import {GoTo} from './../../utils/routing';
import {formSidebarWithCapabilities} from './form-sidebar-with-capabilities';
import {createDescriptorsWithHandlers} from './default-form-sidebar-buttons-descriptors';
import {LetterDirection} from '../define-letter-direction';
import {Client, Letter} from '../../common-types';

export type Descriptors = {
    [side: string]: Array<string>;
}

type FormSidebarWithButtonDescriptorsProps = {
    goTo: GoTo,
    fetchDocumentById?: (documentId: number) => void;
    fetchCapabilitiesById?: (documentId: number) => void,
    getSidebarButtonsDescriptors?: (letterDirection: LetterDirection) => Array<Descriptors>;
    submitting?: boolean;
    disableFields?: boolean;
    defaultHandlers: any;
    buttonsOptions?: Object;
    dispatch?: Function;
    documentId: number;
    userContext: UserContext;
    edocRefId: number;
    number: number;
    createDate: string;
    direction: LetterDirection;
    getChangesHistoryUrl: (id: number) => string;
    getSignUrlFunc: () => string;
    getSignAndSendUrlFunc?: () => string;
    validationNamespace?: string;
    onDocumentChange?: (id: number, toBank: boolean) => void;
    signaturesStoreUid?: number;
    changesHistoryStoreUid?: number;
    changesHistoryNamespace?: string;
    activeTab: string;
    initialValues?: Letter;
    clientSnapshot?: Client;
}

type DescriptorsWithHandlersType = {
    [desc: string]: any
}

export const formSidebarWithButtonDescriptors = (options: any) => {
    const {formName, getSidebarAdditionalButtonsDescriptors = noop} = options;

    const FormSidebarWithCapabilities = formSidebarWithCapabilities(options);

    class FormSidebarWithButtonDescriptors extends React.PureComponent<FormSidebarWithButtonDescriptorsProps> {
        getCustomDescriptors = (descriptors: any) => {
            const {
                documentId,
                userContext: {type: userContext = EMPLOYEE},
                defaultHandlers,
                goTo,
                fetchDocumentById,
                fetchCapabilitiesById
            } = this.props;
            const descriptorsWithHandlers: DescriptorsWithHandlersType = createDescriptorsWithHandlers(defaultHandlers);
            const capabilitiesById = () => fetchCapabilitiesById(documentId);
            const documentById = () => fetchDocumentById(documentId);

            return fromPairs(map(descriptors[userContext], (desc) => {
                if (isString(desc)) {
                    return [
                        desc,
                        descriptorsWithHandlers[desc]
                    ];
                }
                return [
                    desc.capability,
                    {
                        ...omit(desc, 'capability'),
                        onClick: () => this.props.dispatch(desc.actionCreator(
                            documentId,
                            {
                                goTo,
                                fetchCapabilitiesById: capabilitiesById,
                                fetchDocumentById: documentById,
                                props: this.props
                            }
                        ))
                    }
                ];
            }));
        };

        getDescriptors = () => {
            const {
                /* userContext: {type: userContext},
                defaultHandlers, */
                buttonsOptions = {},
                getSidebarButtonsDescriptors = noop
            } = this.props;
            const buttonsDescriptors = getSidebarButtonsDescriptors(buttonsOptions);
            const additionalButtonsDescriptors = getSidebarAdditionalButtonsDescriptors(buttonsOptions);
            if (!isEmpty(buttonsDescriptors)) {
                return this.getCustomDescriptors(buttonsDescriptors);
            }

            /* const defaultDescriptors = pick(
                createDescriptorsWithHandlers(defaultHandlers),
                DEFAULT_FORM_SIDEBAR_BUTTONS_DESCRIPTORS[userContext]
            ); */
            /* if (!isEmpty(additionalButtonsDescriptors)) {
                return merge(
                    defaultDescriptors,
                    this.getCustomDescriptors(additionalButtonsDescriptors)
                );
            } */
            return this.getCustomDescriptors(additionalButtonsDescriptors);
            /* return defaultDescriptors; */
        };

        render() {
            const {submitting} = this.props;
            const otherProps = omit(this.props,
                'submitting',
                'handlers');

            return (
                <FormSidebarWithCapabilities
                    {...otherProps}
                    disableFields={submitting}
                    descriptors={this.getDescriptors()}
                />
            );
        }
    }

    return connect(
        state => ({
            submitting: isSubmitting(formName)(state)
        })
    )(FormSidebarWithButtonDescriptors);
};
