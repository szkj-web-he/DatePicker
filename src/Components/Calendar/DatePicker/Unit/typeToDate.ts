/**
 * @file abc
 * @date 2021-12-14
 * @author xuejie.he
 * @lastModify xuejie.he 2021-12-14
 */
/**
 *
 * @param {string } res
 * @returns {Date|null}
 */
const splitTimeStr = (res: string): Date | null => {
    /**
     * \D+ 分割符
     * [1-9]\d{3} year
     * (0?[1-9]|1[0-2]) month
     * (0?[1-9]|[1-2][\d]|3[0-1]) day
     * 2[0-3]|0?[1-9]|1\d hour
     * 0?\d|[1-5]\d minute
     * 0?\d|[1-5]\d second
     */
    const dateReg = /^[1-9]\d{3}\D+(0?[1-9]|1[0-2])\D+(0?[1-9]|[1-2][\d]|3[0-1])/;

    const hourReg =
        /^[1-9]\d{3}\D+(0?[1-9]|1[0-2])\D+(0?[1-9]|[1-2][\d]|3[0-1])\D+(2[0-3]|0?[1-9]|1\d)(\D*(PM|AM))?/i;

    const minuteReg =
        /^[1-9]\d{3}\D+(0?[1-9]|1[0-2])\D+(0?[1-9]|[1-2][\d]|3[0-1])\D+(2[0-3]|0?[1-9]|1\d)\D+(0?\d|[1-5]\d)(\D*(PM|AM))?/i;
    if (dateReg.test(res) || hourReg.test(res) || minuteReg.test(res)) {
        const arr = res.split(/\D+/);

        const numberArr = arr.map((item) => Number(item));

        let h = numberArr[3] || 0;
        if (/PM/gi.test(res)) {
            h += 12;
        }

        return new Date(
            numberArr[0],
            numberArr[1] - 1,
            numberArr[2],
            h,
            numberArr[4] || 0,
            numberArr[5] || 0,
        );
    } else {
        return null;
    }
};

/**
 *
 * @param {Date | number | string} time
 * @returns {Date | null}
 */
export const toDate = (time: Date | number | string): Date | null => {
    switch (typeof time) {
        case "number":
            return new Date(time);
        case "string":
            return splitTimeStr(time);

        default:
            return time;
    }
};
