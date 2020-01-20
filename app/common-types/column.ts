/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
export interface Column {
    label: string;
    name: string;
    width: number;
    fixed: boolean;
    sortable: boolean;
    visible: boolean;
    joinWith: string;
    resizable: boolean;
}
