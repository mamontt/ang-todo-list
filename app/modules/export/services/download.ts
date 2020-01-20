/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import * as METHODS from '../../../constants/request-types';

type $Values<O extends object> = O[keyof O];

type Download = {
    downloadUrl: string;
    method?: $Values<typeof METHODS>;
}

export const download = ({downloadUrl, method = METHODS.GET}: Download) => {
    const form = document.createElement('form');
    form.style.visibility = 'hidden';
    form.style.position = 'fixed';
    form.method = method;
    form.action = downloadUrl;
    if (method === METHODS.GET) {
        window.open(downloadUrl, '_blank');
    } else {
        form.target = '_blank';
        const {body} = document;
        if (body) {
            body.appendChild(form);
            form.submit();
            body.removeChild(form);
        }
    }
};

