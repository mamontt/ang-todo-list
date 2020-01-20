/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {Icons} from '@vtb/fe-ui-icon';
import {Button} from '@vtb/fe-ui-button';

type ActionButtonProps = {
    onClick: () => void;
    text: string;
}

export const ActionButton = ({onClick, text, ...otherProps}: ActionButtonProps) => {
    if (!onClick) {
        return null;
    }
    return (
        <Button.Icon
            onClick={onClick}
            width="100%"
            icon={Icons.Save}
            size={Button.SIZES.LARGE}
            {...otherProps}
        >
            {text}
        </Button.Icon>
    );
};

