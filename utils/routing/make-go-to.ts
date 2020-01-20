/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {memoize} from 'lodash';
import {makePath, DOCUMENT_ID_PARAM} from './path-utils';

export type GoTo = {
    scroller: () => void;
    newDocument: ({copyFrom}: {copyFrom: number}) => void;
    editDocument: (id: number | string) => void;
}

type GoToParams = {
    basePath: string;
    push: any;
    closeModal: () => void;
    noRedirects: boolean;
}

export const makeGoTo = memoize(({
    basePath,
    push,
    closeModal,
    noRedirects
}: GoToParams) => {
    const path = makePath(basePath);
    return {
        scroller: () => {
            closeModal();
            if (!noRedirects) {
                push(path.toScroller);
            }
        },
        newDocument: ({copyFrom}: {copyFrom: number}) => {
            const withNoRedirectsCopyFrom = () => {
                if (copyFrom) {
                    push(`${path.toNewDocument}?copyFrom=${copyFrom}`);
                }
            };
            const withCopyFrom = (source: string) => (copyFrom ? push(`${source}?copyFrom=${copyFrom}`) : push(source));
            return noRedirects ? withNoRedirectsCopyFrom() : withCopyFrom(path.toNewDocument);
        },
        editDocument: (id: string) => {
            if (!noRedirects) {
                push(path.toEditDocument.replace(`:${DOCUMENT_ID_PARAM}`, id));
            }
        }
    };
});
