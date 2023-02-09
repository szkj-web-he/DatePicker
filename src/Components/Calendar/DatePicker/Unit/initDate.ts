/**
 * @file abc
 * @date 2021-12-14
 * @author xuejie.he
 * @lastModify xuejie.he 2021-12-14
 */

export const initDate = (
    year?: number,
    month?: number,
): {
    year: number;
    month: number;
} => {
    if (year && month) {
        return {
            year,
            month,
        };
    } else {
        const date = new Date();
        return {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
        };
    }
};

export interface DateInfoProps {
    year: number;
    month: number;
    day: number;
    hour: number;
    unit: "PM" | "AM";
}
/**
 *
 * @param {Date | undefined} time
 * @returns {DateInfoProps | null}
 */
export const getDateInfo = (time?: Date): DateInfoProps | null => {
    if (time) {
        const h = time.getHours();

        return {
            year: time.getFullYear(),
            month: time.getMonth() + 1,
            day: time.getDate(),
            hour: h > 12 ? h - 12 : h,
            unit: h > 12 ? "PM" : "AM",
        };
    }
    return null;
};
