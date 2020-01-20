/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2018 VTB Group. All rights reserved.
 */
import {SHOW_CENTER, SHOW_RIGHT} from '@vtb/fe-ui-dialog';
import {MODAL_NAMES} from './../../constants/modal-names';
import {MODAL_LARGE} from '../../constants/size';
import {modalCloseChangeLocation} from './../../utils/routing';
import {FormModalTemplate} from './create-template';
import {ModalTemplates} from './scroller';

export const FormTemplatesModals = [
    {
        view: MODAL_NAMES.FORM_TEMPLATE_CREATE,
        type: SHOW_CENTER,
        component: modalCloseChangeLocation(FormModalTemplate),
        params: {},
        closable: false
    },
    {
        view: MODAL_NAMES.FORM_TEMPLATES_SCROLLER,
        type: SHOW_RIGHT,
        component: modalCloseChangeLocation(ModalTemplates),
        closable: false,
        params: {
            width: MODAL_LARGE
        }
    }
];
