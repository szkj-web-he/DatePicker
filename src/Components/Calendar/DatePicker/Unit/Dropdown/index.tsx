/**
 * @file
 * @date 2021-12-15
 * @author xuejie.he
 * @lastModify xuejie.he 2021-12-15
 */
/* <------------------------------------ **** DEPENDENCE IMPORT START **** ------------------------------------ */
/** This section will include all the necessary dependence for this tsx file */
import React, { useRef, useState } from "react";
import { Transition } from "../../../../Common/Transition";
import { Icon } from "../../../../Icon";
import { ScrollComponent } from "../../../../Scroll";
// import { Icon, ScrollComponent, Transition } from "../../../../..";
import "./style.scss";
/* <------------------------------------ **** DEPENDENCE IMPORT END **** ------------------------------------ */
/* <------------------------------------ **** INTERFACE START **** ------------------------------------ */
/** This section will include all the interface for this tsx file */
interface TemplateProps {
    labels: { id: string | number; content: string }[];
    handleScroll?: (res: {
        left: number;
        top: number;
        scrollHeight: number;
        scrollWidth: number;
        offsetHeight: number;
        offsetWidth: number;
        clientHeight: number;
        clientWidth: number;
    }) => void;
    value?: string | number;
    className?: string;
    style?: React.CSSProperties;
    handleFocus?: () => void;
    handleBlur?: () => void;
    handleChange?: (res: { id: string | number; content: string }) => void;
    readonly?: boolean;
}
/* <------------------------------------ **** INTERFACE END **** ------------------------------------ */
/* <------------------------------------ **** FUNCTION COMPONENT START **** ------------------------------------ */
const Template: React.FC<TemplateProps> = ({
    labels,
    handleScroll,
    value,
    className,
    style,
    handleFocus,
    handleBlur,
    handleChange,
    readonly,
}) => {
    /* <------------------------------------ **** STATE START **** ------------------------------------ */
    /************* This section will include this component HOOK function *************/

    const [show, setShow] = useState(false);

    const commData = useRef<{
        oldFocus?: boolean;
    }>({
        oldFocus: undefined,
    });

    const ref = useRef<HTMLDivElement | null>(null);

    /* <------------------------------------ **** STATE END **** ------------------------------------ */
    /* <------------------------------------ **** PARAMETER START **** ------------------------------------ */
    /************* This section will include this component parameter *************/
    // useEffect(() => {
    //     const node = ref.current;
    //     if (show && node && value) {
    //         const selectedEl = node.querySelector(`[data-id='${value}']`) as HTMLElement;
    //         const scrollBody = node.querySelector('[class*="scroll_scrollBody"]') as HTMLElement;

    //         if (selectedEl && scrollBody) {
    //             scrollBody.scrollTo({
    //                 top: selectedEl.offsetTop - scrollBody.clientHeight / 2,
    //             });
    //         }
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [show]);

    /* <------------------------------------ **** PARAMETER END **** ------------------------------------ */
    /* <------------------------------------ **** FUNCTION START **** ------------------------------------ */
    /************* This section will include this component general function *************/
    /**
     * 当动画过渡结束后
     */
    const handleTransitionEnd = () => {
        if (show) {
            const node = ref.current;
            if (node) {
                const selectedEl = value
                    ? (node.querySelector(`[data-id='${value}']`) as HTMLElement)
                    : undefined;
                const scrollBody = node.querySelector('[class="scroll_scrollBody"]') as HTMLElement;

                if (selectedEl && scrollBody) {
                    scrollBody.scrollTo({
                        top: selectedEl.offsetTop - scrollBody.clientHeight / 2,
                        behavior: "smooth",
                    });
                }
            }
        }
    };

    const handleIptClick = () => {
        if (commData.current.oldFocus && ref.current) {
            ref.current.blur();
        } else {
            commData.current.oldFocus = show;
        }
    };

    const handleFocusFn = () => {
        handleFocus?.();
        commData.current.oldFocus = show;
        setShow(true);
    };

    const handleBlurFn = () => {
        handleBlur?.();
        commData.current.oldFocus = show;
        setShow(false);
    };

    const getClassNameList = () => {
        const arr = ["datePicker_dropdownWrapper"];
        readonly && arr.push("datePicker_readonly");
        return arr.join(" ") + (className ? ` ${className}` : "");
    };

    const contentValue = labels.find((item) => item.id === value)?.content;

    /* <------------------------------------ **** FUNCTION END **** ------------------------------------ */
    return (
        <div
            className={getClassNameList()}
            ref={ref}
            style={style}
            onFocus={handleFocusFn}
            onBlur={handleBlurFn}
            tabIndex={-1}
        >
            <div className={"datePicker_dropdownIpt"} onClick={handleIptClick}>
                <div className={"datePicker_dropdownIptContent"}>{contentValue}</div>
                <Icon type="dropdown" className={"datePicker_dropdownIcon"} />
            </div>
            <Transition
                show={show}
                animationType="slideDown"
                className={"datePicker_dropdownListContainer"}
                handleTransitionEnd={handleTransitionEnd}
            >
                <ScrollComponent
                    className={"datePicker_dropdownList"}
                    handleBarChange={handleScroll}
                >
                    {labels.map((item, n) => {
                        const arr = ["datePicker_dropdownItem"];
                        if (value && item.id.toString() === value.toString()) {
                            arr.push("datePicker_dropdownItem__active");
                        }

                        return (
                            <div
                                className={arr.join(" ")}
                                key={`dropdownItem${item.id}${n}`}
                                onClick={() => {
                                    handleChange?.(item);
                                    ref.current?.blur();
                                }}
                                data-id={item.id}
                            >
                                {item.content}
                            </div>
                        );
                    })}
                </ScrollComponent>
            </Transition>
        </div>
    );
};

/* <------------------------------------ **** FUNCTION COMPONENT END **** ------------------------------------ */
export default Template;
