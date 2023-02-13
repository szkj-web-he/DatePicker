import React from "react";
import { NodeProps } from "./getDays";
/**
 * 获取年列表
 */

export const getYearList = (end: number, start = 1970): Array<NodeProps> => {
    const nodes: Array<NodeProps> = [];

    for (let i = start; i <= end; i++) {
        nodes.push({
            id: i.toString(),
            content: (
                <>
                    <span className="calendarMobile_itemContent">{i}</span>
                    <span className="calendarMobile_itemUnit">年</span>
                </>
            ),
        });
    }
    return nodes;
};
