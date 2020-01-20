/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {Component} from 'react';

type PropTypes = {
    getData: () => void;
    location: Location;
}

export const onScrollerRouteChange = (WrappedComponent: any) =>
    class ScrollerChangeClass extends Component<PropTypes> {
        componentDidUpdate(props: PropTypes) {
            const newPathLength = this.props.location.pathname.split('/').length;
            const oldPathLength = props.location.pathname.split('/').length;
            if (newPathLength < oldPathLength) {
                this.props.getData();
            }
        }

        render() {
            return <WrappedComponent {...this.props} />;
        }
    };
