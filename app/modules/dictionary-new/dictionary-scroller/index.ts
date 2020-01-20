/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2018 VTB Group. All rights reserved.
 */
export {DictionaryScroller} from './scroller';

export type OwnPropsType = {
    url: string,
    dataPath: string,
    queryParams?: {
        method: string;
    },
    pathAdapter?: (param: {url: string, dataPath: string}) => void,
    filterItems: Function,
    fetchParams: any,
    filterItemsCount: number,
    multi?: boolean,
    fieldValue?: string,
    setDictionaryValues?: Function,
    getTableColumns?: Function,
    rowIdFieldName?: string,
    joinColumns?: boolean,
    changeContext?: Function,
    context?: string,
}
