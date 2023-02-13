import { createContext, useContext } from "react";

interface PopupContextProps {
    show: boolean;
    transitionStatus: "end" | "cancel" | false;
}

export const PopupContext = createContext<PopupContextProps>({
    show: true,
    transitionStatus: "end",
});

export const usePopupContext = (): PopupContextProps => useContext(PopupContext);
