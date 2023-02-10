/**
 * @file
 * @date 2021-12-14
 * @author xuejie.he
 * @lastModify xuejie.he 2021-12-14
 */
/* <------------------------------------ **** DEPENDENCE IMPORT START **** ------------------------------------ */
/** This section will include all the necessary dependence for this tsx file */
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import useUpdateEffect from "../../../../Hooks/useUpdateEffect";
import { Icon } from "../../../../Icon";
import { monthDropDownList, weekData } from "../dateData";
import DropdownList from "../Dropdown";
import { initDate } from "../initDate";
import { makeArr } from "../makeArr";
import Popover from "../Popover";
import { DateItem, setDateMap } from "../setDataMap";
import "./style.scss";
/* <------------------------------------ **** DEPENDENCE IMPORT END **** ------------------------------------ */
/* <------------------------------------ **** INTERFACE START **** ------------------------------------ */
/** This section will include all the interface for this tsx file */
export interface Label {
    id: string | number;
    content: string;
}
export interface DateProps {
    /**
     * Selected year
     */
    year?: number;
    /**
     * Selected month
     */
    month?: number;
    /**
     * Selected day
     */
    day?: number;
    /**
     * min time
     */
    minTime?: Date;
    /**
     * max time
     */
    maxTime?: Date;
    /**
     * readonly of this component
     */
    readonly?: boolean;
    /**
     * handle date click
     */
    handleDateClick: (year: number, month: number, date: number) => void;
    /**
     * show of this component
     */
    show: boolean;
    /**
     *
     */
    type: "date" | "dateTime";
}
/* <------------------------------------ **** INTERFACE END **** ------------------------------------ */
/* <------------------------------------ **** FUNCTION COMPONENT START **** ------------------------------------ */
export const DateTemp: React.FC<DateProps> = ({
    year,
    month,
    day,
    minTime,
    maxTime,
    readonly,
    show,
    handleDateClick,
    type,
}) => {
    /* <------------------------------------ **** STATE START **** ------------------------------------ */
    /************* This section will include this component HOOK function *************/

    const [playedYear, setPlayedYear] = useState<number>();

    const [playedMonth, setPlayedMonth] = useState<number>();

    // set the initial calendar map array
    const [initialDateMap, setInitialDateMap] = useState<Array<Array<DateItem>>>();

    const [yearList, setYearList] = useState<Label[]>();

    const dateRef = useRef({
        year,
        month,
        day,
    });
    const [date, setDate] = useState({
        year,
        month,
        day,
    });

    /**
     * 最小的年
     */
    const minYear = 1970;

    /* <------------------------------------ **** STATE END **** ------------------------------------ */
    /* <------------------------------------ **** PARAMETER START **** ------------------------------------ */
    /************* This section will include this component parameter *************/
    useLayoutEffect(() => {
        if (show) {
            const dateData = initDate(date.year, date.month);
            setPlayedYear(dateData.year);
            setPlayedMonth(dateData.month);
        }
    }, [date.month, date.year, show]);

    useEffect(() => {
        if (playedYear && playedMonth) {
            setInitialDateMap(setDateMap(playedYear, playedMonth));
        }
    }, [playedYear, playedMonth]);

    useUpdateEffect(() => {
        setDate({
            year,
            month,
            day,
        });
        dateRef.current = {
            year,
            month,
            day,
        };
    }, [year, month, day]);

    useEffect(() => {
        if (playedYear) {
            const end = playedYear + 10;
            const arr: Label[] = [];
            for (let i = minYear; i <= end; i++) {
                arr.push({
                    id: i,
                    content: i.toString(),
                });
            }
            setYearList([...arr]);
        }
    }, [playedYear]);

    const handleMonthChange = (res: { id: string | number; content: string }) => {
        setPlayedMonth(res.id as number);
    };

    const handleYearChange = (res: { id: string | number; content: string }) => {
        setPlayedYear(res.id as number);
    };

    const handleYearScroll = (res: {
        left: number;
        top: number;
        scrollHeight: number;
        scrollWidth: number;
        offsetHeight: number;
        offsetWidth: number;
        clientHeight: number;
        clientWidth: number;
    }) => {
        if (yearList) {
            const start = yearList[0].id as number;
            const end = yearList[yearList.length - 1].id as number;

            if (res.top < 10) {
                let value = start - 10;
                if (value < minYear) {
                    value = minYear;
                }
                const arr = makeArr(value, start);
                setYearList(arr.concat(yearList));
            } else if (res.scrollHeight - (res.top + res.clientHeight) < 10) {
                const arr = makeArr(end + 1, end + 11);
                setYearList(yearList.concat(arr));
            }
        }
    };

    /**
     * 上一个月
     */
    const handlePreMonthClick = () => {
        if (typeof playedMonth === "number" && typeof playedYear === "number") {
            let value = playedMonth - 1;
            if (value < 1) {
                value = 12;
                if (playedYear - 1 < minYear) {
                    return;
                }
                setPlayedYear(playedYear - 1);
            }
            setPlayedMonth(value);
        }
    };

    /**
     * 下一个月
     */
    const handleNextMonthClick = () => {
        if (typeof playedMonth === "number" && typeof playedYear === "number") {
            let value = playedMonth + 1;
            if (value > 12) {
                value = 1;
                setPlayedYear(playedYear + 1);
            }
            setPlayedMonth(value);
        }
    };

    /**
     * 去年
     */
    const handlePreYearClick = () => {
        setPlayedYear((pre) => {
            if (typeof pre === "number") {
                return pre - 1 < minYear ? minYear : pre - 1;
            }
            return pre;
        });
    };
    /**
     * 明年
     */
    const handleNextYearClick = () => {
        setPlayedYear((pre) => {
            if (typeof pre === "number") {
                return pre + 1;
            }
            return pre;
        });
    };

    /* <------------------------------------ **** PARAMETER END **** ------------------------------------ */

    /* <------------------------------------ **** FUNCTION START **** ------------------------------------ */
    /************* This section will include this component general function *************/

    const yearEl = () =>
        playedYear && yearList ? (
            <DropdownList
                labels={yearList}
                value={playedYear}
                handleScroll={handleYearScroll}
                className={"dateTemp_yearContainer"}
                handleChange={handleYearChange}
            />
        ) : (
            <></>
        );

    const monthEl = () =>
        playedMonth ? (
            <DropdownList
                labels={monthDropDownList()}
                value={playedMonth}
                style={{
                    width: "11.1rem",
                }}
                handleChange={handleMonthChange}
            />
        ) : (
            <></>
        );

    const dayListEl = () => {
        const nowDate = new Date();
        const nowYear = nowDate.getFullYear();
        const nowMonth = nowDate.getMonth() + 1;
        const nowDay = nowDate.getDate();

        return initialDateMap ? (
            initialDateMap.map((item, index) => (
                <ul className={"dateTemp_row"} key={`dateTempRow_${index}`}>
                    {item.map((dayData, n) => {
                        const classList = ["dateTemp_dayContainer"];

                        const selfTime = new Date(dayData.year, dayData.month - 1, dayData.date);
                        if (selfTime) {
                            if (minTime && selfTime < minTime) {
                                classList.push("dateTemp_disabled");
                            } else if (maxTime && selfTime > maxTime) {
                                classList.push("dateTemp_disabled");
                            }
                        }
                        if (readonly) {
                            classList.push("dateTemp_readonly");
                        }

                        if (
                            dayData.year === date.year &&
                            dayData.month === date.month &&
                            dayData.date === date.day
                        ) {
                            classList.push("dateTemp_daySelected");
                        } else if (
                            dayData.year === nowYear &&
                            dayData.month === nowMonth &&
                            dayData.date === nowDay
                        ) {
                            classList.push("dateTemp_nowDate");
                        } else if (!dayData.active) {
                            classList.push("dateTemp_dayGray");
                        }

                        return (
                            <li key={`dateTempCol_${index}${n}`} className={"dateTemp_col"}>
                                <div
                                    className={classList.join(" ")}
                                    onClick={() => {
                                        if (!classList.includes("dateTemp_disabled") && !readonly) {
                                            dateRef.current = {
                                                year: dayData.year,
                                                month: dayData.month,
                                                day: dayData.date,
                                            };
                                            setDate({
                                                year: dayData.year,
                                                month: dayData.month,
                                                day: dayData.date,
                                            });
                                        }
                                    }}
                                >
                                    <span className={"dateTemp_colContent"}>{dayData.date}</span>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            ))
        ) : (
            <></>
        );
    };

    /* <------------------------------------ **** FUNCTION END **** ------------------------------------ */
    return (
        <div className={`dateTemp_${type}`}>
            <div className={"dateTemp_top"}>
                <Popover
                    className={"dateTemp_preYearBtn"}
                    onClick={handlePreYearClick}
                    title="上一年"
                    disabled={typeof playedYear === "number" && playedYear <= minYear}
                >
                    <Icon type="last" className={"dateTemp_preYearIcon"} />
                </Popover>

                <Popover
                    className={"dateTemp_preMonthBtn"}
                    onClick={handlePreMonthClick}
                    title="上个月"
                    disabled={
                        typeof playedYear === "number" &&
                        typeof playedMonth === "number" &&
                        playedYear <= minYear &&
                        playedMonth === 1
                    }
                >
                    <Icon type="open" className={"dateTemp_preMonthIcon"} />
                </Popover>

                <div className={"dateTemp_monthAndYear"}>
                    {yearEl()}
                    {monthEl()}
                </div>

                <Popover
                    className={"dateTemp_nextMonth"}
                    onClick={handleNextMonthClick}
                    title="下个月"
                >
                    <Icon type="open" className={"dateTemp_nextMonthIcon"} />
                </Popover>

                <Popover
                    className={"dateTemp_nextYearBtn"}
                    onClick={handleNextYearClick}
                    title="下一年"
                >
                    <Icon type="Next" className={"dateTemp_nextYearIcon"} />
                </Popover>
            </div>
            <div className={"dateTemp_table"}>
                <div className={"dateTemp_week"}>
                    {weekData.map((item, index) => (
                        <div className={"dateTemp_weekItem"} key={`DateTempWeek_${index}`}>
                            {item}
                        </div>
                    ))}
                </div>
                {dayListEl()}
            </div>
            <div className={"dateTemp_footer"}>
                <div
                    className={`dateTemp_confirmBtn${
                        date.year ? " dateTemp_confirmBtnActive" : ""
                    }`}
                    onClick={() => {
                        if (
                            typeof dateRef.current.year === "number" &&
                            typeof dateRef.current.month === "number" &&
                            typeof dateRef.current.day === "number"
                        ) {
                            handleDateClick(
                                dateRef.current.year,
                                dateRef.current.month,
                                dateRef.current.day,
                            );
                        }
                    }}
                >
                    确定
                </div>
            </div>
        </div>
    );
};
/* <------------------------------------ **** FUNCTION COMPONENT END **** ------------------------------------ */
