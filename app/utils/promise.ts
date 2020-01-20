/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {chunk} from 'lodash';
import {ApiMethod} from './fetchable';

export const chainPromises = (action: ApiMethod, data: Array<any> = [], number: number = 10) => {
    let chain = Promise.resolve();

    let results: Array<Object> = [];
    const chunks = chunk(data, number);

    chunks.forEach((items) => {
        chain = chain
            .then(() => Promise.all(items.map(item => action(item))))
            .then((result) => {
                results = results.concat(result);
            });
    });

    return chain.then(() => Promise.resolve(results));
};
