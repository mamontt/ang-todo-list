/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2018 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {Fragment} from 'react';
import {get, reverse} from 'lodash';
import {connect} from 'react-redux';
import {LetterDirection, FROM_BANK} from './../../../modules/define-letter-direction';
import {ActionCreator} from './../../../utils/common-flow-types';
import {Client} from './client';
import {Branch} from './branch';
import {
    clearClientResponsibleOfficer as clearClient,
    presetClientResponsibleOfficerPhone as presetClientPhone,
    presetBankResponsibleOfficerPhone as presetBankPhone
} from '../actions';
import {Branch as BranchProps, Client as ClientProps} from '../../../common-types';

type OwnProps = {
    letterDirection: LetterDirection;
    isNew: boolean;
    clients: Array<ClientProps>;
    clientSnapshot: ClientProps;
    branchSnapshot: BranchProps;
    viewMode: boolean;
    isVTB?: boolean;
    userType?: string;
    documentStatus?: string;
}

type DispatchProps = {
    clearClientResponsibleOfficer: ActionCreator;
    clearBankResponsibleOfficer?: ActionCreator;
    presetClientResponsibleOfficerPhone: ActionCreator;
    presetBankResponsibleOfficerPhone: ActionCreator;
};

type Props = OwnProps & DispatchProps;

const ClientAndBranchComponent = ({
    letterDirection,
    isNew,
    clientSnapshot,
    branchSnapshot,
    isVTB,
    clearClientResponsibleOfficer,
    presetClientResponsibleOfficerPhone,
    presetBankResponsibleOfficerPhone,
    userType,
    viewMode,
    documentStatus,
    clients
}: Props) => {
    const onlyClientId = (clients && clients.length === 1) ? get(clients, '[0].id') : null;
    const moreOneClient = clients && clients.length > 1;
    const clientId = clientSnapshot ? clientSnapshot.id : onlyClientId;
    const components = [
        /* 005 + 006 + 007 */
        <Client
            letterDirection={letterDirection}
            branchSnapshot={branchSnapshot}
            isNew={isNew}
            key="clientSnapshot"
            isVTB={isVTB}
            clientId={clientId}
            clearResponsibleOfficer={clearClientResponsibleOfficer}
            presetResponsibleOfficerPhone={presetClientResponsibleOfficerPhone}
            userType={userType}
            viewMode={viewMode}
            documentStatus={documentStatus}
            moreOneClient={moreOneClient}
        />,
        /* 004 + 025 */
        <Branch
            letterDirection={letterDirection}
            key="branchSnapshot"
            branchId={branchSnapshot && branchSnapshot.id}
            presetResponsibleOfficerPhone={presetBankResponsibleOfficerPhone}
            userType={userType}
            viewMode={viewMode}
            documentStatus={documentStatus}
        />
    ];

    return (
        <Fragment>
            {letterDirection === FROM_BANK ? reverse(components) : components}
        </Fragment>
    );
};

export const ClientAndBranch = connect(
    null,
    {
        clearClientResponsibleOfficer: clearClient,
        presetClientResponsibleOfficerPhone: presetClientPhone,
        presetBankResponsibleOfficerPhone: presetBankPhone
    }
)(ClientAndBranchComponent);
