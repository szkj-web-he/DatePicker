/**
 * @file 手机端日期选择器的输入框
 * @date 2023-02-13
 * @author xuejie.he
 * @lastModify xuejie.he 2023-02-13
 */
/* <------------------------------------ **** DEPENDENCE IMPORT START **** ------------------------------------ */
/** This section will include all the necessary dependence for this tsx file */
import React from "react";
import { Icon } from "../../Icon";
import classNames from "../../Unit/classNames";
/* <------------------------------------ **** DEPENDENCE IMPORT END **** ------------------------------------ */
/* <------------------------------------ **** INTERFACE START **** ------------------------------------ */
/** This section will include all the interface for this tsx file */
interface TempProps {
    show: boolean;

    placeholder?: string;

    value: string;
    /**
     * 清除了当前选中的时间
     */
    handleClearClick: () => void;
    /**
     * 当日期被点击时
     */
    onClick: () => void;
    /**
     *
     */
    className?: string;
}
/* <------------------------------------ **** INTERFACE END **** ------------------------------------ */
/* <------------------------------------ **** FUNCTION COMPONENT START **** ------------------------------------ */
const Temp: React.FC<TempProps> = ({
    show,
    placeholder = "请选择日期",
    value,
    handleClearClick,
    onClick,
    className,
}) => {
    /* <------------------------------------ **** STATE START **** ------------------------------------ */
    /************* This section will include this component HOOK function *************/
    /* <------------------------------------ **** STATE END **** ------------------------------------ */
    /* <------------------------------------ **** PARAMETER START **** ------------------------------------ */
    /************* This section will include this component parameter *************/

    /* <------------------------------------ **** PARAMETER END **** ------------------------------------ */
    /* <------------------------------------ **** FUNCTION START **** ------------------------------------ */
    /************* This section will include this component general function *************/
    /* <------------------------------------ **** FUNCTION END **** ------------------------------------ */
    return (
        <div
            className={classNames(className, "mobileCalendarInput_wrapper", {
                mobileCalendarInput_Active: show,
            })}
            onClick={onClick}
        >
            {value ? (
                value
            ) : (
                <span className={"mobileCalendarInput_placeholder"}>{placeholder}</span>
            )}

            <div
                className={"mobileCalendarInput_icon"}
                style={value ? {} : { pointerEvents: "none" }}
            >
                {value ? (
                    <Icon
                        type="empty"
                        className={"mobileCalendarInput_clearIcon"}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleClearClick?.();
                        }}
                    />
                ) : (
                    <Icon type="calendar" className={"mobileCalendarInput_calendarIcon"} />
                )}
            </div>
        </div>
    );
};
/* <------------------------------------ **** FUNCTION COMPONENT END **** ------------------------------------ */
export default Temp;
