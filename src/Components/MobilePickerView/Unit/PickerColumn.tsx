/**
 * @file
 * @date 2022-11-08
 * @author mingzhou.zhang
 * @lastModify  2022-11-08
 */
/* <------------------------------------ **** DEPENDENCE IMPORT START **** ------------------------------------ */
/** This section will include all the necessary dependence for this tsx file */
import React, {
    MutableRefObject,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import classNames from "../../Unit/classNames";
import { mul, sub, sum, toDiv } from "../../Unit/math";
import { transformValue } from "../../Unit/transformValue";
import { unit } from "./data";

/* <------------------------------------ **** DEPENDENCE IMPORT END **** ------------------------------------ */
/* <------------------------------------ **** INTERFACE START **** ------------------------------------ */
/** This section will include all the interface for this tsx file */
type TransitionType = "wheel" | "touch" | "click";

export type WheelType = "off" | "natural" | "normal";

export interface PickerColumnProps {
    name: string;
    value: string;
    options: Array<string>;
    itemHeight: string;
    columnHeight: string;
    wheel?: WheelType;
    onChange?: (key: string, val: string) => void;
    onClick?: (key: string, val: string) => void;
    margin?: string;

    /**
     * 标识选中的块级元素
     */
    viewElement: MutableRefObject<HTMLDivElement | null>;
}

export interface TransformOptions {
    startTouchY: number;
    startScrollerTranslate: number;
    isMoving: boolean;
    minTranslate: number;
    maxTranslate: number;
}
/* <------------------------------------ **** INTERFACE END **** ------------------------------------ */
/* <------------------------------------ **** FUNCTION COMPONENT START **** ------------------------------------ */
export const PickerColumn: React.FC<PickerColumnProps> = (props) => {
    const {
        name,
        value,
        options,
        itemHeight,
        columnHeight,
        wheel = "off",
        onChange,
        onClick,
        margin,
        viewElement,
    } = props;
    /* <------------------------------------ **** STATE START **** ------------------------------------ */
    /************* This section will include this component HOOK function *************/
    const getTranslate = useMemo(() => {
        let selectedIndex = options.indexOf(value);
        const columnHeightVal = transformValue(columnHeight);
        const itemHeightVal = transformValue(itemHeight);
        if (selectedIndex < 0) {
            // throw new ReferenceError();
            console.warn(`Warning: "${name}" doesn't contain an option of "${value}".`);
            onChange?.(name, options[0]);
            selectedIndex = 0;
        }

        return {
            startScrollerTranslate:
                columnHeightVal / 2 - itemHeightVal / 2 - selectedIndex * itemHeightVal,
            minTranslate: columnHeightVal / 2 - itemHeightVal * options.length + itemHeightVal / 2,
            maxTranslate: columnHeightVal / 2 - itemHeightVal / 2,
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [columnHeight, itemHeight, name, options, value]);

    const [scrollerTranslate, setScrollerTranslate] = useState(
        getTranslate?.startScrollerTranslate ?? 0,
    );

    const transformOptions = useRef<TransformOptions | null>(null);
    const transitionType = useRef<TransitionType | null>(null);
    const clickValue = useRef<string>("");
    const wheelValue = useRef<string>("");
    const touchValue = useRef<string>("");

    const srcollerWrapRef = useRef<HTMLDivElement>(null);

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
     * 每个item之间的距离
     * translateY一定得是 itemMargin的倍数
     */
    const itemSizeData = useRef({
        height: 0,
        totalHeight: 0,
    });

    /**
     * 向上滚动
     * 向下滚动
     */
    const directionRef = useRef<"toTop" | "toBottom">();

    // useEffect(() => {
    //     removeEventListener();

    //     addEventListener();
    //     return () => {
    //         removeEventListener();
    //     };
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [options]);

    useLayoutEffect(() => {
        if (transformOptions.current === null) {
            transformOptions.current = {
                isMoving: false,
                startTouchY: 0,
                ...getTranslate,
            };
        } else {
            transformOptions.current = {
                ...transformOptions.current,
                ...getTranslate,
            };
        }
        const index = options.indexOf(value);
        const scrollerValue = calcScrollerValue(index);
        setScrollerTranslate(scrollerValue);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getTranslate, props]);
    /* <------------------------------------ **** STATE END **** ------------------------------------ */
    /* <------------------------------------ **** PARAMETER START **** ------------------------------------ */
    /************* This section will include this component parameter *************/
    // const addEventListener = () => {
    //     srcollerWrapRef.current?.addEventListener("wheel", handleWheel);
    //     srcollerWrapRef.current?.addEventListener("touchstart", handleTouchStart);
    //     srcollerWrapRef.current?.addEventListener("touchmove", handleTouchMove);
    //     srcollerWrapRef.current?.addEventListener("touchend", handleTouchEnd);
    //     srcollerWrapRef.current?.addEventListener("touchcancel", handleTouchCancel);
    // };

    // const removeEventListener = () => {
    //     srcollerWrapRef.current?.removeEventListener("wheel", handleWheel);
    //     srcollerWrapRef.current?.removeEventListener("touchstart", handleTouchStart);
    //     srcollerWrapRef.current?.removeEventListener("touchmove", handleTouchMove);
    //     srcollerWrapRef.current?.removeEventListener("touchend", handleTouchEnd);
    //     srcollerWrapRef.current?.removeEventListener("touchcancel", handleTouchCancel);
    // };
    /* <------------------------------------ **** PARAMETER END **** ------------------------------------ */
    /* <------------------------------------ **** FUNCTION START **** ------------------------------------ */
    /************* This section will include this component general function *************/
    // 过渡结束后 更新组件
    const handleScrollerTransition = (type: TransitionType) => {
        switch (type) {
            case "wheel":
                {
                    const option = wheelValue.current;
                    onChange?.(name, option);
                }
                break;
            case "touch":
                {
                    const option = touchValue.current;
                    onChange?.(name, option);
                }
                break;
            case "click":
                {
                    const option = clickValue.current;
                    if (option === value) {
                        onClick?.(name, value);
                    } else {
                        onChange?.(name, option);
                    }
                }
                break;
        }
    };

    // 根据下标 计算滚动距离
    const calcScrollerValue = (selectedIndex: number) => {
        if (transformOptions.current) {
            const { maxTranslate } = transformOptions.current;
            const itemHeightVal = transformValue(itemHeight);
            return maxTranslate - selectedIndex * itemHeightVal;
        }
        return 0;
    };

    const handleItemClick = (option: string) => {
        transitionType.current = "click";
        clickValue.current = option;

        const selectIndex = options.indexOf(option);
        const scrollerValue = calcScrollerValue(selectIndex);
        setScrollerTranslate(scrollerValue);
    };

    /**
     * 改变偏移值
     */
    const changeTranslateY = (val: number) => {
        translateYRef.current += val;
        setTranslateY(translateYRef.current);
    };

    /**
     * 开始触摸
     * 记录开始 y轴的初始坐标
     */
    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        const touchEvent = e.changedTouches[0];

        const node = srcollerWrapRef.current?.getElementsByClassName("picker_item")[0] as
            | HTMLDivElement
            | undefined;

        const height = node?.offsetHeight ?? 0;
        const margin = node
            ? Number(window.getComputedStyle(node, null).marginTop.replace("px", ""))
            : 0;
        itemSizeData.current = {
            height,
            totalHeight: height + margin,
        };

        preData.current = {
            y: touchEvent.pageY,
            time: Date.now(),
        };
    };
    /**
     * 触摸中
     * 用新的坐标 减去初始的坐标 都是y轴
     */
    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        const touchEvent = e.changedTouches[0];

        const y = touchEvent.pageY;

        /**
         * 获取移动的方向
         */
        if (y > preData.current.y) {
            directionRef.current = "toBottom";
        } else if (y < preData.current.y) {
            directionRef.current = "toTop";
        } else {
            directionRef.current = undefined;
        }

        /**
         * 计算移动的距离
         */
        const moveY = sub(y, preData.current.y);

        changeTranslateY(moveY);

        preData.current.y = y;
        /**
         * 计算速度
         */

        const time = Date.now();

        lastTouchSpeed.current = toDiv(moveY, sub(time, preData.current.time));

        preData.current.time = time;
    };

    /**
     * 轮询移动
     */
    const toMoveInterval = (total: number) => {
        intervalTimer.current && window.clearInterval(intervalTimer.current);
        // let total = res;

        let count = 0;
        const marginVal = total > 0 ? 1 : -1;

        intervalTimer.current = window.setInterval(() => {
            count += marginVal;

            if (Math.abs(sub(total, count)) < 2) {
                changeTranslateY(sub(total, count));
                intervalTimer.current && window.clearInterval(intervalTimer.current);
                intervalTimer.current = null;
            } else {
                changeTranslateY(marginVal);
            }
        });
    };

    /**
     * 找到小于视口的bottom值
     * 且bottom值最相近的一个节点
     */

    const findTopNode = () => {
        console.log("findTopNode");
        const nodes = srcollerWrapRef.current?.getElementsByClassName("picker_item");
        const bottom = viewElement.current?.getBoundingClientRect().bottom;

        if (nodes === undefined || bottom === undefined) {
            return;
        }

        let nodeBottomValue: number | null = null;

        for (let i = 0; i < nodes.length; i++) {
            const nodeBottom = nodes[i].getBoundingClientRect().bottom;
            if (nodeBottom < bottom) {
                if (typeof nodeBottomValue === "number") {
                    nodeBottomValue = nodeBottomValue > nodeBottom ? nodeBottomValue : nodeBottom;
                } else {
                    nodeBottomValue = nodeBottom;
                }
            }
        }
        intervalTimer.current && window.clearInterval(intervalTimer.current);
        if (nodeBottomValue === null) {
            nodeBottomValue = nodes[0].getBoundingClientRect().bottom;
        }
        console.log("没有速度", "向下移动");
        toMoveInterval(sub(bottom, nodeBottomValue));
    };

    /**
     * 找到小于视口的top值
     * 且top值最相近的一个节点
     */
    const findUnderNode = () => {
        console.log("findUnderNode");
        const nodes = srcollerWrapRef.current?.getElementsByClassName("picker_item");
        const top = viewElement.current?.getBoundingClientRect().top;

        let nodeTopValue: number | null = null;
        if (top === undefined || nodes === undefined) {
            return;
        }

        for (let i = 0; i < nodes.length; i++) {
            const nodeTop = nodes[i].getBoundingClientRect().top;

            if (nodeTop > top) {
                if (typeof nodeTopValue === "number") {
                    nodeTopValue = nodeTopValue < nodeTop ? nodeTopValue : nodeTop;
                } else {
                    nodeTopValue = nodeTop;
                }
            }
        }
        intervalTimer.current && window.clearInterval(intervalTimer.current);

        if (nodeTopValue === null) {
            nodeTopValue = nodes[nodes.length - 1].getBoundingClientRect().top;
        }
        console.log("没有速度", "向上移动");
        toMoveInterval(sub(top, nodeTopValue));
    };

    /**
     * 找一个自身一半的内容在视口的节点
     */
    const findSelectNode = () => {
        const nodes = srcollerWrapRef.current?.getElementsByClassName("picker_item");
        const rect = viewElement.current?.getBoundingClientRect();
        if (nodes === undefined || rect === undefined) {
            return;
        }

        for (let i = 0; i < nodes.length; ) {
            const node = nodes[i];

            const nodeRect = node.getBoundingClientRect();

            if (nodeRect.top === rect.top) {
                /**
                 * 刚好停在了合适的位置
                 */
                i = nodes.length;
            } else if (nodeRect.top > rect.top && nodeRect.top < rect.bottom) {
                /**
                 * 当前节点与视口发生了交集
                 */
                if (sub(rect.bottom, nodeRect.top) >= toDiv(nodeRect.height, 2)) {
                    /**
                     * 当前节点的一半以上的身体在视口内
                     */
                    i = nodes.length;
                    //需要移动的距离 向上移动
                    console.log("移动较小", "向上移动");
                    toMoveInterval(sub(rect.top, nodeRect.top));
                } else {
                    ++i;
                }
            } else if (nodeRect.bottom > rect.top && nodeRect.bottom < rect.bottom) {
                /**
                 * 当前节点与视口发生了交集
                 */

                if (sub(nodeRect.bottom, rect.top) >= toDiv(nodeRect.height, 2)) {
                    /**
                     * 当前节点的一半以上的身体在视口内
                     */
                    i = nodes.length;
                    //需要移动的距离  向下移动
                    toMoveInterval(sub(rect.bottom, nodeRect.bottom));
                } else {
                    ++i;
                }
            } else {
                ++i;
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
        let startTime = Date.now();
        console.log(" ");
        console.log("开始速度", lastTouchSpeed.current);
        const currentSpeed = lastTouchSpeed.current;
        if (directionRef.current === undefined || Math.abs(currentSpeed) <= 0.5) {
            findSelectNode();
            return;
        }

        const el = srcollerWrapRef.current;
        if (!el) {
            return;
        }
        const scrollEl = el.getElementsByClassName("picker_scroller")[0] as HTMLElement;
        if (!scrollEl) {
            return;
        }
        const viewHeight =
            scrollEl.offsetHeight + (el.offsetHeight - itemSizeData.current.totalHeight * 2);
        console.log(viewHeight, "viewHeight");

        intervalTimer.current = window.setInterval(() => {
            const currentTime = Date.now();

            const offsetTime = sub(currentTime, startTime);
            startTime = currentTime;

            /**
             * 速度递减
             */
            /**
             *
             * 加个限制
             * 当滚动的距离超过了滚动容器
             * 则  不再进行滚动
             *
             */

            // if (scrollEl.scrollHeight - scrollEl.offsetHeight) {

            // }
            if (lastTouchSpeed.current > 0.4) {
                lastTouchSpeed.current = sub(lastTouchSpeed.current, 0.02);
                const moveVal = mul(offsetTime, lastTouchSpeed.current);
                changeTranslateY(moveVal);
                return;
            } else if (lastTouchSpeed.current < -0.4) {
                lastTouchSpeed.current = sum(lastTouchSpeed.current, 0.02);
                const moveVal = mul(offsetTime, lastTouchSpeed.current);
                changeTranslateY(moveVal);
                return;
            }

            /**
             * 当速度在小于0.1的时候
             * 要找到合适的位置停
             */
            /**
             * 速度为负数的时候
             * 要
             */
            console.log(lastTouchSpeed.current);
            intervalTimer.current && window.clearInterval(intervalTimer.current);
            if (directionRef.current === "toBottom") {
                findTopNode();
                return;
            }
            findUnderNode();
        });
    };
    /**
     * 触摸取消
     *
     * 不触发自动滚动
     */
    const handleTouchCancel = (e: React.TouchEvent<HTMLDivElement>) => {};

    const renderItems = () => {
        return options.map((option, index) => {
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
                        picker_item_selected: option === value,
                    })}
                    onClick={() => handleItemClick(option)}
                >
                    <div className="picker_itemContent">
                        <span className="picker_itemData">{option}</span>
                        <span className="picker_itemUnit">{unit[name]}</span>
                    </div>
                </div>
            );
        });
    };
    /* <------------------------------------ **** FUNCTION END **** ------------------------------------ */
    // const translateString = `translateT(${scrollerTranslate}px)`;
    return (
        <div
            className={"picker_column"}
            ref={srcollerWrapRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchCancel}
        >
            <div
                className={"picker_scroller"}
                style={{ transform: `translateY(${translateY}px)` }}
                onTransitionEnd={() => {
                    if (transitionType.current) handleScrollerTransition(transitionType.current);
                    transitionType.current = null;
                }}
            >
                {renderItems()}
            </div>
        </div>
    );
};
/* <------------------------------------ **** FUNCTION COMPONENT END **** ------------------------------------ */
