/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {push} from 'react-router-redux';
import {showModal, closeModal} from '@vtb/fe-ui-dialog';
import {omit} from 'lodash';
import {AnyAction, Dispatch} from 'redux';
import {
    LETTER_TO_BANK,
    LETTER_TO_BANK_NEW,
    LETTER_FROM_BANK,
    EMPLOYEE_LETTER_FROM_BANK,
    EMPLOYEE_LETTER_FROM_BANK_NEW,
    EMPLOYEE_LETTER_TO_BANK
} from './constants/routes';
import {LettersApiCallsType, LettersApiOptionsType} from './common-types/front-api/fe-letters/calls';
import {makeGoTo, GoTo} from './utils/routing/make-go-to';
import {LETTER_PAGE_NAME} from './pages/letter-page';
import {EMPLOYEE, OFFICIAL} from './modules/user-context';
import {cancelRequestAdditionalForm} from './cancel-request-additional-form';
import {bundleNameSelector} from './store/root-selector';
import map from '../export/routes-map.json';
import {LetterDirection} from './modules/define-letter-direction';

export type InitProps = {
    id?: number | string;
    clientSnapshotId?: number;
    dsfTypeId?: number;
    letterDirection?: LetterDirection;
}

const pathTo = (uri: string) => `${map.mountPath}/${uri}`;
const modalFactory = (dispatch: Function, basePath: string, type: string) => (
    documentId: number,
    props?: InitProps,
    options: {noRedirects: boolean} = {noRedirects: false}
) => {
    const closeModalAction = () => dispatch(closeModal());
    const goTo: GoTo = makeGoTo({
        basePath: pathTo(basePath),
        push: (location: Location, state?: LettersApiOptionsType) => dispatch(push(location, state)),
        closeModal: closeModalAction,
        noRedirects: options.noRedirects
    });
    const initProps = omit(props, ['id']);
    return dispatch(
        showModal(LETTER_PAGE_NAME, {
            initProps,
            goTo,
            userContext: {type},
            documentId
        }),
    );
};

export const initStream = (id: LettersApiCallsType, state: LettersApiOptionsType) => (
    dispatch: Dispatch<AnyAction>, getState: Function
) => {
    const modal = modalFactory(dispatch, LETTER_TO_BANK, EMPLOYEE);
    switch (id) {
        case 'letters/LettersToBank':
            dispatch(
                push({
                    pathname: pathTo(LETTER_TO_BANK),
                    state: state.scroller
                }),
            );
            break;
        case 'letters/LettersFromBank':
            dispatch(
                push({
                    pathname: pathTo(LETTER_FROM_BANK),
                    state: state.scroller
                }),
            );
            break;
        case 'letters/CreateLetter':
            if (bundleNameSelector(getState()) === 'fe-letters' && !state.noRedirects) {
                dispatch(
                    push({
                        pathname: pathTo(LETTER_TO_BANK_NEW)
                    }),
                );
            } else {
                modal(null, state, { noRedirects: true });
            }
            break;
        case 'letters/CreateStreamLetter':
            if (bundleNameSelector(getState()) === 'fe-letters') {
                dispatch(
                    push({
                        pathname: pathTo(LETTER_TO_BANK_NEW)
                    }),
                );
            } else {
                modal(null);
            }
            break;
        case 'letters/EditLetter':
            modal(Number(state.id));
            break;
        case 'letters/ShowLetter':
            modal(Number(state.id), state, { noRedirects: state.noRedirects });
            break;
        case 'cancel-requests/quick-view/letters':
            state.setMapper(cancelRequestAdditionalForm());
            break;
        case 'cancel-requests/modal-view/letters':
            state.setMapper(cancelRequestAdditionalForm());
            break;
        default:
            // eslint-disable-next-line no-console
            console.error(`Stream letters can't resolve ${id}`);
    }
};

export const initOfficialStream = (id: LettersApiCallsType, state: LettersApiOptionsType) => (
    dispatch: Dispatch<AnyAction>, getState: Function
) => {
    const modal = modalFactory(dispatch, EMPLOYEE_LETTER_FROM_BANK, OFFICIAL);
    switch (id) {
        case 'letters/LettersToBank':
            dispatch(
                push({
                    pathname: pathTo(EMPLOYEE_LETTER_TO_BANK),
                    state: state.scroller
                }),
            );
            break;
        case 'letters/LettersFromBank':
            dispatch(
                push({
                    pathname: pathTo(EMPLOYEE_LETTER_FROM_BANK),
                    state: state.scroller
                }),
            );
            break;
        case 'letters/CreateLetter':
            if (bundleNameSelector(getState()) === 'fe-letters') {
                dispatch(
                    push({
                        pathname: pathTo(EMPLOYEE_LETTER_FROM_BANK_NEW)
                    }),
                );
            } else {
                modal(null, state, { noRedirects: true });
            }
            break;
        case 'letters/CreateStreamLetter':
            if (bundleNameSelector(getState()) === 'fe-letters') {
                dispatch(
                    push({
                        pathname: pathTo(EMPLOYEE_LETTER_FROM_BANK_NEW)
                    }),
                );
            } else {
                modal(null);
            }
            break;
        case 'letters/EditLetter':
            modal(Number(state.id));
            break;
        case 'letters/ShowLetter':
            modal(Number(state.id));
            break;
        case 'cancel-requests/quick-view/letters':
            state.setMapper(cancelRequestAdditionalForm());
            break;
        case 'cancel-requests/modal-view/letters':
            state.setMapper(cancelRequestAdditionalForm());
            break;
        default:
            // eslint-disable-next-line no-console
            console.error(`Stream letters can't resolve ${id}`);
    }
};

window['fe-letters.version'] = '1.7.0.9';
