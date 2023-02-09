/**
 * @file abc
 * @date 2021-12-15
 * @author xuejie.he
 * @lastModify xuejie.he 2021-12-15
 */

import { Label } from "./Date";

/**
 *
 * @param {number} start
 * @param {number} end
 * @returns {Label[]}
 */
export const makeArr = (start: number, end: number): Label[] => {
    const arr: Label[] = [];
    for (let i = start; i < end; i++) {
        arr.push({
            id: i,
            content: i.toString(),
        });
    }
    return arr;
};
