/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {ComponentType} from 'react';
import {noop} from 'lodash';
import {block} from '@vtb/services/bem-helper';
import {ModalForm} from '@vtb/fe-ui-grid';

import {Loader} from '../../modules/loader';
import {ShadePageContent} from './shade-page-content';
import {ShadePageContainer} from './shade-page-container';
import styles from './shade-page.scss';

type ShadePageProps = {
    title: string | JSX.Element;
    onClose: () => void;
    sidebar: JSX.Element;
    documentId?: number;
    documentStatus: string;
    statusDetail: string;
    loaderNamespaces: Array<string>;
    className?: string;
    children?: JSX.Element;
    underHeader: () => JSX.Element;
}

type PropsType = {
    labelTop: string;
    multiline: string;
}

const HEADER_HEIGHT = 48;

export const ShadePage: ComponentType<ShadePageProps> = block('shade-page',
    ({labelTop, multiline}: PropsType) => ({topPosition: labelTop, multiline}),
    {styles})(
    ({
        className,
        children,
        title,
        documentStatus,
        statusDetail,
        underHeader,
        onClose = noop,
        sidebar = null,
        loaderNamespaces = []
    }: ShadePageProps) => {
        const ModalFormComponent = sidebar ? ModalForm.Document : ModalForm.Catalog;
        return (
            <div className={className}>
                <Loader fetchNamespaces={loaderNamespaces}>
                    <ModalFormComponent
                        contentView={() => (
                            <ShadePageContainer>
                                <ShadePageContent>
                                    <ShadePageContentWithScroll>
                                        {children}
                                    </ShadePageContentWithScroll>
                                </ShadePageContent>
                            </ShadePageContainer>
                        )}
                        underHeader={underHeader}
                        underHeaderHeight={HEADER_HEIGHT}
                        sidebarView={() => sidebar}
                        title={title}
                        onClose={onClose}
                        status={documentStatus}
                        statusDetail={statusDetail}
                    />
                </Loader>
            </div>
        );
    }
);

const ShadePageContentWithScroll = (ShadePage as any).element('content-with-scroll')('div');
