/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {groupBy, toPairs, mapValues} from 'lodash';
import {ShadePageSidebar} from '../../../modules/shade-page';
import {ActionGroup} from './action-group';
import {Descriptor, Keys} from './flow-types';

type Props = {
    descriptors: {[Keys: string]: Descriptor},
    activeButtons: {[Keys: string]: boolean}
}

export class Sidebar extends React.PureComponent<Props> {
    static defaultProps = {
        descriptors: {},
        activeButtons: {}
    };

    addDisabledField = (descriptor: Descriptor, key: Keys): Descriptor & {disabled: boolean} => {
        const {activeButtons} = this.props;
        return {...descriptor, disabled: !activeButtons[key]};
    };

    render() {
        const {descriptors, activeButtons} = this.props;
        const groups = toPairs(groupBy(
            mapValues(descriptors, this.addDisabledField),
            e => e.group || 1
        ));

        return (
            <ShadePageSidebar>
                {groups.map(([key, value]) => (
                    <ActionGroup
                        id={key}
                        actions={value}
                        activeButtons={activeButtons}
                    />
                ))}
            </ShadePageSidebar>
        );
    }
}
