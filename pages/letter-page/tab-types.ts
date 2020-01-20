/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
export type TabId = number | string;
export type Tab = {
    id: TabId;
    title: string;
    badge?: number | string;
    disabled?: boolean;
    badgeSpecial?: boolean;
}
