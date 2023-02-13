export interface ItemRectData {
    /**
     * 当translateY为多少的时候是这个item
     */
    translateY: number;
    /**
     * 有多高
     */
    height: number;
    /**
     * 这个item的id
     */
    id: string;
}

/**
 * 获取所有item的translateY的值
 * @param {number} translateY  当前的偏移值
 * @param el
 * @param viewEl
 * @returns
 */
export const getItemsTranslateY = (
    translateY: number,
    optionsId: string[],
    el: HTMLDivElement | null,
    viewEl: HTMLDivElement | null,
): undefined | ItemRectData[] => {
    if (!el || !viewEl) {
        return;
    }

    /**
     * 视口的 rect;
     */
    const viewRect = viewEl.getBoundingClientRect();

    /**
     * 所有的Item
     */
    const items = el.getElementsByClassName("picker_item");

    /**
     *
     */
    const arr: Array<ItemRectData> = [];

    for (let i = 0; i < items.length; i++) {
        const item = items[i] as HTMLDivElement;
        const itemRect = item.getBoundingClientRect();

        const y = viewRect.top - itemRect.top + translateY;

        arr.push({
            translateY: y,
            height: item.offsetHeight,
            id: optionsId[i],
        });
    }

    return arr;
};
