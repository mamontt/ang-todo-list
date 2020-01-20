/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2018 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {ComponentType, FormEvent} from 'react';
import {reduxForm} from 'redux-form';
import {Label} from '@vtb/fe-ui-label';
import {Grid} from '@vtb/fe-ui-grid';
import {TEMPLATES_DESCRIPTORS} from '../template-descriptors';
import {FilterFieldType} from '../flow-types';

type FormType = {
    docTypeId?: number;
    handleSubmit?: (event: FormEvent<HTMLFormElement>) => void;
    form: string;
}

const Form = ({
    docTypeId,
    handleSubmit
}: FormType) => (
    <form onSubmit={handleSubmit}>
        <Grid.Grid sticky>
            {
                TEMPLATES_DESCRIPTORS[docTypeId].filterFields().map(({
                    label,
                    name,
                    reduxField: ReduxField,
                    customField,
                    props = {}
                }: FilterFieldType) => (
                    <Grid.Row vAlign={Grid.VERTICAL_ALIGN.TOP} margin={Grid.MARGIN.M}>
                        {customField ?
                            <ReduxField {...props} />
                            :
                            <React.Fragment>
                                <Grid.Col col={3}>
                                    <Label text={label} position="left" forId={name} />
                                </Grid.Col>
                                <Grid.Col col={6}>
                                    <ReduxField name={name} forLabelId={name} id={name} {...props} />
                                </Grid.Col>
                            </React.Fragment>
                        }

                    </Grid.Row>
                ))
            }
        </Grid.Grid>
    </form>
);

export const FilterForm: ComponentType<FormType> = reduxForm({
    destroyOnUnmount: false
})(Form);
