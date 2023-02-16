/**
 * @file 选择日期的主体
 * @date 2023-02-09
 * @author xuejie.he
 * @lastModify xuejie.he 2023-02-09
 */
/* <------------------------------------ **** DEPENDENCE IMPORT START **** ------------------------------------ */
/** This section will include all the necessary dependence for this tsx file */
import React, { useEffect, useState } from "react";
import { CalendarInput } from "./Components/Calendar/CalendarInput";
import { DatePicker } from "./Components/Calendar/DatePicker";
import { CalendarMobile } from "./Components/CalendarMobile";
import { useMobile } from "./Components/Scroll/Unit/useMobile";
import { comms } from "./index";
/* <------------------------------------ **** DEPENDENCE IMPORT END **** ------------------------------------ */
/* <------------------------------------ **** INTERFACE START **** ------------------------------------ */
/** This section will include all the interface for this tsx file */

/* <------------------------------------ **** INTERFACE END **** ------------------------------------ */
/* <------------------------------------ **** FUNCTION COMPONENT START **** ------------------------------------ */
const Temp: React.FC = () => {
    /* <------------------------------------ **** STATE START **** ------------------------------------ */
    /************* This section will include this component HOOK function *************/

    const isMobile = useMobile();

    const [date, setDate] = useState<Date>();

    /* <------------------------------------ **** STATE END **** ------------------------------------ */
    /* <------------------------------------ **** PARAMETER START **** ------------------------------------ */
    /************* This section will include this component parameter *************/

    useEffect(() => {
        comms.state = {
            [comms.config?.options?.[0].code ?? "year"]: date?.getFullYear(),
            [comms.config?.options?.[1].code ?? "month"]: date?.getFullYear(),
            [comms.config?.options?.[2].code ?? "day"]: date?.getFullYear(),
            [comms.config?.options?.[3].code ?? "week"]: date?.getFullYear(),
        };
    }, [date]);

    /* <------------------------------------ **** PARAMETER END **** ------------------------------------ */
    /* <------------------------------------ **** FUNCTION START **** ------------------------------------ */
    /************* This section will include this component general function *************/
    /* <------------------------------------ **** FUNCTION END **** ------------------------------------ */

    if (isMobile) {
        return (
            <CalendarMobile
                className="mobileDatePicker_iptWrapper"
                value={date}
                onChange={(date) => {
                    setDate(date);
                }}
            />
        );
    }
    return (
        <DatePicker
            handleTimeChange={(date) => {
                setDate(date ?? undefined);
            }}
            value={date}
        >
            <CalendarInput placeholder={"请选择日期"} className={"datePicker_iptWrapper"} />
        </DatePicker>
    );
};
/* <------------------------------------ **** FUNCTION COMPONENT END **** ------------------------------------ */
export default Temp;
