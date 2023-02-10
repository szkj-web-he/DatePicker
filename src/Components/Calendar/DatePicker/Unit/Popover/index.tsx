/**
 * @file
 * @date 2023-02-09
 * @author xuejie.he
 * @lastModify xuejie.he 2023-02-09
 */
/* <------------------------------------ **** DEPENDENCE IMPORT START **** ------------------------------------ */
/** This section will include all the necessary dependence for this tsx file */
import React from "react";
import { Dropdown } from "../../../../Common/Dropdown";
import { DropdownBtn } from "../../../../Common/DropdownBtn";
import { DropdownContent } from "../../../../Common/DropdownContent";
import "./style.scss";
/* <------------------------------------ **** DEPENDENCE IMPORT END **** ------------------------------------ */
/* <------------------------------------ **** INTERFACE START **** ------------------------------------ */
/** This section will include all the interface for this tsx file */
interface TempProps {
    /**
     * btn的className
     */
    className: string;
    /**
     * icon的className
     */
    children: React.ReactNode;
    /**
     *
     */
    onClick: () => void;

    /**
     *
     */
    title: string;
    /**
     *
     */
    disabled?: boolean;
}
/* <------------------------------------ **** INTERFACE END **** ------------------------------------ */
/* <------------------------------------ **** FUNCTION COMPONENT START **** ------------------------------------ */
const Temp: React.FC<TempProps> = ({ className, children, onClick, title, disabled }) => {
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
        <Dropdown
            trigger={"hover"}
            placement="ct"
            direction="vertical"
            triangle={{ width: "1rem", height: "0.5rem", color: "rgba(0,0,0,0.7)" }}
            animate="fade"
            disable={disabled}
        >
            <DropdownBtn className={className} onClick={onClick}>
                {children}
            </DropdownBtn>
            <DropdownContent bodyClassName="popover_body">{title}</DropdownContent>
        </Dropdown>
    );
};
/* <------------------------------------ **** FUNCTION COMPONENT END **** ------------------------------------ */
export default Temp;
