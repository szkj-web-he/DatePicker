/**
 * @file 深克隆一下数据
 * @date 2022-06-14
 * @author xuejie.he
 * @lastModify xuejie.he 2022-06-14
 */

export const deepCloneData = <T>(data: T): T => {
    return window.structuredClone(data);
};
