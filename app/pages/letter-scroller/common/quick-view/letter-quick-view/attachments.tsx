/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {AttachmentsListQuickView} from './../../../../../modules/attachments';
import {DocumentValues} from '../../../../../pages/letter-scroller/flow-types';

type PropsType = {
    documentValues: DocumentValues
};

export class Attachments extends React.Component<PropsType> {
    render() {
        const {documentValues} = this.props;
        return (
            <AttachmentsListQuickView
                value={documentValues.attachments}
                downloadEndpoint={`/letters/letters/${documentValues.id}/attachments`}
            />
        );
    }
}
