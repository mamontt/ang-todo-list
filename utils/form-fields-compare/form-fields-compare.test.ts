/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {compareFieldsRecursive} from './form-fields-compare';

describe('Form fields comparing util', () => {
    const fields = {
        id: 1,
        topic: 'Test',
        toBank: true
    };
    const branchSnapshotField = {
        id: 2,
        shortName: 'branch2',
        fullName: 'Test branch 2'
    };

    describe('Form contains non object fields', () => {
        test('Fields equal', () => {
            const fields1 = {...fields};
            const fields2 = {...fields};
            expect(compareFieldsRecursive(fields1, fields2)).toBe(true);
        });

        test('Fields not equal', () => {
            const fields1 = {...fields};
            const fields2 = {
                ...fields,
                topic: 'Тест'
            };
            expect(compareFieldsRecursive(fields1, fields2)).toBe(false);
        });
    });

    describe('Form contains object fields', () => {
        test('Object fields have same keys and equal values', () => {
            const fields1 = {
                ...fields,
                branchSnapshot: {...branchSnapshotField}
            };
            const fields2 = {
                ...fields,
                branchSnapshot: {...branchSnapshotField}
            };
            expect(compareFieldsRecursive(fields1, fields2)).toBe(true);
        });

        test('Object fields have same keys and not equal values', () => {
            const fields1 = {
                ...fields,
                branchSnapshot: {...branchSnapshotField}
            };
            const fields2 = {
                ...fields,
                branchSnapshot: {
                    id: 3,
                    shortName: 'branch3',
                    fullName: 'Test branch 3'
                }
            };
            expect(compareFieldsRecursive(fields1, fields2)).toBe(false);
        });

        test('Object fields have same common keys, but one has more. Values of common keys are equal', () => {
            const fields1 = {
                ...fields,
                branchSnapshot: {...branchSnapshotField}
            };
            const fields2 = {
                ...fields,
                branchSnapshot: {
                    ...branchSnapshotField,
                    version: 3,
                    branchCode: '147259'
                }
            };
            expect(compareFieldsRecursive(fields1, fields2)).toBe(true);
        });

        test('Object fields have same common keys, but one has more. Values of common keys are not equal', () => {
            const fields1 = {
                ...fields,
                branchSnapshot: {...branchSnapshotField}
            };
            const fields2 = {
                ...fields,
                branchSnapshot: {
                    id: 3,
                    shortName: 'branch3',
                    fullName: 'Test branch 3',
                    version: 3,
                    branchCode: '147259'
                }
            };
            expect(compareFieldsRecursive(fields1, fields2)).toBe(false);
        });
    });
});
