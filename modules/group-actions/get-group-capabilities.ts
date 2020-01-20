/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {Letter} from '../../common-types';
import {resource} from '../resource';

export const getGroupCapabilities = (capabilitiesUrl: string) => (documents: Array<Letter>) =>
    resource(capabilitiesUrl).post({ids: documents.map(d => d.id).join(',')});
