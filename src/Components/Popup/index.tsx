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
import { PopupContext } from "./Unit/context";
import { useState } from "react";
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

    /**
     * 当背景被点击到时
     */
    onBgClick?: () => void;

    /**
     * 当弹框的主体被点击到时
     */
    onMainClick?: () => void;
    /**
     * 当过渡动画结束时
     */
    handleTransitionEnd?: () => void;
    /**
     * 当过渡动画结束时
     */
    handleTransitionCancel?: () => void;
    /**
     * 当过渡动画结束时
     */
    handleTransitionStart?: () => void;
}
/* <------------------------------------ **** INTERFACE END **** ------------------------------------ */
/* <------------------------------------ **** FUNCTION COMPONENT START **** ------------------------------------ */
export const Popup: React.FC<PopupProps> = ({
    show,
    children,
    className,
    style,
    onBgClick,
    onMainClick,
    handleTransitionCancel,
    handleTransitionStart,
    handleTransitionEnd,
}) => {
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

    const [transitionStatus, setTransitionStatus] = useState<"end" | "cancel" | false>(false);

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
            setTransitionStatus(false);
        }
    }

    /* <------------------------------------ **** FUNCTION END **** ------------------------------------ */
    const node = createPortal(
        <PopupContext.Provider
            value={{
                show,
                transitionStatus,
            }}
        >
            <div className="popup_wrapper">
                <Transition
                    show={show}
                    animationType="fade"
                    className={"popup_bg"}
                    firstAnimation={true}
                    onClick={onBgClick}
                />

                <Transition
                    show={show}
                    onClick={onMainClick}
                    firstAnimation={true}
                    animationType="inBottom"
                    className={classNames(className, "popup_main")}
                    style={style}
                    handleTransitionEnd={() => {
                        setTransitionStatus("end");
                        handleTransitionEnd?.();
                    }}
                    handleTransitionCancel={() => {
                        setTransitionStatus("cancel");
                        handleTransitionCancel?.();
                    }}
                    handleTransitionStart={handleTransitionStart}
                >
                    {children}
                </Transition>
            </div>
        </PopupContext.Provider>,
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
