/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {LetterPageContainerProps} from '../../official/letter-page-container';
import {Props} from '../../employee/letter-page-container';

export type VerifyDocumentNumber = (
    {
        clientSnapshot,
        letterDirection,
        pristine,
        isMyDocumentNumber,
        initialValues,
        setNumber,
        resetNumber,
        fetchDocumentNumber
    }: LetterPageContainerProps | Props
) => void;
export const verifyDocumentNumber = (
    {
        clientSnapshot,
        letterDirection,
        pristine,
        isMyDocumentNumber,
        initialValues,
        setNumber,
        resetNumber,
        fetchDocumentNumber
    }: LetterPageContainerProps
) => () => {
    if (!(pristine || isMyDocumentNumber)) {
        if (clientSnapshot) {
            const isInitialClient =
                initialValues.clientSnapshot && initialValues.clientSnapshot.id === clientSnapshot.id;
            if (isInitialClient) {
                setNumber(initialValues.documentNumber);
            } else {
                fetchDocumentNumber(letterDirection, clientSnapshot);
            }
        } else {
            resetNumber();
        }
    }
};
