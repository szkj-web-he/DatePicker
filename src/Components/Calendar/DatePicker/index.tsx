/**
 * @file 日期选择器
 * @date 2021-12-14
 * @author xuejie.he
 * @lastModify xuejie.he 2021-12-14
 */
/* <------------------------------------ **** DEPENDENCE IMPORT START **** ------------------------------------ */
/** This section will include all the necessary dependence for this tsx file */
import React, { forwardRef, useEffect, useRef, useState } from "react";
import { Dropdown } from "../../Common/Dropdown";
import { DropdownBtn } from "../../Common/DropdownBtn";
import { DropdownContent } from "../../Common/DropdownContent";
import { useGlobalClick } from "../../Common/Hooks/useGlobalClick";
import useUpdateEffect from "../../Hooks/useUpdateEffect";
import classNames from "../../Unit/classNames";

import { useLatest } from "./../../Hooks/useLatest";
import "./style.scss";
import { DateTemp } from "./Unit/Date";
import { DateContext } from "./Unit/dateContext";
import { DateInfoProps, getDateInfo } from "./Unit/initDate";
import { toDate } from "./Unit/typeToDate";
/* <------------------------------------ **** DEPENDENCE IMPORT END **** ------------------------------------ */
/* <------------------------------------ **** INTERFACE START **** ------------------------------------ */
/** This section will include all the interface for this tsx file */
export interface DatePickerProps extends React.DOMAttributes<HTMLDivElement> {
    /**
     * defaultValue of this component
     */
    defaultValue?: Date | number | string;

    /**
     * readonly of dropdown
     */
    readonly?: boolean;
    /**
     * disabled of input
     */
    disabled?: boolean;

    /**
     * value of this component
     */
    value?: Date | number | string;
    /**
     * width : The width of the box where the triangle is located
     * height : The width of the box where the triangle is located
     * color : Triangle color
     * offset : Triangle offset
     */
    triangle?: {
        width: string;
        height: string;
        color?: string;
        offset?: {
            x?: number | ((val: number) => number);
            y?: number | ((val: number) => number);
        };
    };
    /**
     * className of dropdown
     */
    className?: string;
    /**
     * style of dropdown
     */
    style?: React.CSSProperties;
    /**
     * offset of dropdown
     */
    offset?: {
        x?: number | ((val: number) => number);
        y?: number | ((val: number) => number);
    };
    /**
     * Where to put it in root
     */
    placement?: "lb" | "rb" | "cb" | "lt" | "rt" | "ct" | "rc" | "lc";
    /**
     * The direction of the main axis
     */
    direction?: "vertical" | "horizontal";

    /**
     * Selectable time range
     * Minimum value
     */
    minTime?: Date | number | string;
    /**
     * Selectable time range
     * Maximum value
     */
    maxTime?: Date | number | string;

    /**
     * Callback of time change
     */
    handleTimeChange?: (res: Date | null) => void;
    /**
     *  Callback of  visible change
     */
    handleVisibleChange?: (status: boolean) => void;
    /**
     * visible of this component
     */
    show?: boolean;

