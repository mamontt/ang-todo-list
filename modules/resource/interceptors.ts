/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
export function json({data = {}, headers = {}, ...otherParams}) {
    return {
        ...otherParams,
        data: data || {},
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        }
    };
}
