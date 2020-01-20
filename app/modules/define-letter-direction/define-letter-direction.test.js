/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {EMPLOYEE, OFFICIAL} from '../../modules/user-context';
import {mapStateToProps} from './define-letter-direction';
import {TO_BANK, FROM_BANK} from './define-letter-direction-constants';

jest.mock('redux-reducers-injector', () => ({
    injectReducer: () => {}
}));

describe('defineLetterDirection', () => {
    test('initProps.letterDirection = TO_BANK', () => {
        expect(mapStateToProps({}, {initProps: {letterDirection: TO_BANK}})).toEqual({
            letterDirection: TO_BANK
        });
    });
    test('initProps.letterDirection = FROM_BANK', () => {
        expect(mapStateToProps({}, {initProps: {letterDirection: FROM_BANK}})).toEqual({
            letterDirection: FROM_BANK
        });
    });
    test('props.documentId = undefined, userContext.type = EMPLOYEE', () => {
        expect(mapStateToProps({}, {userContext: {type: EMPLOYEE}})).toEqual({
            letterDirection: TO_BANK
        });
    });
    test('props.documentId = 123, userContext.type = EMPLOYEE', () => {
        expect(
            mapStateToProps(
                {},
                {
                    documentId: 123,
                    userContext: {type: EMPLOYEE}
                }
            )
        ).toEqual({
            letterDirection: TO_BANK
        });
    });
    test('props.documentId = undefined, userContext.type = OFFICIAL', () => {
        expect(mapStateToProps({}, {userContext: {type: OFFICIAL}})).toEqual({
            letterDirection: FROM_BANK
        });
    });
    test('props.documentId = 123, userContext.type = OFFICIAL', () => {
        expect(
            mapStateToProps(
                {},
                {
                    documentId: 123,
                    userContext: {type: OFFICIAL}
                }
            )
        ).toEqual({
            letterDirection: FROM_BANK
        });
    });
    test('userContext.type = OFFICIAL', () => {
        expect(mapStateToProps({form: {'fe-letters/letter': {values: {toBank: false}}}}, {documentId: 123})).toEqual({
            letterDirection: FROM_BANK
        });
    });
    test('userContext.type = OFFICIAL', () => {
        expect(mapStateToProps({form: {'fe-letters/letter': {values: {toBank: true}}}}, {documentId: 123})).toEqual({
            letterDirection: TO_BANK
        });
    });
    test("{form: {'fe-letters/letter': {values: {toBank: false}}}}", () => {
        expect(mapStateToProps({form: {'fe-letters/letter': {values: {toBank: false}}}}, {})).toEqual({
            letterDirection: undefined
        });
    });
    test("{form: {'fe-letters/letter': {values: {toBank: true}}}}", () => {
        expect(mapStateToProps({form: {'fe-letters/letter': {values: {toBank: true}}}}, {})).toEqual({
            letterDirection: undefined
        });
    });
});
