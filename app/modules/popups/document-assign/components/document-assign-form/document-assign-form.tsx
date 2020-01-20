/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2018 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {Fields, Input} from '@vtb/fe-ui-input';
import {Label} from '@vtb/fe-ui-label';
import styleNames from '@vtb/services/style-names';
import {translate} from './../../../../../utils/translate';
import {ASSIGN_SELF, ASSIGN_OTHER, ASSIGN_ANY} from './../../../../../constants/document-action-capabilities';
import {OfficialCommonDto} from '../../../../../modules/dictionary-new';
import {
    officialsMap,
    officialsMapWithOutUser,
    getNameUser,
    UserType
} from '../../../../../modules/popups/document-assign/selectors';
import styles from './document-assign-form.scss';

const sn = styleNames(styles);

type ContainerType = {
    officials: Array<OfficialCommonDto>,
    capability: string,
    user: UserType
};

const Self = ({user}: {user: UserType}) => (<Input value={user && getNameUser(user.fio, user.userRef)} disabled />);

const Other = ({officials, userId}: {officials: Array<OfficialCommonDto>, userId: number}) => (
    <Fields.Select
        withSearch
        name="userId"
        items={officialsMapWithOutUser(officials, userId)}
    />
);

const Any = ({officials}: {officials: Array<OfficialCommonDto>}) => (
    <Fields.Select
        withSearch
        name="userId"
        items={officialsMap(officials)}
    />
);

type AssignCapabilityType = {
    [assign: string]: any
}

export const DocumentAssignForm = ({ officials, capability = ASSIGN_ANY, user }: ContainerType) => {
    const assignCapability: AssignCapabilityType = {
        [ASSIGN_SELF]: <Self user={user} />,
        [ASSIGN_OTHER]: <Other officials={officials} userId={user && user.id} />,
        [ASSIGN_ANY]: <Any officials={officials} />
    };

    return (
        <div className={sn('document-assign-form')}>
            <Label text={translate('modals.takeInProcessModalOfficialsFieldLabel')} />
            {assignCapability[capability]}
        </div>
    );
};

