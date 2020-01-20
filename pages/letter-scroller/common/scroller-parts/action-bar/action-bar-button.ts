/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
export type ActionBarButton = {
    id: string;
    title: string;
    onClick: () => void;
    icon: string;
    disabled: boolean;
}
