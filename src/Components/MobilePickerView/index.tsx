/**
 * @file
 * @date 2022-11-08
 * @author mingzhou.zhang
 * @lastModify  2022-11-08
 */
/* <------------------------------------ **** DEPENDENCE IMPORT START **** ------------------------------------ */
/** This section will include all the necessary dependence for this tsx file */
import React from "react";
import classNames from "../Unit/classNames";
import "./style.scss";
import { PickerColumn, WheelType } from "./Unit/PickerColumn";
import { useRef } from "react";
/* <------------------------------------ **** DEPENDENCE IMPORT END **** ------------------------------------ */
/* <------------------------------------ **** INTERFACE START **** ------------------------------------ */
/** This section will include all the interface for this tsx file */
/* <------------------------------------ **** INTERFACE END **** ------------------------------------ */
/* <------------------------------------ **** FUNCTION COMPONENT START **** ------------------------------------ */

interface ValGroups {
    [key: string]: string;
}

interface OptGroups {
    [key: string]: Array<string>;
}

export interface MobilePickerViewProps {
    className?: string;
    style?: React.CSSProperties;
    valueGroups: ValGroups;
    optionGroups: OptGroups;
    itemHeight?: string;
    height?: string;
    wheel?: WheelType;
    onChange?: (key: string, val: string) => void;
    onClick?: (key: string, val: string) => void;
    /**
     * 每个item之间的间距
     */
    margin?: string;
}

export const MobilePickerView: React.FC<MobilePickerViewProps> = ({
    className,
    style,
    valueGroups,
    optionGroups,
    itemHeight = "3.2rem",
    height = "21.6rem",
    margin = "0.4rem",
    wheel = "off",
    onChange,
    onClick,
}) => {
    /* <------------------------------------ **** STATE START **** ------------------------------------ */
    /************* This section will include this component HOOK function *************/
    const viewRef = useRef<HTMLDivElement | null>(null);
    /* <------------------------------------ **** STATE END **** ------------------------------------ */
    /* <------------------------------------ **** PARAMETER START **** ------------------------------------ */
    /************* This section will include this component parameter *************/
    /* <------------------------------------ **** PARAMETER END **** ------------------------------------ */
    /* <------------------------------------ **** FUNCTION START **** ------------------------------------ */
    /************* This section will include this component general function *************/
    /* <------------------------------------ **** FUNCTION END **** ------------------------------------ */

    return (
        <div className={classNames("picker_container", className)} style={{ height, ...style }}>
            <div className={"picker_inner"}>
                {Object.keys(optionGroups).map((name) => {
                    return (
                        <PickerColumn
                            key={name}
                            name={name}
                            value={valueGroups[name]}
                            options={optionGroups[name]}
                            itemHeight={itemHeight}
                            columnHeight={height}
                            margin={margin}
                            wheel={wheel}
                            onChange={onChange}
                            onClick={onClick}
                            viewElement={viewRef}
                        />
                    );
                })}
                <div className={"picker_highlight"} style={{ height: itemHeight }} ref={viewRef} />
            </div>
        </div>
    );
};
/* <------------------------------------ **** FUNCTION COMPONENT END **** ------------------------------------ */
