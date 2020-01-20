/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {ROOT_NAMESPACE} from './../../constants/root-namspace';

const modalNameWithNamespace = (namespace: string, modalName: string): string =>
    `${namespace}/${modalName}`;

export const modalNameWithRootNamespace = (modalName: string) =>
    modalNameWithNamespace(ROOT_NAMESPACE, modalName);
