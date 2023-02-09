/**
 * @file abc
 * @date 2021-12-16
 * @author xuejie.he
 * @lastModify mingzhou.zhang 2022-4-25
 */

import { createContext, useContext } from "react";

interface DateContextProps {
    focus: boolean;
    setFocus: (status: boolean) => void;
    time: Date | null;
    setTime: (res: Date | null) => void;
    disabled: boolean;
}

const DateContextData = () => ({
    focus: false,
    setFocus: () => undefined,
    time: null,
    setTime: () => undefined,
    disabled: false,
});

export const DateContext = createContext<DateContextProps>(DateContextData());

export const useDateContext = (): DateContextProps => useContext(DateContext);
