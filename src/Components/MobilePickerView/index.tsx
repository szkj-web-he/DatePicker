/**
 * @file
 * @date 2022-11-08
 * @author mingzhou.zhang
 * @lastModify  2022-11-08
 */
/* <------------------------------------ **** DEPENDENCE IMPORT START **** ------------------------------------ */
/** This section will include all the necessary dependence for this tsx file */
import React, { useRef } from "react";
import classNames from "../Unit/classNames";
import "./style.scss";
import { EventProps, PickerColumn } from "./Unit/PickerColumn";
import { ColScrollProps } from "./Unit/type";
import { forwardRef } from "react";
import { useImperativeHandle } from "react";
/* <------------------------------------ **** DEPENDENCE IMPORT END **** ------------------------------------ */
/* <------------------------------------ **** INTERFACE START **** ------------------------------------ */
/** This section will include all the interface for this tsx file */
/* <------------------------------------ **** INTERFACE END **** ------------------------------------ */
/* <------------------------------------ **** FUNCTION COMPONENT START **** ------------------------------------ */

interface OptionItem {
    id: string;
    cols: Array<{
        content: React.ReactNode;
        id: string;
    }>;
}

export interface MobilePickerViewProps {
    /**
     * 这个组件的className
     */
    className?: string;
    /**
     * 这个组件的style
     */
    style?: React.CSSProperties;

    /**
     * 选项列表
     */
    options: Array<OptionItem>;

    /**
     * 答案列表
     * 键是 行的id
     * 值是 列选中的id
     */
    values: Record<string, string>;

    /**
     * 列的每个单元的高度
     */
    itemHeight?: string;

    /**
     *
     * @param key 哪一行的id
     * @param val 列选中的单元的id
     * @returns
     */
    onChange?: (key: string, val: string) => void;

    /**
     * 列的每个单元的间距
     */
    margin?: string;
    /**
     * 视口的高度
     */
    viewHeight?: string;
    /**
     * 滚动
     */
    onScroll?: (colId: string, scrollData: ColScrollProps) => void;
}

export interface MobilePickerEventProps {
    /**
     * 指定某列 滚动到某个item上
     * @param colId
     * @param colItemId
     * @returns
     */
    scrollTo: (colId: string, colItemId: string) => void;
}

const Temp: React.ForwardRefRenderFunction<MobilePickerEventProps, MobilePickerViewProps> = (
    {
        className,
        style,
        itemHeight = "3.2rem",
        viewHeight = "21.6rem",
        margin = "0.4rem",
        options,
        values,
        onChange,
        onScroll,
    },
    ref,
) => {
    /* <------------------------------------ **** STATE START **** ------------------------------------ */
    /************* This section will include this component HOOK function *************/
    const viewRef = useRef<HTMLDivElement | null>(null);

    const pickerEvent = useRef<Record<string, EventProps | null>>({});
    /* <------------------------------------ **** STATE END **** ------------------------------------ */
    /* <------------------------------------ **** PARAMETER START **** ------------------------------------ */
    /************* This section will include this component parameter *************/

    useImperativeHandle(ref, () => {
        return {
            scrollTo: (id, colItemId) => {
                pickerEvent.current[id]?.scrollToId(colItemId);
            },
        };
    });

    /* <------------------------------------ **** PARAMETER END **** ------------------------------------ */
    /* <------------------------------------ **** FUNCTION START **** ------------------------------------ */
    /************* This section will include this component general function *************/
    /* <------------------------------------ **** FUNCTION END **** ------------------------------------ */

    return (
        <div
            className={classNames("picker_container", className)}
            style={{ height: viewHeight, ...style }}
        >
            <div className={"picker_inner"}>
                {options.map((col) => {
                    return (
                        <PickerColumn
                            key={col.id}
                            value={values[col.id]}
                            options={col.cols}
                            itemHeight={itemHeight}
                            margin={margin}
                            onChange={(res) => {
                                onChange?.(col.id, res);
                            }}
                            ref={(e) => {
                                pickerEvent.current[col.id] = e;
                            }}
                            viewElement={viewRef}
                            onScroll={(res) => {
                                onScroll?.(col.id, res);
                            }}
                        />
                    );
                })}
                <div className={"picker_highlight"} style={{ height: itemHeight }} ref={viewRef} />
            </div>
        </div>
    );
};
/* <------------------------------------ **** FUNCTION COMPONENT END **** ------------------------------------ */
export const MobilePickerView = forwardRef(Temp);
