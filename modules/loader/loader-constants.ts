/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {FETCH_START, FETCH_DONE, FETCH_ERROR, FETCH_FINISHED} from './../../utils/fetchable';

export const START = new RegExp(FETCH_START('.*'));
export const DONE = new RegExp(FETCH_DONE('.*'));
export const ERROR = new RegExp(FETCH_ERROR('.*'));
export const FINISHED = new RegExp(FETCH_FINISHED('.*'));
export const LOADER_STORE_KEY = 'loader';
