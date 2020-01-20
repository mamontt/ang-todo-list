/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2018 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {PureComponent, ComponentType, ReactNode} from 'react';
import {connect} from 'react-redux';
import {closeModal as closeModalAction} from '@vtb/fe-ui-dialog';

type ModalCloseRouteClassStateType = {
    location: string;
}

type ModalCloseRouteClassPropsType = {
    location: string;
    children: ReactNode;
    closeModal: typeof closeModalAction; // eslint-disable-line react/no-unused-prop-types
}

export const modalCloseChangeLocation = (WrappedComponent: ComponentType<any>) =>
    connect(null, {
        closeModal: closeModalAction
    })(
        class modalCloseRouteClass extends PureComponent<ModalCloseRouteClassPropsType, ModalCloseRouteClassStateType> {
            static getDerivedStateFromProps(
                {location: newLocation, closeModal}: ModalCloseRouteClassPropsType,
                {location}: ModalCloseRouteClassStateType
            ) {
                if (location !== newLocation) { closeModal(); }
                return {location: newLocation};
            }
            state = {
                location: this.props.location
            };
            render() {
                return (<WrappedComponent {...this.props} />);
            }
        }
    );

