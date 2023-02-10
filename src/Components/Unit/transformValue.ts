/**
 * 转换rem/em
 * @param value
 * @param node
 * @returns
 */
export const transformValue = (value: string, node?: HTMLElement) => {
    let val = Number(value.split(/[A-z]/)[0]);
    val = isNaN(val) ? 0 : val;
    const element = node;
    switch (true) {
        case value.includes("rem"): {
            // const html = document.getElementsByTagName("html");
            // const remVal = Number(window.getComputedStyle(html[0]).fontSize.slice(0, -2));
            return val * 10;
        }
        case value.includes("em"): {
            let emVal = 16;
            if (element && element.parentElement) {
                emVal = Number(
                    window.getComputedStyle(element.parentElement).fontSize.slice(0, -2),
                );
            }

            return val * emVal;
        }
        default:
            return val;
    }
};
