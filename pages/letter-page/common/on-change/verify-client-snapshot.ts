/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {change} from 'redux-form';
import {AnyAction, Dispatch} from 'redux';
import fetch from '@vtb/services/request';
import {OnChangeLog} from '../../../../modules/common-form-hocs/on-change';
import {LETTER_PAGE_NAME} from '../../letter-page-constants';
import {GET} from '../../../../constants/request-types';
import {DICTIONARY_CLIENTS_URL} from '../../../../api/dictionaries';
import {Client} from '../../../../common-types';
import {LetterPageContainerProps} from '../../official/letter-page-container';
import {getNewLetterFromBank} from '../../../letter-scroller/selectors';

type Response = {
    data: {
        data: Array<Client>;
    };
}

export type VerifyClientSnapshot = (
    {
        branchSnapshot, clientSnapshot, clients, documentId, letterDirection
    }: LetterPageContainerProps,
    prevProps: LetterPageContainerProps,
    log: OnChangeLog
) => void;
export const verifyClientSnapshot = (
    {
        branchSnapshot, clientSnapshot, documentId, letterDirection, clients
    }: LetterPageContainerProps,
    prevProps: LetterPageContainerProps,
    log: OnChangeLog
) => (dispatch: Dispatch<AnyAction>) => {
    if (prevProps) {
        const isNewLetterFromBank = getNewLetterFromBank(documentId === null, letterDirection);
        const activeField = isNewLetterFromBank ? 'clients' : 'clientSnapshot';

        const getClientsByBranchId = (id: number) =>
            fetch({
                url: DICTIONARY_CLIENTS_URL,
                method: GET,
                params: {branchId: id}
            }).then((response: Response) => response.data.data);

        const reset = (field: string, value: Client | null = null, reason: string = null) => {
            const formattedReason = reason && `[Reason: ${reason}]`;
            log(`[verifyClientSnapshot]${formattedReason} ${field} ->`, value);
            dispatch(change(LETTER_PAGE_NAME, field, value));
        };

        const clearBranchSnapshot = prevProps.branchSnapshot && !branchSnapshot;

        if (clearBranchSnapshot) {
            reset(activeField, null, 'branch snapshot has been cleared');
            return;
        }

        getClientsByBranchId(branchSnapshot.id).then((availableClients: Array<Client>) => {
            const selectedClientsIds: Array<number> = isNewLetterFromBank
                ? (clients && clients.map((client: Client) => client.id)) || []
                : [clientSnapshot.id];
            const newClientsIds: Array<number> = availableClients.map((newClient: Client) => newClient.id) || [];
            const selectedClientIsValid = selectedClientsIds.every((id: number) => newClientsIds.indexOf(id) !== -1);

            if (!selectedClientIsValid) {
                const singleClientAvailable = availableClients && availableClients.length === 1;
                const value = singleClientAvailable ? availableClients[0] : null;
                reset(activeField, value, 'selected client is not valid');
                log('client details', {
                    availableClients,
                    newClientsIds,
                    selectedClientIsValid,
                    singleClientAvailable,
                    value
                });
            }
        });
    }
};
