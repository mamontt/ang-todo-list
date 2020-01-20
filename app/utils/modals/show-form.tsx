/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {connect} from 'react-redux';
import {push} from 'react-router-redux';
import {showModal, closeModal, modalSelectors} from '@vtb/fe-ui-dialog';
import {GoTo} from '../../utils/routing';
import {UserContext} from '../../modules/user-context';
import {getLetterDirection} from '../../modules/define-letter-direction/define-letter-direction-selectors';

type ModalType = {
    view: string;
    closing: boolean;
}

type ShowFormProps = {
    showModal: (modalViewName: string, modalProps: ModalPropsType) => void;
    closeModal: () => void;
    pushUrl: (uri: string) => void;
    setActiveTab: (activeTab: string) => void;
    modals: Array<ModalType>;
    letterDirection: string;
    location: {
        pathname: string;
    };
}

type ModalPropsType = {
    goTo: GoTo;
    userContext: UserContext;
    documentId?: number;
}

const getDocumentId = (path: string) => {
    const items = path.split('/');
    const value = items[items.length - 1];
    if (value === 'new') {
        return null;
    }
    return parseInt(value, 10);
};

export const showForm = (
    modalViewName: string,
    modalProps: ModalPropsType
) => connect(
    state => ({
        modals: modalSelectors.getModals(state),
        letterDirection: getLetterDirection(state)
    }),
    ({showModal, closeModal, pushUrl: push})
)(
    class extends React.PureComponent<ShowFormProps> {
        componentDidMount() {
            const {
                showModal: show,
                location,
                modals = []
            } = this.props;
            const documentId = getDocumentId(location.pathname);
            const isAlreadyOpened = modals.some(({view}: ModalType) => view === modalViewName);
            if (!isAlreadyOpened) {
                show(
                    modalViewName,
                    {
                        ...modalProps,
                        documentId
                    }
                );
            }
        }

        render() {
            return '';
        }
    }
);
