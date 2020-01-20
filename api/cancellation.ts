/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {keys} from 'lodash';
import {resource, ResourceType} from './../modules/resource';
import * as ResourceMethods from './../constants/request-types';
import {LT_API_URL} from './urls';

const CANCELLATION_API_URL = 'v3/ui/cancelRequests';
const LT_CANCELLATION_URL = `${LT_API_URL}/${CANCELLATION_API_URL}`;
const cancellationInterceptor = ({params = {}, method = ResourceMethods.GET, ...otherParams}) => ({
    method,
    ...otherParams,
    params: {
        ...params,
        extended: true
    }
});

export const cancellation: ResourceType = resource(`${LT_CANCELLATION_URL}`, keys(ResourceMethods), cancellationInterceptor);
export const getEmployeeCancelltationSendUrl = `${LT_CANCELLATION_URL}/{documentId}/send`;
export const getEmployeeCancelltationSignUrl = (edocId: string) => `${LT_CANCELLATION_URL}/esigner/signatures/${edocId}`;
export const getCancellationDigestUrl = ({id, channel = 'WEB'}: {id: string | number, channel?: string}) => `${LT_CANCELLATION_URL}/esigner/signatures/${id}/${channel}`;
export const getCancellationUrl = () => LT_CANCELLATION_URL;
export const cancelationOtrUrl = '/api/letters/v3/ui/cancelRequests/{documentId}/attachments/{attachmentId}/otr';
