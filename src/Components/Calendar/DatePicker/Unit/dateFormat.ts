/**
 * @file: Add 0 in front of the single digit
 * @date: 2021-05-21 12:52
 * @author: xuejie.he
 * @lastModify: xuejie.he 2021-05-21 12:52
 */

import { weekData } from "./dateData";

/**
 *
 * @param {number} length =>  The length to be cut
 * @param {number} val => The value to intercept
 * @returns {string}
 */

export const addZero = (length: number, val: number): string => {
    let str = "";
    for (let i = 0; i < length; i++) {
        str += "0";
    }
    str += val;
    return str.substring(str.length - length, str.length);
};

/**
 *
 */
export function customDate(formatStr: string, date: Date): string {
    let unit: "AM" | "PM" | "" = "";
    const t: {
        [key: string]: number;
    } = {
        "M+": date.getMonth() + 1, // month
        "d+": date.getDate(), // day
        "H+": date.getHours(), // hour of 24
        "h+": date.getHours(), // hour of 12
        "m+": date.getMinutes(), // minute
        "s+": date.getSeconds(), // second
        w: date.getDay(), //星期
    };
    let reg = /y+/i;
    // year
    if (reg.test(formatStr)) {
        formatStr = formatStr.replace(reg, (res) => {
            const y = date.getFullYear().toString();
            return y.substring(4 - res.length);
        });
    }

    // other (month || day)
    for (const a in t) {
        if (new RegExp(`(${a})`).test(formatStr)) {
            reg = new RegExp(`(${a})`);
            let val = Number(t[a]);
            switch (a) {
                case "h+":
                    if (val > 12) {
                        unit = "PM";
                        val -= 12;
                    } else {
                        unit = "AM";
                    }

                    formatStr = formatStr.replace(reg, () => {
                        return addZero(2, val);
                    });
                    break;
                case "w":
                    formatStr = formatStr.replace(reg, () => {
                        return `${weekData[val]}`;
                    });
                    break;
                default:
                    formatStr = formatStr.replace(reg, () => {
                        return addZero(2, val);
                    });
                    break;
            }
        }
    }
    return `${formatStr}${unit === "" ? unit : unit === "AM" ? "上午" : "下午"}`;
}
