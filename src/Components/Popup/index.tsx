/**
 * @file
 * @date 2022-11-14
 * @author mingzhou.zhang
 * @lastModify  2022-11-14
 */
/* <------------------------------------ **** DEPENDENCE IMPORT START **** ------------------------------------ */
/** This section will include all the necessary dependence for this tsx file */
import React, { useLayoutEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { mountElement } from "../Common/Portal/mount";
import { Transition } from "../Common/Transition";
import classNames from "../Unit/classNames";
import "./style.scss";
/* <------------------------------------ **** DEPENDENCE IMPORT END **** ------------------------------------ */
/* <------------------------------------ **** INTERFACE START **** ------------------------------------ */
/** This section will include all the interface for this tsx file */
export interface PopupProps {
    /**
     * control whether the container is display
     */
    show: boolean;

    /**
     * container content
     */
    children?: React.ReactNode;

    /**
     *
     */
    className?: string;

    style?: React.CSSProperties;
}
/* <------------------------------------ **** INTERFACE END **** ------------------------------------ */
/* <------------------------------------ **** FUNCTION COMPONENT START **** ------------------------------------ */
export const Popup: React.FC<PopupProps> = ({ show, children, className, style }) => {
    /* <------------------------------------ **** STATE START **** ------------------------------------ */
    /************* This section will include this component HOOK function *************/
    /***
     * 记录上一次的show的状态
     */
    const showRef = useRef<{
        from?: boolean;
        to?: boolean;
    }>({
        from: undefined,
        to: undefined,
    });

    /* <------------------------------------ **** STATE END **** ------------------------------------ */
    /* <------------------------------------ **** PARAMETER START **** ------------------------------------ */
    /************* This section will include this component parameter *************/
    useLayoutEffect(() => {
        return () => {
            showRef.current = {
                from: undefined,
                to: undefined,
            };
        };
    }, []);
    /* <------------------------------------ **** PARAMETER END **** ------------------------------------ */
    /* <------------------------------------ **** FUNCTION START **** ------------------------------------ */
    /************* This section will include this component general function *************/

    {
        if (show !== showRef.current.to) {
            showRef.current = {
                from: showRef.current.to,
                to: show,
            };
        }
    }

    /* <------------------------------------ **** FUNCTION END **** ------------------------------------ */
    const node = createPortal(
        <div className="popup_wrapper">
            <Transition
                show={show}
                animationType="fade"
                className={"popup_bg"}
                firstAnimation={true}
            />

            <Transition
                show={show}
                firstAnimation={true}
                animationType="inBottom"
                className={classNames(className, "popup_main")}
                style={style}
            >
                {children}
            </Transition>
        </div>,
        mountElement(),
    );

    /**
     * 初次不创建
     */
    if (showRef.current.from === undefined && showRef.current.to === false) {
        return <></>;
    }
    return <>{node}</>;
};
/* <------------------------------------ **** FUNCTION COMPONENT END **** ------------------------------------ */
