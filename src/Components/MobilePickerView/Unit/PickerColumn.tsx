/**
 * @file
 * @date 2022-11-08
 * @author mingzhou.zhang
 * @lastModify  2022-11-08
 */
/* <------------------------------------ **** DEPENDENCE IMPORT START **** ------------------------------------ */
/** This section will include all the necessary dependence for this tsx file */
import React, {
    forwardRef,
    MutableRefObject,
    useImperativeHandle,
    useLayoutEffect,
    useRef,
    useState,
} from "react";
import { usePopupContext } from "../../Popup/Unit/context";
import classNames from "../../Unit/classNames";
import { mul, sub, sum, toDiv } from "../../Unit/math";
import { useLatest } from "./../../Hooks/useLatest";
import { useUnmount } from "./../../Hooks/useUnmount";
import { getItemsTranslateY } from "./getItemsTranslateY";
import { ColScrollProps } from "./type";
import useEventListener from "./../../Hooks/useEventListener";

/* <------------------------------------ **** DEPENDENCE IMPORT END **** ------------------------------------ */
/* <------------------------------------ **** INTERFACE START **** ------------------------------------ */
/** This section will include all the interface for this tsx file */

export interface PickerColumnProps {
    /**
     * 当前选中的值
     */
    value: string;
    /**
     * 选项列表
     *
     */
    options: Array<{ id: string; content: React.ReactNode }>;
    /**
     * 每个item的高度
     */
    itemHeight: string;
    /**
     * 每个item的间距
     */
    margin?: string;
    /**
     * 标识选中的块级元素
     */
    viewElement: MutableRefObject<HTMLDivElement | null>;
    /**
     * 当value发生改变时
     */
    onChange?: (itemId: string) => void;
    /**
     * 当滚动时
     */
    onScroll?: (res: ColScrollProps) => void;
}

export interface EventProps {
    /**
     * 滚动到id位置
     * @param id
     * @returns
     */
    scrollToId: (id: string) => void;
}

