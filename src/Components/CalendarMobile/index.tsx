/**
 * @file
 * @date 2022-11-18
 * @author mingzhou.zhang
 * @lastModify  2022-11-18
 */
/* <------------------------------------ **** DEPENDENCE IMPORT START **** ------------------------------------ */
/** This section will include all the necessary dependence for this tsx file */
import React, { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import { customDate } from "../Calendar/DatePicker/Unit/dateFormat";
import { DateInfoProps, getDateInfo } from "../Calendar/DatePicker/Unit/initDate";
import { MobilePickerEventProps, MobilePickerView } from "../MobilePickerView";
import { Popup } from "../Popup";
import { useLatest } from "./../Hooks/useLatest";
import "./style.scss";
import { getDays, NodeProps } from "./Unit/getDays";
import { getYearList } from "./Unit/getYears";
import Input from "./Unit/input";
/* <------------------------------------ **** DEPENDENCE IMPORT END **** ------------------------------------ */
/* <------------------------------------ **** INTERFACE START **** ------------------------------------ */
/** This section will include all the interface for this tsx file */

export interface CalendarMobileProps {
    value?: Date;

    onChange?: (value?: Date) => void;
    /**
     * custom date format
     * yyyy:year
     * MM:month
     * dd:day
     * w:星期几
     * example: 1.yyyy:MM:dd
     *          2.yyyy-MM-dd(default)
     *          3.dd/MM/yyyy
     *          more...
     */
    valueFormat?: string;

    className?: string;
}

/* <------------------------------------ **** INTERFACE END **** ------------------------------------ */
/* <------------------------------------ **** FUNCTION COMPONENT START **** ------------------------------------ */
export const CalendarMobile: React.FC<CalendarMobileProps> = ({
    value,
    onChange,
    className,
    valueFormat = "yyyy-MM-dd 星期w",
}) => {
    /* <------------------------------------ **** STATE START **** ------------------------------------ */
    /************* This section will include this component HOOK function *************/
    const [show, setShow] = useState(false);

    const dateValueRef = useLatest(value);

    const [playedYear, setPlayedYear] = useState<number>(1920);
    const [playedMonth, setPlayedMonth] = useState<number>(1);
    const [playedDay, setPlayedDay] = useState<number>(1);

    const [yearList, setYearList] = useState<Array<NodeProps>>([]);
    const [dayList, setDayList] = useState<Array<NodeProps>>([]);

    const mobilePickerEvent = useRef<MobilePickerEventProps>({ scrollTo: () => undefined });

    /* <------------------------------------ **** STATE END **** ------------------------------------ */
    /* <------------------------------------ **** PARAMETER START **** ------------------------------------ */
    /************* This section will include this component parameter *************/

    useLayoutEffect(() => {
        const date = getDateInfo(dateValueRef.current ?? new Date()) as DateInfoProps;
        setPlayedYear(date.year);
        setPlayedMonth(date.month);
        setPlayedDay(date.day);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    useEffect(() => {
        if (show) {
            const date = getDateInfo(dateValueRef.current ?? new Date()) as DateInfoProps;
            setPlayedYear(date.year);
            setPlayedMonth(date.month);
            setPlayedDay(date.day);

            setYearList((pre) => {
                if (pre.length > 1) {
                    return pre;
                }

                return getYearList(date.year + 10);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show]);

    useEffect(() => {
        const date = getDateInfo(dateValueRef.current ?? new Date()) as DateInfoProps;
        if (playedYear === date.year && playedMonth === date.month) {
            mobilePickerEvent.current.scrollTo("day", date.day.toString());
        } else {
            mobilePickerEvent.current.scrollTo("day", "1");
        }

        setDayList(() => {
            return getDays(playedYear, playedMonth);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [playedYear, playedMonth]);

    /* <------------------------------------ **** PARAMETER END **** ------------------------------------ */
    /* <------------------------------------ **** FUNCTION START **** ------------------------------------ */
    /************* This section will include this component general function *************/

    /**
     * 获取月列表
     */
    const getMonthList = () => {
        const nodes: Array<{ id: string; content: React.ReactNode }> = [];

        for (let i = 1; i <= 12; i++) {
            nodes.push({
                id: i.toString(),
                content: (
                    <>
                        <span className="calendarMobile_itemContent">{i}</span>
                        <span className="calendarMobile_itemUnit">月</span>
                    </>
                ),
            });
        }
        return nodes;
    };

    /* <------------------------------------ **** FUNCTION END **** ------------------------------------ */
    return (
        <Fragment>
            <Input
                onClick={() => setShow(true)}
                show={show}
                value={value ? customDate(valueFormat, value) : ""}
                handleClearClick={() => {
                    onChange?.(undefined);
                }}
                className={className}
            />
            <Popup
                show={show}
                className={"calenderMobile_wrapper"}
                onBgClick={() => {
                    setShow(false);
                }}
            >
                <div className={"calenderMobile_body"}>
                    <div className={"calenderMobile_top"}>
                        <div className="calenderMobile_name">选择日期</div>
                        <div
                            className="calenderMobile_confirmBtn"
                            onClick={() => {
                                setShow(false);
                                const valueDate = getDateInfo(value);
                                if (
                                    valueDate &&
                                    valueDate.day === playedDay &&
                                    valueDate.year === playedYear &&
                                    valueDate.month === playedMonth
                                ) {
                                    return;
                                }
                                onChange?.(new Date(playedYear, playedMonth - 1, playedDay));
                            }}
                        >
                            确认
                        </div>
                    </div>
                    <div className="calenderMobile_hr" />

                    <MobilePickerView
                        values={{
                            year: playedYear.toString(),
                            month: playedMonth.toString(),
                            day: playedDay.toString(),
                        }}
                        options={[
                            {
                                id: "year",
                                cols: yearList,
                            },
                            {
                                id: "month",
                                cols: getMonthList(),
                            },
                            {
                                id: "day",
                                cols: dayList,
                            },
                        ]}
                        onScroll={(col, res) => {
                            if (col === "year") {
                                if (res.scrollTop + res.offsetHeight >= res.scrollHeight) {
                                    setYearList((pre) => {
                                        const currentEndYear = Number(pre[pre.length - 1].id);
                                        return [...pre].concat(
                                            getYearList(currentEndYear + 9, currentEndYear + 1),
                                        );
                                    });
                                }
                            }
                        }}
                        ref={mobilePickerEvent}
                        onChange={(key, val) => {
                            if (key === "year") {
                                setPlayedYear(Number(val));
                            } else if (key === "month") {
                                setPlayedMonth(Number(val));
                            } else if (key === "day") {
                                setPlayedDay(Number(val));
                            }
                        }}
                    />
                </div>
            </Popup>
        </Fragment>
    );
};
/* <------------------------------------ **** FUNCTION COMPONENT END **** ------------------------------------ */