    children: React.ReactElement;
}
/* <------------------------------------ **** INTERFACE END **** ------------------------------------ */
/* <------------------------------------ **** FUNCTION COMPONENT START **** ------------------------------------ */
export const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>(
    (
        {
            defaultValue,
            disabled = false,
            readonly = false,
            value,
            triangle,
            className,
            style,
            offset,
            placement = "rb",
            direction = "vertical",
            minTime,
            maxTime,
            handleTimeChange,
            handleVisibleChange,
            show,
            children,
            ...props
        },
        ref,
    ) => {
        DatePicker.displayName = "DatePicker";
        /* <------------------------------------ **** STATE START **** ------------------------------------ */
        /************* This section will include this component HOOK function *************/
        const [focus, setFocus] = useState(false);

        const [time, setTime] = useState(() => {
            if (defaultValue) {
                return toDate(defaultValue);
            } else if (value) {
                return toDate(value);
            } else {
                return null;
            }
        });

        const [visible, setVisible] = useState(show ?? false);

        const [timeData, setTimeData] = useState<DateInfoProps | null>(null);

        const handleTimeChangeFn = useLatest(handleTimeChange);

        const handleVisibleChangeFn = useLatest(handleVisibleChange);

        const btnRef = useRef<HTMLDivElement | null>(null);

        const cRef = useRef<HTMLDivElement | null>(null);

        useGlobalClick(
            visible && !focus
                ? (res) => {
                      if (!res.isBtn && !res.isMenu) {
                          setVisible(false);
                      }
                  }
                : undefined,
            btnRef,
            cRef,
        );

        /* <------------------------------------ **** STATE END **** ------------------------------------ */
        /* <------------------------------------ **** PARAMETER START **** ------------------------------------ */
        /************* This section will include this component parameter *************/

        useUpdateEffect(() => {
            setVisible(show ?? false);
        }, [show]);

        useEffect(() => {
            const timeVal = value || defaultValue;

            if (timeVal) {
                const dateVal = toDate(timeVal);

                if (dateVal && dateVal.getTime() !== time?.getTime()) {
                    setTime(dateVal);
                }
            } else {
                setTime(null);
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [defaultValue, value]);

        useEffect(() => {
            if (time === null) {
                setTimeData(null);
            }

            setTimeData(getDateInfo(time || undefined));

            const timeVal = value || defaultValue;
            const dateVal = timeVal ? toDate(timeVal) : null;
            if (dateVal?.getTime() !== time?.getTime()) {
                handleTimeChangeFn.current?.(time || null);
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [time]);

        useEffect(() => {
            handleVisibleChangeFn.current?.(visible);
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [visible]);

        /* <------------------------------------ **** PARAMETER END **** ------------------------------------ */
        /* <------------------------------------ **** FUNCTION START **** ------------------------------------ */
        /************* This section will include this component general function *************/

        /**
         * 转化时间类型
         * @param data
         */
        const toChangeTime = (data = timeData) => {
            let timeVal: null | Date = null;
            if (data) {
                timeVal = new Date(
                    data.year,
                    data.month - 1,
                    data.day,
                    data.unit === "PM" ? data.hour + 12 : data.hour,
                );
            }
            setTime(timeVal);
            setVisible(false);
        };

        /**
         * 当点击事件时
         * @param year
         * @param month
         * @param date
         */
        const handleDateClick = (year: number, month: number, date: number) => {
            let data = timeData ? { ...timeData } : null;
            if (data) {
                data.year = year;
                data.month = month;
                data.day = date;
            } else {
                data = {
                    year,
                    month,
                    day: date,
                    hour: 8,
                    unit: "AM",
                };
            }
            setTimeData(data);
            toChangeTime(data);
        };

        /* <------------------------------------ **** FUNCTION END **** ------------------------------------ */
        return (
            <DateContext.Provider
                value={{
                    focus,
                    setFocus: (status) => {
                        setFocus(status);
                        if (status && !visible) {
                            setVisible(true);
                        }
                    },
                    time,
                    setTime,
                    disabled,
                }}
            >
                <Dropdown show={visible}>
                    <DropdownBtn
                        ref={btnRef}
                        style={{
                            display: "inline-block",
                        }}
                    >
                        {children}
                    </DropdownBtn>
                    <DropdownContent
                        ref={(el) => {
                            cRef.current = el;

                            if (typeof ref === "function") {
                                ref(el);
                            } else if (ref !== null) {
                                (ref as React.MutableRefObject<HTMLElement | null>).current = el;
                            }
                        }}
                        className={className}
                        bodyClassName={`datePicker_wrapper`}
                        style={style}
                        offset={
                            offset ?? {
                                y: 4,
                            }
                        }
                        triangle={triangle}
                        direction={direction}
                        placement={placement}
                        {...props}
                    >
                        <div className={classNames("date_picker_panel")}>
                            <DateTemp
                                show={visible}
                                minTime={minTime ? toDate(minTime) || undefined : undefined}
                                maxTime={maxTime ? toDate(maxTime) || undefined : undefined}
                                readonly={readonly}
                                handleDateClick={handleDateClick}
                                type={"date"}
                                year={timeData?.year}
                                month={timeData?.month}
                                day={timeData?.day}
                            />
                        </div>
                    </DropdownContent>
                </Dropdown>
            </DateContext.Provider>
        );
    },
);
/* <------------------------------------ **** FUNCTION COMPONENT END **** ------------------------------------ */
DatePicker.displayName = "DatePicker";
