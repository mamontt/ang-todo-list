/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2018 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {shallow} from 'enzyme';

import {ExportPopupContainer} from './export-popup';

jest.mock('redux-reducers-injector', () => ({
    injectReducer: () => {}
}));

jest.mock('./../../utils/translate', () => ({
    translate: (text: string) => text
}));

describe('ExportPopup', () => {
    const onExport = jest.fn().mockName('onExport');
    const closeModal = jest.fn().mockName('closeModal');
    const wrapper = shallow(<ExportPopupContainer modalParams={{onExport}} closeModal={closeModal} />);
    wrapper.props().onExport();
    it('should call closeModal once', () => {
        expect(closeModal).toHaveBeenCalledTimes(1);
    });
    it('should call onExport once', () => {
        expect(onExport).toHaveBeenCalledTimes(1);
    });
});
