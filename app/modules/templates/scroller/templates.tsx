/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2018 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {connect} from 'react-redux';
import {ModalForm} from '@vtb/fe-ui-grid';
import {closeModal as closeModalAction} from '@vtb/fe-ui-dialog';
import {translate} from './../../../utils/translate';
import {TemplatesScroller} from './scroller';
import {TEMPLATES_DESCRIPTORS} from '../template-descriptors';
import {ModalTemplatesType} from '../flow-types';

const ModalTemplatesClass = ({
    closeModal,
    modalParams: {
        clientId, docTypeId, createModalTemplates, deleteTemplate
    }
}: ModalTemplatesType) => (
    <ModalForm.Catalog
        onClose={closeModal}
        title={translate('template.title-list')}
        contentView={() => (<TemplatesScroller
            docTypeId={docTypeId}
            filterView={TEMPLATES_DESCRIPTORS[docTypeId].filterView}
            createModalTemplates={createModalTemplates}
            deleteTemplate={deleteTemplate}
        />)}
    />
);

export const ModalTemplates = connect(
    null,
    {closeModal: closeModalAction}
)(ModalTemplatesClass);
