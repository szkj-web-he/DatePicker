/**
 * @file
 * @date 2022-11-18
 * @author mingzhou.zhang
 * @lastModify  2022-11-18
 */
/* <------------------------------------ **** DEPENDENCE IMPORT START **** ------------------------------------ */
/** This section will include all the necessary dependence for this tsx file */
import React, { Fragment, useState } from "react";
import { MobilePickerView } from "../MobilePickerView";
import { Popup } from "../Popup";
import "./style.scss";
import { useMemo } from "react";
import { DateInfoProps, getDateInfo } from "../Calendar/DatePicker/Unit/initDate";
import { addZero } from "./../Calendar/DatePicker/Unit/dateFormat";
/* <------------------------------------ **** DEPENDENCE IMPORT END **** ------------------------------------ */
/* <------------------------------------ **** INTERFACE START **** ------------------------------------ */
/** This section will include all the interface for this tsx file */

export interface CalendarMobileProps {
    value?: Date;
    disabled?: boolean;
    onChange?: (value: Date) => void;
}

/* <------------------------------------ **** INTERFACE END **** ------------------------------------ */
/* <------------------------------------ **** FUNCTION COMPONENT START **** ------------------------------------ */
export const CalendarMobile: React.FC<CalendarMobileProps> = ({
    value = new Date(),
    disabled,
    onChange,
}) => {
    /* <------------------------------------ **** STATE START **** ------------------------------------ */
    /************* This section will include this component HOOK function *************/
    const [show, setShow] = useState(true);

    const dateValue = useMemo(() => {
        const data = getDateInfo(value) as DateInfoProps;
        return {
            year: data.year.toString(),
            month: data.month.toString(),
            day: data.day.toString(),
        };
    }, [value]);

    /* <------------------------------------ **** STATE END **** ------------------------------------ */
    /* <------------------------------------ **** PARAMETER START **** ------------------------------------ */
    /************* This section will include this component parameter *************/

    /* <------------------------------------ **** PARAMETER END **** ------------------------------------ */
    /* <------------------------------------ **** FUNCTION START **** ------------------------------------ */
    /************* This section will include this component general function *************/

    const generateNumberArray = (begin: number, end: number) => {
        const array: string[] = [];
        for (let i = begin; i <= end; i++) {
            array.push(i.toString());
        }
        return array;
    };

    /**
     * 选中每个字段的可选范围
     */

    const getDatePart = (date: Record<string, string>) => {
        const { year, month } = date;
        const days = new Date(Number(year), Number(month), 0).getDate();
        return {
            year: generateNumberArray(1970, 2100),
            month: generateNumberArray(1, 12),
            day: generateNumberArray(1, days),
        };
    };
    /* <------------------------------------ **** FUNCTION END **** ------------------------------------ */
    return (
        <Fragment>
            <Popup show={show} className={"calenderMobile_wrapper"}>
                <div className={"calenderMobile_body"}>
                    <div className={"calenderMobile_top"}>
                        <div className="calenderMobile_name">选择日期</div>
                        <div className="calenderMobile_confirmBtn">确认</div>
                    </div>
                    <div className="calenderMobile_hr" />

                    <MobilePickerView
                        valueGroups={{
                            ...dateValue,
                        }}
                        optionGroups={getDatePart({ ...dateValue })}
                    />
                </div>
            </Popup>
        </Fragment>
    );
};
/* <------------------------------------ **** FUNCTION COMPONENT END **** ------------------------------------ */
