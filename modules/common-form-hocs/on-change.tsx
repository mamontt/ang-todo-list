/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {get} from 'lodash';
import {log} from '@vtb/services/logger';

export type OnChangeLog = (message: string, value: any) => any;
export type OnChangeCallback = (props: any, prevProps?: any, log?: OnChangeLog) => any;

export const onChange = (propNameOrNames: Array<string> | string, callback: OnChangeCallback) => {
    const propNames = Array.isArray(propNameOrNames) ? propNameOrNames : [propNameOrNames];
    return (WrappedComponent: any) =>
        class WithOnChange extends React.Component {
            static displayName = `WithOnChange(${WrappedComponent.displayName || WrappedComponent.name})`;

            componentDidMount() {
                const triggeredProps = propNames.filter(propName => propName in this.props);
                if (triggeredProps.length) {
                    callback(this.props, null, this.logWithTriggeredProps(triggeredProps));
                    triggeredProps.forEach(prop => this.log(`${prop} = `, get(this.props, prop)));
                }
            }

            componentWillReceiveProps(nextProps: Object) {
                const triggeredProps = propNames.filter(
                    propName => get(nextProps, propName) !== get(this.props, propName)
                );
                if (triggeredProps.length) {
                    callback(nextProps, this.props, this.logWithTriggeredProps(triggeredProps));
                    triggeredProps.forEach(prop => {
                        this.log(`${prop} changed:`, {
                            old: get(this.props, prop),
                            new: get(nextProps, prop)
                        });
                    });
                }
            }

            logWithTriggeredProps: (triggeredProps: Array<string>) => OnChangeLog = triggeredProps => (
                message,
                value
            ) => this.log(`[${triggeredProps}] ${message}`, value);

            log: OnChangeLog = (message, value) => log.log(`[ON CHANGE] ${message}`, value);

            render() {
                return <WrappedComponent {...this.props} />;
            }
        };
};
