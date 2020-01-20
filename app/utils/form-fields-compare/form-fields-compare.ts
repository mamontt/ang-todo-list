/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {isEqual, has, isObjectLike, every} from 'lodash';

type FieldType = string | number | any;
/**
 * Compare fields recursively. Compare internal object fields with next algorithm:
 * if second object has key that is existed in first, then it compares, otherwise value for this key skip
 * @param field1 - first field for comparing (current values)
 * @param field2 - second field for comparing (initial values)
 * @param internal {string} [internal=false] - internal parameter for detecting level of recursion (false if first)
 */
export const compareFieldsRecursive = (field1: FieldType, field2: FieldType, internal: boolean = false): boolean => {
    if (isObjectLike(field1) && isObjectLike(field2)) {
        if (!internal) {
            return compareFieldsRecursive(field1, field2, true);
        }

        return every(field1, (value: string | number, key: string) => {
            if (has(field2, key)) {
                return compareFieldsRecursive(value, field2[key], true);
            }

            return true;
        });
    }

    return isEqual(field1, field2);
};
