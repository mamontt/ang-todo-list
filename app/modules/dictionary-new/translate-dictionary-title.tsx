/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {translate} from './../../utils/translate';

type TranslateDictionaryTitleProps = {
    title: string;
}

export const TranslateDictionaryTitle = ({title}: TranslateDictionaryTitleProps) => <span> {translate(title)} </span>;
