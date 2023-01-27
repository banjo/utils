import { isBrowser } from "./is";

/**
 * Toast utility to easily show a toast message in a browser
 */

type Type = "success" | "error";
type Options = {
    /**
     * The time to show the toast for in milliseconds. Defaults to 5000.
     * @default 5000
     */
    time?: number;

    /**
     * The type of toast. Either "success" or "error".
     * @default "success"
     */
    type?: Type;

    /**
     * The timing to use for the animation. Defaults to 300.
     * @default 300
     */
    timing?: number;
};

/**
 * Show a toast message. If a toast is already showing, it will be removed and replaced with the new one.
 * @param message - The message to show.
 * @param options - The options to use.
 * @returns - An object with a remove method to remove the toast.
 * @example
 * toast("Hello world");
 * toast("Hello world", { time: 10000, type: "error" });
 *
 * const { remove } = toast("Hello world");
 * remove();
 */
export const toast = (
    message: string,
    options: Options = {
        time: 5000,
        type: "success",
        timing: 300,
    }
) => {
    if (!isBrowser()) throw new Error("toast can only be used in a browser");

    const { time, type, timing } = options;

    const container = document.createElement("div");
    container.classList.add("banjo-toast-container");
    container.style.cssText = `
        position: fixed; 
        bottom: 0; 
        right: 0; 
        width: 300px; 
        height: 100px; 
        overflow: hidden;`;

    const toast = document.createElement("div");
    toast.classList.add("banjo-toast");
    toast.style.cssText = `
        width: fit-content;
        height: fit-content;
        transform: translateX(200%);
        transition: all ${timing}ms ease;
        position: absolute;
        bottom: 2rem;
        right: 2rem;
        padding: 1rem;
        border-radius: 0.5rem;
        `;

    toast.style.backgroundColor = type === "success" ? "#bbf7d0" : "#fecdd3";
    toast.style.color = type === "success" ? "#0f5132" : "#842029";
    toast.textContent = message;

    container.appendChild(toast);
    document.body.appendChild(container);

    const show = () => {
        toast.style.transform = "translateX(0%)";
    };

    const remove = () => {
        toast.style.transform = "translateX(200%)";
        setTimeout(() => {
            container.remove();
            // @ts-ignore
            window.banjoToast = null;
        }, timing);
    };

    // @ts-ignore
    if (window.banjoToast) window.banjoToast.remove();

    // @ts-ignore
    window.banjoToast = { remove };
    setTimeout(show, timing);
    setTimeout(remove, time);

    return { remove };
};
