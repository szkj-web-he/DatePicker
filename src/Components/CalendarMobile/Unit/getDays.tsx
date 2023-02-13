import React from "react";

export interface NodeProps {
    id: string;
    content: React.ReactNode;
}

/**
 * 获取日列表
 */
export const getDays = (year: number, month: number): Array<NodeProps> => {
    const nodes: Array<NodeProps> = [];
    const days = new Date(Number(year), Number(month), 0).getDate();
    // console.log("year", year, "month", Number(month) - 1, "days", days);

    for (let i = 1; i <= days; i++) {
        nodes.push({
            id: i.toString(),
            content: (
                <>
                    <span className="calendarMobile_itemContent">{i}</span>
                    <span className="calendarMobile_itemUnit">日</span>
                </>
            ),
        });
    }
    return nodes;
};
