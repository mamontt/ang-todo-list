/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2018 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {get} from 'lodash';
import styleNames from '@vtb/services/style-names';
import {Direction, LetterDirection} from './../../../modules/define-letter-direction';
import {SystemInformation} from './system-information';
import {Separator} from './separator';
import {ClientAndBranch} from './client-and-branch';
import {TopicAndContent} from './topic-and-content';
import {Attachments} from './attachments';
import styles from '../letter-page.scss';
import {Branch, Client} from '../../../common-types';
import {UserContext} from './../../../modules/user-context';
import {AttachmentType} from '../../../modules/attachments/attachment';

export {PageInspector} from './page-inspector';
export {PagePanel} from './page-panel';

const sn = styleNames(styles);

type InitLetterType = (letterDirection: Direction) => {id: string, name: string};
export type GeneralFormPartialType = {
    letterDirection: LetterDirection;
    isNew?: boolean;
    disableSave?: () => void;
    enableSave?: () => void;
    rejectedFile?: () => void;
    fetchDocumentNumber?: (letterDirection: LetterDirection, clientSnapshot: Client) => void;
    setMyDocumentNumber?: (value: boolean) => void;
    setNumber?: (value: string) => void;
    documentAttachments?: Array<AttachmentType>;
    viewMode?: boolean;
    userContext: UserContext;
    clientSnapshot?: Client;
    clients?: Array<Client>;
    branchSnapshot?: Branch;
    documentId: number;
    isVTB?: boolean;
    documentStatus?: string;
    initialValues: {
        documentNumber: string;
    };
    initLetterType: InitLetterType;
};

export function GeneralFormPartial({
    letterDirection,
    isNew,
    disableSave,
    enableSave,
    rejectedFile,
    clientSnapshot,
    documentAttachments,
    viewMode,
    branchSnapshot,
    documentId,
    userContext,
    isVTB,
    documentStatus,
    fetchDocumentNumber,
    setMyDocumentNumber,
    setNumber,
    clients,
    initialValues
}: GeneralFormPartialType) {
    const hasAttachments =
        get(documentAttachments, 'length') > 0 || viewMode !== true || isNew === true || !documentStatus;
    const currentClientId = get(clientSnapshot, 'id', null);
    const isMultiReceiver = clients && clients.length > 1;

    return (
        <div className={sn('wrap-letters-block')}>
            {/* 001 + 002 + 003 */}
            <SystemInformation
                userContext={userContext}
                viewMode={viewMode}
                letterDirection={letterDirection}
                clientSnapshot={clientSnapshot}
                fetchDocumentNumber={fetchDocumentNumber}
                setMyDocumentNumber={setMyDocumentNumber}
                setNumber={setNumber}
                isDisabledNumber={isMultiReceiver}
                isNew={isNew}
                clients={clients}
                documentStatus={documentStatus}
                initialValues={initialValues}
            />
            <Separator />
            <ClientAndBranch
                letterDirection={letterDirection}
                isNew={isNew}
                clientSnapshot={clientSnapshot}
                branchSnapshot={branchSnapshot}
                isVTB={isVTB}
                userType={userContext.type}
                viewMode={viewMode}
                documentStatus={documentStatus}
                clients={clients}
            />
            {/* 008 + 009 */}
            <TopicAndContent userContext={userContext} letterDirection={letterDirection} />
            {/* 010 + 011 + 012 + 113 */}
            {hasAttachments && (
                <Attachments
                    clientId={currentClientId}
                    documentId={documentId}
                    disableSave={disableSave}
                    enableSave={enableSave}
                    rejectedFile={rejectedFile}
                />
            )}
        </div>
    );
}
