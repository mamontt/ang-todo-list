/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {log} from '@vtb/services/logger';

export function error(msg: string) {
    if ((window as any).DEBUG) {
        throw Error(msg);
    } else {
        log.error(msg);
    }
}
