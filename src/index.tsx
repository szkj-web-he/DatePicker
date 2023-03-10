import React from "react";
import "./font.scss";
import "./style.scss";

import { ConfigYML, PluginComms } from "@datareachable/dr-plugin-sdk";
import Header from "./header";
import MainContent from "./main";
// import VConsole from "vconsole";

// new VConsole();

export const comms = new PluginComms({
    defaultConfig: new ConfigYML(),
}) as {
    config: {
        question?: string;
        instruction?: string;
        options?: Array<{ code: string; content: string }>;
        totalScore?: number;
        optionsInstruction?: string;
    };
    state: Record<string, string | undefined | number>;
    renderOnReady: (res: React.ReactNode) => void;
};

const Main: React.FC = () => {
    /* <------------------------------------ **** STATE START **** ------------------------------------ */
    /************* This section will include this component HOOK function *************/

    /* <------------------------------------ **** STATE END **** ------------------------------------ */
    /* <------------------------------------ **** PARAMETER START **** ------------------------------------ */
    /************* This section will include this component parameter *************/

    /* <------------------------------------ **** PARAMETER END **** ------------------------------------ */
    /* <------------------------------------ **** FUNCTION START **** ------------------------------------ */
    /************* This section will include this component general function *************/
    const yearCode = comms.config?.options?.[0].code;
    const monthCode = comms.config?.options?.[1].code;
    const dayCode = comms.config?.options?.[2].code;

    const year = yearCode ? Number(comms.state[yearCode]) : -1;
    const month = monthCode ? Number(comms.state[monthCode]) : -1;
    const day = dayCode ? Number(comms.state[dayCode]) : -1;

    const date = year > 0 && month > 0 && day > 0 ? new Date(year, month - 1, day) : undefined;

    /* <------------------------------------ **** FUNCTION END **** ------------------------------------ */
    return (
        <div className="wrapper">
            <Header />
            <MainContent date={date} />
        </div>
    );
};
/* <------------------------------------ **** FUNCTION COMPONENT END **** ------------------------------------ */
document.documentElement.style.fontSize = "10px";
void comms.renderOnReady(<Main />);
