/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2018 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {Fragment} from 'react';
import styleNames from '@vtb/services/style-names';
import {Fields} from '@vtb/fe-ui-input';
import {Icons} from '@vtb/fe-ui-icon';
import {translate} from './../../../../utils/translate';
import {TRUE, FALSE} from '../../../../modules/templates/constants';
import styles from './template-form.scss';
import * as FIELDS from '../fields';

type PropType = {
    template: boolean;
    showWarning: boolean;
    fieldsTip: string;
    templateFieldNameDisabled: boolean;
    changeTemplateName: (name: string) => void;
    withChose?: boolean;
}

const sn = styleNames(styles);

export const TemplateForm = ({
    template,
    changeTemplateName,
    fieldsTip,
    templateFieldNameDisabled,
    showWarning,
    withChose = true
}: PropType) => (
    <div className={sn('template-form')}>
        {template &&
        <Fragment>
            {showWarning &&
            <div className={sn('template-tip')}>
                <span className={sn('template-tip-icon')} >
                    <Icons.Warning />
                </span>
                <span className={sn('template-tip-text')} >
                    <Fields.Tip text={fieldsTip} />
                </span>
            </div>
            }
            {withChose &&
            <Fields.RadioGroup
                items={[
                    {
                        value: TRUE,
                        label: translate('template.update')
                    },
                    {
                        value: FALSE,
                        label: translate('template.save-new')
                    }
                ]
                }
                name={FIELDS.update}
                onChange={changeTemplateName}
            />
            }
        </Fragment>
        }
        <div className={sn('template-input')}>
            <Fields.TextInput
                id={FIELDS.name}
                name={FIELDS.name}
                disabled={withChose && templateFieldNameDisabled}
            />
        </div>
    </div>
);

