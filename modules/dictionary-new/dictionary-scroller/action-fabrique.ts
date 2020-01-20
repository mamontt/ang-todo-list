/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2018 VTB Group. All rights reserved.
 */
import {Scroller} from '@vtb/fe-ui-table';
import {GET} from '../../../constants/request-types-big';
import {DICTIONARY_COMMON_SCROLLER, DEFAULT_DATA_PATH} from '../constants';

export const actionFabrique = (
    url: string,
    dataPath: string = DEFAULT_DATA_PATH,
    fetchParams: {
        method: string
    } = {method: GET},
    pathAdapter?: (param: {url: string, dataPath: string}) => void
) =>
    Scroller.actionFabrique({
        scrollerName: DICTIONARY_COMMON_SCROLLER,
        dataUrl: pathAdapter ? pathAdapter({url, dataPath}) : url,
        dataPath,
        countPageKey: 'size',
        fetchParams,
        restoreItems: []
    });
