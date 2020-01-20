/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {PureComponent, ReactNode, ComponentType} from 'react';
import {omit} from 'lodash';
import {Filter} from '@vtb/fe-ui-table';

type FilterProps = {
    open?: boolean;
    fields?: ReactNode;
    SearcherView?: ComponentType<any>;
    formName?: string;
    onOpenForm?: (open: boolean) => void;
    onSubmitButton?: () => void;
    onCleanButton?: () => void;
    onDeleteField?: (fieldName: string) => void;
    onFocusField?: (fieldName: string) => void;
    children?: ReactNode;
};

type StateTypes = {
    open: boolean;
}

export class Collapsable extends PureComponent<FilterProps, StateTypes> {
    state = {
        open: this.props.open || false
    };

    componentWillReceiveProps(newProps: FilterProps) {
        if (this.isOpenChanged(newProps)) {
            this.setState({open: newProps.open});
        }
    }

    isOpenChanged(newProps: FilterProps) {
        return newProps.open !== this.props.open && this.state.open !== newProps.open;
    }

    handleCollapseToggle = (open: boolean) => {
        const {onOpenForm} = this.props;
        this.setState({open});
        if (onOpenForm) {
            onOpenForm(open);
        }
    };

    handleSubmit = () => {
        const {onSubmitButton} = this.props;
        if (onSubmitButton) {
            onSubmitButton();
        }

        this.handleCollapseToggle(false);
    };

    render() {
        const props = omit(this.props, ['onOpenForm', 'onSubmitButton', 'open', 'hideFilter']);
        const {SearcherView, formName} = this.props;

        return (
            <Filter.WithTabs
                {...props}
                onOpenForm={this.handleCollapseToggle}
                onSubmitButton={this.handleSubmit}
                open={this.state.open}
                leftSide={SearcherView && <SearcherView formName={formName} />}
            />
        );
    }
}
