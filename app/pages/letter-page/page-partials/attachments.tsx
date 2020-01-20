/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {Grid} from '@vtb/fe-ui-grid';
import {translate} from './../../../utils/translate';
import {Attachment} from './../../../modules/attachments';
import {Text} from './../../../components/text';

type AttachmentsPropsType = {
    enableSave: () => void;
    disableSave: () => void;
    rejectedFile: () => void;
    clientId?: number;
    documentId?: number;
}

export const Attachments = ({
    enableSave,
    disableSave,
    rejectedFile,
    clientId,
    documentId
}: AttachmentsPropsType) => (
    <Grid.Grid>
        <Grid.Row>
            <Text formHeader>{translate('common.attachments')}</Text>
        </Grid.Row>
        <Grid.Row>
            <Grid.Col col={12}>
                <Attachment
                    downloadEndpoint={`/letters/letters/${documentId}/attachments`}
                    deleteEndpoint={`/letters/letters/${documentId}/attachments`}
                    name="attachments"
                    startUpload={disableSave}
                    finishUpload={enableSave}
                    onRejectedFile={rejectedFile}
                    clientExtId={clientId}
                />
            </Grid.Col>
        </Grid.Row>
        <Grid.Row margin={Grid.MARGIN.L} />
    </Grid.Grid>
);
