/**
 * @file:
 * @date: 2021-05-21 10:28
 * @author: xuejie.he
 * @lastModify: xuejie.he 2021-05-21 10:28
 */

/**
 *
 * @param {number} selectedYear year
 * @param {number} selectedMonth month
 * @returns {DateItem[][]}
 */
/**
 * this function will set the 2 dimension array
 */
export type DateItem = {
    active: boolean;
    date: number;
    month: number;
    year: number;
};
export const setDateMap = (selectedYear: number, selectedMonth: number): DateItem[][] => {
    // current month;
    const totalDayData = new Date(selectedYear, selectedMonth, 0);
    const totalDay = totalDayData.getDate();
    const arr: DateItem[] = [];
    const endWeek = totalDayData.getDay();
    let startWeek = endWeek - (totalDay % 7) + 1;
    if (startWeek < 0) {
        startWeek += 7;
    }

    for (let i = 1; i <= totalDay; i++) {
        arr.push({
            year: selectedYear,
            month: selectedMonth,
            date: i,
            active: true,
        });
    }
    let currentVal: number;
    // pre month ;
    if (startWeek) {
        const preData = { month: selectedMonth - 1, year: selectedYear };
        if (preData.month < 1) {
            preData.year = selectedYear - 1;
            preData.month = 12;
        }

        currentVal = new Date(preData.year, preData.month, 0).getDate();
        for (let i = 0; i < startWeek; i++) {
            arr.unshift({
                year: preData.year,
                month: preData.month,
                date: currentVal,
                active: false,
            });
            --currentVal;
        }
    }

    // next month

    currentVal = 1;
    const nextData = { month: selectedMonth + 1, year: selectedYear };
    if (nextData.month > 12) {
        nextData.year = selectedYear + 1;
        nextData.month = 1;
    }

    for (let i = arr.length; i < 6 * 7; i++) {
        arr.push({
            year: nextData.year,
            month: nextData.month,
            date: currentVal,
            active: false,
        });
        ++currentVal;
    }

    const dataMap: DateItem[][] = [];
    let index = -1;
    for (let i = 0; i < arr.length; i++) {
        if (i % 7) {
            dataMap[index].push(arr[i]);
        } else {
            ++index;
            dataMap[index] = [arr[i]];
        }
    }

    return dataMap;
};
