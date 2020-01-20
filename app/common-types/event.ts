/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
export interface EventTargetResult extends EventTarget {
    result?: string;
    value?: string;
}

export interface TargetEvent extends Event {
    target: EventTargetResult;
    keyCode?: string;
}
