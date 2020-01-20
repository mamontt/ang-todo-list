/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {ComponentType} from 'react';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {memoize} from 'lodash';
import {withRouter, Route} from 'react-router-dom';
import {LayoutContent} from '@vtb/fe-ui-headline';
import {closeModal} from '@vtb/fe-ui-dialog';
import {UserContext, withUserContext} from './../../modules/user-context';
import {showForm} from '../../utils/modals';
import {withStackCounterContext} from './../../modules/documents-required-attention-counter/document-stack-counter-hoc';
import {makePath, makeTitle} from './path-utils';
import {GoTo, makeGoTo} from './make-go-to';

type PropsType = {
    match: {
        path: string;
    };
    history: {
        push: (url: string) => void;
    };
    userContext: UserContext;
    callStream: (streamName: string) => void;
    closeModal: () => void;
    counter: {
        quantity: number;
    };
}

interface Window {
    callStream: (streamName: string) => void;
}

declare const window: Window;

const documentRouteComponent = (modalViewName: string, Scroller: ComponentType<any>) =>
    compose(
        connect(null, {closeModal}),
        withUserContext,
        withRouter,
        withStackCounterContext,
    )(({
        match: {path}, history: {push}, userContext, callStream, counter, ...props
    }: PropsType) => {
        const goTo: GoTo = makeGoTo({
            basePath: path,
            push,
            closeModal: props.closeModal,
            noRedirects: false
        });
        window.callStream = callStream;
        return (
            <LayoutContent
                hideTimer={false}
                title={makeTitle(userContext, path)}
                onStackClick={() => callStream('fe-main-page/DocumentRequiringAttention')}
                stackCount={counter.quantity}
            >
                <Scroller goTo={goTo} />
                <Route
                    path={makePath(path).toEditDocument}
                    component={showForm(modalViewName, {
                        goTo,
                        userContext
                    })}
                />
            </LayoutContent>
        );
    });

export const documentRoute = memoize((path, modalViewName, Scroller) => (
    <Route path={path} component={documentRouteComponent(modalViewName, Scroller)} />
));
