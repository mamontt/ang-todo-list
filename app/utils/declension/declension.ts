/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {toString} from 'lodash';

export type Titles = {
    one: string;
    from2to4: string;
    from5to20: string;
}

export function declensionInCountContext(count: number, titles: Titles): string {
    const countString = toString(count);
    const lastDigit = countString[countString.length - 1];
    const preLastDigit = countString[countString.length - 2];
    switch (lastDigit) {
        case '1':
            return preLastDigit === '1' ? titles.from5to20 : titles.one;
        case '2':
        case '3':
        case '4':
            return preLastDigit === '1' ? titles.from5to20 : titles.from2to4;
        default:
            return titles.from5to20;
    }
}
