/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {ComponentType} from 'react';
import {connect} from 'react-redux';
import {getDirection} from './../../pages/letter-page/selectors';
import {InitProps} from './../../init-stream';
import {FROM_BANK, TO_BANK} from './define-letter-direction-constants';
import {StoreType} from '../../store/root-selector';

type PropsType = {
    documentId: number,
    userContext: {
        type: string
    },
    initProps: InitProps
};

type PropsDirection = {
    [str: string]: string
}

export const mapStateToProps = (state: StoreType, {documentId, userContext, initProps = {}}: PropsType): Object => {
    if (initProps.letterDirection) {
        return {letterDirection: initProps.letterDirection};
    }
    const isNew = !documentId;
    const formDirection = getDirection(state);
    const direction: PropsDirection = {
        EMPLOYEE: TO_BANK,
        OFFICIAL: FROM_BANK
    };
    const directionForm: PropsDirection = {
        true: TO_BANK,
        false: FROM_BANK
    };

    return {
        letterDirection:
            (isNew || formDirection === undefined)
                ? direction[userContext && userContext.type]
                : directionForm[formDirection]
    };
};

export const defineLetterDirection = (WrappedComponent: ComponentType<any>) =>
    connect(
        mapStateToProps,
        null
    )(WrappedComponent);
