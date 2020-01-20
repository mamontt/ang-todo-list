/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {ApiMethod} from './../../utils/fetchable';

type BindDecoratorProps = {
    [idName: string]: {
        binderReducer: {
            dispatchAction: (action: ApiMethod) => Function;
        },
        actionMap: {
            [actionName: string]: ApiMethod;
        }
    } | null;
}

type State = {
    [idName: string]: number;
}

type Props = Object;

export function bindStoreId(
    stores: BindDecoratorProps
) {
    return (WrappedComponent: any) => {
        class BindedStore extends React.PureComponent<Props, State> {
            constructor(props: Props) {
                super(props);

                this.state = Object.keys(stores).reduce((mem, idName) => ({...mem, [idName]: ''}), {});

                this.initHandlers = Object.keys(stores).reduce((mem: Array<BindDecoratorProps>, idName) => ({
                    ...mem,
                    [idName]: (id: number) => {
                        this.setState({[idName]: id});
                    }
                }), {});

                this.actions = Object.keys(stores).reduce((mem, idName) => ({
                    ...mem,
                    [idName]: this.wrapAllActions(idName)
                }), {});
            }

            initHandlers: any;
            actions: any;

            wrapAllActions(idName: string) {
                if (!stores[idName]) { return undefined; }
                const {actionMap = null} = stores[idName];
                if (!actionMap) { return undefined; }

                return Object.keys(actionMap).reduce((mem, actionName) => ({
                    ...mem,
                    [actionName]: this.wrapAction(idName, actionMap[actionName])
                }), {});
            }

            wrapAction(idName: string, action: ApiMethod) {
                const wrappedAction = stores[idName].binderReducer.dispatchAction(action);
                const scopeUid = this.state[idName];

                return (...args: Array<Object>) => wrappedAction(scopeUid, ...args);
            }

            render() {
                return (
                    <WrappedComponent
                        {...this.props}
                        scopeActions={this.actions}
                        scopeInitHandlers={this.initHandlers}
                        scopeUids={this.state}
                    />
                );
            }
        }

        return BindedStore;
    };
}