/* <------------------------------------ **** INTERFACE END **** ------------------------------------ */
/* <------------------------------------ **** FUNCTION COMPONENT START **** ------------------------------------ */
const Temp: React.ForwardRefRenderFunction<EventProps, PickerColumnProps> = (
    { value, options, itemHeight, onChange, margin, viewElement, onScroll },
    eventProps,
) => {
    /* <------------------------------------ **** STATE START **** ------------------------------------ */
    /************* This section will include this component HOOK function *************/

    const ref = useRef<HTMLDivElement>(null);

    const optionIds = useLatest(options.map((item) => item.id));

    /**
     * 轮询计时器
     */
    const intervalTimer = useRef<number | null>(null);

    /**
     * 上一次的数据
     * y: pageY
     * time:上一次的时间戳
     */
    const preData = useRef({
        y: 0,
        time: 0,
    });

    /**
     * 当前要偏移的Y轴坐标
     */
    const translateYRef = useRef(0);
    const [translateY, setTranslateY] = useState(0);

    /**
     * 记录最后一次touch的时候的移动速度
     */
    const lastTouchSpeed = useRef(0);

    /**
     * 向上滚动
     * 向下滚动
     */
    const directionRef = useRef<"toTop" | "toBottom">();

    /**
     * 保存是否touch move过了
     * 主要是用来区分click事件
     */
    const isTouchMove = useRef(false);

    /**
     * 如果嵌套再popup组件里的话
     * 需要获取它的过渡状态
     */
    const { show, transitionStatus } = usePopupContext();

    /**
     *
     */
    const valueRef = useLatest(value);

    const isTouchStart = useRef(false);

    /* <------------------------------------ **** STATE END **** ------------------------------------ */
    /* <------------------------------------ **** PARAMETER START **** ------------------------------------ */
    /************* This section will include this component parameter *************/
    useUnmount(() => {
        intervalTimer.current && window.cancelAnimationFrame(intervalTimer.current);
        preData.current = {
            y: 0,
            time: 0,
        };
        lastTouchSpeed.current = 0;
        directionRef.current = undefined;
        isTouchMove.current = false;
        isTouchStart.current = false;
    });

    useLayoutEffect(() => {
        if (show && transitionStatus) {
            const itemsTranslateY = getItemsTranslateY(
                translateYRef.current,
                optionIds.current,
                ref.current,
                viewElement.current,
            );

            const arr = itemsTranslateY ?? [];
            for (let i = 0; i < arr.length; ) {
                const item = arr[i];

                if (item.id === valueRef.current) {
                    translateYRef.current = item.translateY;
                    setTranslateY(item.translateY);
                    i = arr.length;
                } else {
                    ++i;
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show, transitionStatus]);

    /* <------------------------------------ **** PARAMETER END **** ------------------------------------ */
    /* <------------------------------------ **** FUNCTION START **** ------------------------------------ */
    /************* This section will include this component general function *************/

    useImperativeHandle(eventProps, () => ({
        scrollToId: (id: string) => {
            jumpTo(id);
        },
    }));

    /**
     * item的点击事件
     */
    const jumpTo = (id: string) => {
        const arr =
            getItemsTranslateY(
                translateYRef.current,
                optionIds.current,
                ref.current,
                viewElement.current,
            ) ?? [];
        for (let i = 0; i < arr.length; ) {
            const item = arr[i];
            if (item.id === id) {
                toBeValue(item.translateY, 500);

                i = arr.length;
            } else {
                ++i;
            }
        }
        onChange?.(id);
    };

    /**
     * 改变偏移值
     */
    const changeTranslateY = (val: number) => {
        translateYRef.current = sum(translateYRef.current, val);
        setTranslateY(translateYRef.current);
    };

    /**
     * 开始触摸
     * 记录开始 y轴的初始坐标
     */
    const handleTouchStart = (e: TouchEvent) => {
        if (!e.cancelable) {
            return;
        }
        e.stopImmediatePropagation();
        e.stopPropagation();
        isTouchStart.current = true;

        const touchEvent = e.changedTouches[0];
        intervalTimer.current && window.clearInterval(intervalTimer.current);

        preData.current = {
            y: touchEvent.pageY,
            time: Date.now(),
        };
    };

    useEventListener("touchstart", handleTouchStart, ref, {
        passive: false,
    });

    /**
     * 获取滚动值
     */
    const getScrollData = () => {
        const el = ref.current;
        const scrollEl = ref.current?.getElementsByClassName("picker_scroller")[0] as
            | HTMLElement
            | undefined;

        onScroll?.({
            scrollHeight: scrollEl?.offsetHeight ?? 0,
            scrollTop: -translateYRef.current,
            offsetHeight: el?.offsetHeight ?? 0,
        });
    };

    /**
     * 触摸中
     * 用新的坐标 减去初始的坐标 都是y轴
     */
    const handleTouchMove = (e: TouchEvent) => {
        if (!isTouchStart.current) {
            return;
        }

        e.preventDefault();
        e.stopImmediatePropagation();
        const touchEvent = e.changedTouches[0];

        const y = touchEvent.pageY;
        isTouchMove.current = true;
        /**
         * 获取移动的方向
         */
        if (y > preData.current.y) {
            directionRef.current = "toBottom";
        } else if (y < preData.current.y) {
            directionRef.current = "toTop";
        }

        /**
         * 计算移动的距离
         */
        const moveY = sub(y, preData.current.y);

        changeTranslateY(moveY);

        getScrollData();

        preData.current.y = y;
        /**
         * 计算速度
         */

        const time = Date.now();

        lastTouchSpeed.current = toDiv(moveY, sub(time, preData.current.time));

        preData.current.time = time;
    };
    useEventListener("touchmove", handleTouchMove, ref);

    /**
     * 将偏移值变着它
     * @param end
     * @param ms 有没有时间限制
     * @returns
     */
    const toBeValue = (end: number, ms = 100) => {
        intervalTimer.current && window.cancelAnimationFrame(intervalTimer.current);

        if (end === translateYRef.current) {
            return;
        }

        if (ms === 0) {
            /**
             * 如果没有过渡时间
             */
            translateYRef.current = end;
            setTranslateY(translateYRef.current);
            return;
        }

        let marginVal = 0;

        let startTime = Date.now();
        marginVal = (end - translateYRef.current) / ms;

        const animationFn = () => {
            let moveVal = marginVal;
            const currentTime = Date.now();
            const offsetTimeVal = currentTime - startTime;
            startTime = currentTime;
            moveVal = mul(offsetTimeVal * marginVal);

            if (
                (moveVal > 0 && sub(end, translateYRef.current) <= mul(moveVal, 2)) ||
                (moveVal < 0 && sub(end, translateYRef.current) >= mul(moveVal, 2))
            ) {
                translateYRef.current = end;
                setTranslateY(translateYRef.current);
                getScrollData();
                intervalTimer.current && window.cancelAnimationFrame(intervalTimer.current);
                intervalTimer.current = null;
                return;
            }

            changeTranslateY(moveVal);
            getScrollData();
            intervalTimer.current = window.requestAnimationFrame(animationFn);
        };

        intervalTimer.current = window.requestAnimationFrame(animationFn);
    };

    /**
     * 找到小于视口的bottom值
     * 且bottom值最相近的一个节点
     */

    const findTopNode = () => {
        const itemsRect = getItemsTranslateY(
            translateYRef.current,
            optionIds.current,
            ref.current,
            viewElement.current,
        );

        intervalTimer.current && window.cancelAnimationFrame(intervalTimer.current);

        const translateYVal = translateYRef.current;
        if (itemsRect === undefined) {
            return;
        }
        let val: number | null = null;
        for (let i = itemsRect.length - 1; i >= 0; ) {
            const item = itemsRect[i];
            const itemBottom = sub(item.translateY, item.height);

            const viewBottom = sub(translateYVal, item.height);

            if (itemBottom > viewBottom) {
                if (value !== item.id) {
                    onChange?.(item.id);
                }
                val = item.translateY;
                i = -1;
            } else {
                --i;
            }
        }

        if (val === null) {
            toBeValue(itemsRect[0].translateY);
            if (value !== itemsRect[0].id) {
                onChange?.(itemsRect[0].id);
            }
        } else {
            toBeValue(val);
        }
    };

    /**
     * 找到大于视口的top值
     * 且top值最相近的一个节点
     */
    const findUnderNode = () => {
        intervalTimer.current && window.cancelAnimationFrame(intervalTimer.current);

        const itemsRect = getItemsTranslateY(
            translateYRef.current,
            optionIds.current,
            ref.current,
            viewElement.current,
        );

        const translateYVal = translateYRef.current;

        if (itemsRect === undefined) {
            return;
        }
        let val: number | null = null;
        for (let i = 0; i < itemsRect.length; ) {
            const item = itemsRect[i];

            if (item.translateY < translateYVal) {
                if (value !== item.id) {
                    onChange?.(item.id);
                }

                val = item.translateY;
                i = itemsRect.length;
            } else {
                ++i;
            }
        }
        if (val === null) {
            const lastItem = itemsRect[itemsRect.length - 1];
            toBeValue(lastItem.translateY);

            if (value !== lastItem.id) {
                onChange?.(lastItem.id);
            }
        } else {
            toBeValue(val);
        }
    };

    /**
     * 找一个自身一半的内容在视口的节点
     */
    const findSelectNode = () => {
        const itemsTranslateYData = getItemsTranslateY(
            translateYRef.current,
            optionIds.current,
            ref.current,
            viewElement.current,
        );

        const translateYVal = translateYRef.current;

        if (itemsTranslateYData === undefined) {
            return;
        }

        let selectIndex = -1;

        for (let i = 0; i < itemsTranslateYData.length; ) {
            const itemData = itemsTranslateYData[i];

            /**
             * 视口的bottom
             */
            const viewBottom = translateYVal - itemData.height;

            /**
             * item的bottom
             */
            const itemBottom = itemData.translateY - itemData.height;

            if (itemData.translateY === translateYVal) {
                /**
                 * 刚好停在了合适的位置
                 */
                selectIndex = i;
                i = itemsTranslateYData.length;
            } else if (itemData.translateY < translateYVal && viewBottom < itemData.translateY) {
                /**
                 * item的头在视口里
                 * 当前节点与视口发生了交集
                 */
                if (Math.abs(sub(viewBottom, itemData.translateY)) >= toDiv(itemData.height, 2)) {
                    /**
                     * 当前节点的一半以上的身体在视口内
                     */
                    selectIndex = i;
                    i = itemsTranslateYData.length;
                    //需要移动的距离 向上移动
                    toBeValue(itemData.translateY);
                    if (value !== itemData.id) {
                        onChange?.(itemData.id);
                    }
                } else {
                    ++i;
                }
            } else if (itemBottom < translateYVal && itemBottom > viewBottom) {
                /**
                 * item的脚在视口里
                 * 当前节点与视口发生了交集
                 */

                if (Math.abs(sub(itemBottom, translateYVal)) >= toDiv(itemData.height, 2)) {
                    /**
                     * 当前节点的一半以上的身体在视口内
                     */
                    selectIndex = i;
                    i = itemsTranslateYData.length;
                    //需要移动的距离  向下移动
                    toBeValue(itemData.translateY);
                    if (value !== itemData.id) {
                        onChange?.(itemData.id);
                    }
                } else {
                    ++i;
                }
            } else {
                ++i;
            }
        }

        if (selectIndex === -1) {
            const firstNode = itemsTranslateYData[0];

            const lastNode = itemsTranslateYData[itemsTranslateYData.length - 1];

            if (firstNode.translateY < translateYVal) {
                toBeValue(firstNode.translateY);
                if (firstNode.id !== value) {
                    onChange?.(firstNode.id);
                }
            } else if (translateYVal < lastNode.translateY) {
                toBeValue(lastNode.translateY);
                if (lastNode.id !== value) {
                    onChange?.(lastNode.id);
                }
            } else {
                findUnderNode();
            }
        }
    };

    /**
     * 触摸结束
     *
     * 开始自动滚动
     * 一个减速的定时触发
     *
     */
    const handleTouchEnd = () => {
        if (!isTouchMove.current || !isTouchStart.current) {
            return;
        }
        isTouchMove.current = false;

        let startTime = Date.now();
        const currentSpeed = lastTouchSpeed.current;

        const minSpeed = 0.5;

        if (directionRef.current === undefined || Math.abs(currentSpeed) <= minSpeed) {
            /**
             * 没有速度
             * 或者没有 移动的方向
             */
            findSelectNode();
            return;
        }

        const el = ref.current;
        if (!el) {
            return;
        }
        const scrollEl = el.getElementsByClassName("picker_scroller")[0] as HTMLElement;
        if (!scrollEl) {
            return;
        }

        // const
        const animationFrameFn = () => {
            const currentTime = Date.now();

            const offsetTime = sub(currentTime, startTime);
            startTime = currentTime;

            /**
             * 速度递减
             */

            /**
             * 加个限制
             * 当滚动的距离超过了滚动容器
             * 则  不再进行滚动
             */

            if (
                scrollEl.scrollHeight >= Math.abs(translateYRef.current) &&
                translateYRef.current <= el.offsetHeight
            ) {
                if (lastTouchSpeed.current > minSpeed) {
                    lastTouchSpeed.current = sub(lastTouchSpeed.current, 0.2);
                    const moveVal = mul(offsetTime, lastTouchSpeed.current);
                    changeTranslateY(moveVal);
                    getScrollData();
                    intervalTimer.current = window.requestAnimationFrame(animationFrameFn);
                    return;
                } else if (lastTouchSpeed.current < -1 * minSpeed) {
                    lastTouchSpeed.current = sum(lastTouchSpeed.current, 0.2);
                    const moveVal = mul(offsetTime, lastTouchSpeed.current);
                    changeTranslateY(moveVal);
                    getScrollData();
                    intervalTimer.current = window.requestAnimationFrame(animationFrameFn);
                    return;
                }
            }

            /**
             * 当速度在小于1的时候
             * 要找到合适的位置停
             */
            intervalTimer.current && window.cancelAnimationFrame(intervalTimer.current);

            if (directionRef.current === "toBottom") {
                findTopNode();
                return;
            }
            findUnderNode();
        };
        intervalTimer.current = window.requestAnimationFrame(animationFrameFn);
    };

    useEventListener("touchend", handleTouchEnd, ref);

    /**
     * 触摸取消
     *
     * 不触发自动滚动
     */
    const handleTouchCancel = () => {
        if (!isTouchMove.current || !isTouchStart.current) {
            return;
        }
        findSelectNode();
        isTouchMove.current = false;
        intervalTimer.current && window.cancelAnimationFrame(intervalTimer.current);
    };

    useEventListener("touchcancel", handleTouchCancel, ref);

    /* <------------------------------------ **** FUNCTION END **** ------------------------------------ */
    return (
        <div className={"picker_column"} ref={ref}>
            <div className={"picker_scroller"} style={{ transform: `translateY(${translateY}px)` }}>
                {options.map((option, index) => {
                    const style: React.CSSProperties = {
                        height: itemHeight,
                        lineHeight: itemHeight,
                        marginTop: index ? margin : undefined,
                    };
                    return (
                        <div
                            key={index}
                            style={style}
                            className={classNames("picker_item", {
                                picker_item_selected: option.id === value,
                            })}
                            onClick={() => jumpTo(option.id)}
                        >
                            <div className="picker_itemContent">{option.content}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
/* <------------------------------------ **** FUNCTION COMPONENT END **** ------------------------------------ */
export const PickerColumn = forwardRef(Temp);
