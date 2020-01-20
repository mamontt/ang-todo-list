/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {convertFormToFilterTemplate} from './utils';

const formTopic = {
    attributeComposition: {
        topic: 'titleTopic'
    }
};

const formTopicClientResponsible = {
    attributeComposition: {
        topic: 'titleTopic',
        clientResponsibleOfficer: 'Ivanov'
    },
    name: 'name'
};

describe('utils convertFormToFilterTemplate', () => {
    it('Empty object', () => {
        expect(convertFormToFilterTemplate())
            .toEqual({
                attributeComposition: null,
                clientId: null,
                filterExtensionAttributes: null,
                name: undefined
            });
    });
    it('form with topic', () => {
        expect(convertFormToFilterTemplate(formTopic))
            .toEqual({
                clientId: null,
                attributeComposition: null,
                filterExtensionAttributes: '{"topic":"titleTopic"}',
                name: undefined
            });
    });
    it('form with topic and clientResponsible', () => {
        expect(convertFormToFilterTemplate(formTopicClientResponsible))
            .toEqual({
                clientId: null,
                attributeComposition: null,
                filterExtensionAttributes: '{"topic":"titleTopic","clientResponsibleOfficer.name":"Ivanov"}',
                name: 'name'
            });
    });
});
