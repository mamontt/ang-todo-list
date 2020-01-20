/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {PureComponent, ReactNode} from 'react';
import {get} from 'lodash';
import {Collapsable} from './collapsable';

function extractValue(form: {[fieldName: string]: string}, fieldName: string, tags: TagsType) {
    const render = get(tags, [fieldName, 'render'], (a: string) => a);
    return render(form[fieldName]);
}
const selectFields = (form: {[fieldName: string]: string}, tags: TagsType) => {
    if (!form) {
        return [];
    }

    return Object.keys(form)
        .map(fieldName => ({fieldName, value: extractValue(form, fieldName, tags)}))
        .filter(({fieldName, value}) => value && !get(tags, [fieldName, 'hide']));
};

type RenderObject = {
    render?: (value?: string | boolean | Object) => string;
}

export type TagsType = {
    [value: string]: RenderObject;
}

type Props = {
    value?: {[fieldName: string]: string};
    tags?: TagsType;
    children?: (e: any) => ReactNode;
    onCleanButton?: () => void;
}

export class Tagable extends PureComponent<Props> {
    form: {submit: () => void} = null;

    handleFormSubmit = () => {
        this.form.submit();
    };

    render() {
        const {children, tags, ...rest} = this.props;

        return (
            <Collapsable
                {...rest}
                fields={selectFields(this.props.value, tags)}
                onSubmitButton={this.handleFormSubmit}
            >
                {children((e: any) => { this.form = e; })}
            </Collapsable>
        );
    }
}
