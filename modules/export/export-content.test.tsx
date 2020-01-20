/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2018 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {shallow} from 'enzyme';

import {ExportContent} from './export-content';
import {DETAIL_TYPE} from './constants';

jest.mock('./../../utils/translate', () => ({
    translate: (text: string) => text
}));

jest.mock('redux-reducers-injector', () => ({
    injectReducer: () => {}
}));

describe('ExportContent', () => {
    it('should render MultipleExport', () => {
        const wrapper = shallow(<ExportContent isMultiple />);
        expect(wrapper).toMatchSnapshot();
    });
    it('should render MultipleExport with toggle', () => {
        const wrapper = shallow(<ExportContent
            formValues={{type: DETAIL_TYPE}}
            isMultiple
        />);
        expect(wrapper).toMatchSnapshot();
    });
});

