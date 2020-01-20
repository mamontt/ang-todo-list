/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {Component} from 'react';
import {pick} from 'lodash';
import {shallowCompare} from '@vtb/services/utils';
import {PropsFormContainer} from '../official/form-container';

export const withRenderOnSelected = (selected: Array<string>) => (
    WrappedComponent => (
        class FormContainer extends Component<PropsFormContainer> {
            static displayName = `WithRenderOnSelected(${WrappedComponent.displayName || WrappedComponent.name})`;

            shouldComponentUpdate(nextProps: PropsFormContainer) {
                return !shallowCompare(
                    this.getPointedProps(nextProps),
                    this.getPointedProps(this.props),
                );
            }

            getPointedProps = (props: PropsFormContainer) => (
                pick(props, selected)
            );

            render() {
                return (
                    <WrappedComponent {...this.getPointedProps(this.props)} />
                );
            }
        }
    )
);
