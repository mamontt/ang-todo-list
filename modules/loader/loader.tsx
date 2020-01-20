/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {plainBlock, BEM} from '@vtb/services/bem-helper';
import styles from './loader.scss';

export const Loader = plainBlock('loader', {styles})(BEM.div());
export const SpinnerContainer = Loader.element('spinner-container', ['visible'])(BEM.div());
