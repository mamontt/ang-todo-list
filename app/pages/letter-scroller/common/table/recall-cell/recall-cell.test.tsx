/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {shallow} from 'enzyme';
import {RecallCell} from './recall-cell';

jest.mock('./../../../../../utils/translate', () => ({
    translate: (text: string) => text
}));

describe('RecallCell', () => {
    it('render RecallCell', () => {
        const wrapper = shallow(<RecallCell />);
        expect(wrapper).toMatchSnapshot();
    });
    it('render RecallCell with empty row', () => {
        const wrapper = shallow(<RecallCell row={{}} />);
        expect(wrapper).toMatchSnapshot();
    });
    it('render RecallCell with empty cancelReq', () => {
        const wrapper = shallow(<RecallCell row={{cancelReq: {}}} />);
        expect(wrapper).toMatchSnapshot();
    });
    it('render RecallCell with new status', () => {
        const wrapper = shallow(<RecallCell row={{cancelReq: {baseStatus: 'NEW'}}} />);
        expect(wrapper).toMatchSnapshot();
    });
    it('render RecallCell with executed status', () => {
        const wrapper = shallow(<RecallCell row={{cancelReq: {baseStatus: 'EXECUTED'}}} />);
        expect(wrapper).toMatchSnapshot();
    });
});

