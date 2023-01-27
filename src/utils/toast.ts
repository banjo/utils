import { isBrowser } from "./is";

/**
 * Toast utility to easily show a toast message in a browser
 */

type Type = "success" | "error" | "warning";
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

    /**
     * The font size to use. Defaults to 1.2rem.
     * @default 1.2rem
     */
    fontSize?: string;

    /**
     * The width to use. Defaults to 'fit-content'.
     * @default 'fit-content'
     */
    width?: string;

    /**
     * Whether to show the icon. Defaults to true.
     * @default true
     */
    useIcon?: boolean;
};

const defaultOptions: Options = {
    time: 5000,
    type: "success",
    timing: 300,
    fontSize: "1.2rem",
    width: "fit-content",
    useIcon: true,
};

type typeMap = Record<Type, string>;

const icones: typeMap = {
    success: `<svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 32 32"><path fill="currentColor" d="M16 2a14 14 0 1 0 14 14A14 14 0 0 0 16 2Zm-2 19.59l-5-5L10.59 15L14 18.41L21.41 11l1.596 1.586Z"/><path fill="none" d="m14 21.591l-5-5L10.591 15L14 18.409L21.41 11l1.595 1.585L14 21.591z"/></svg>`,
    error: `<svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 32 32"><path fill="currentColor" d="M16 2C8.2 2 2 8.2 2 16s6.2 14 14 14s14-6.2 14-14S23.8 2 16 2zm5.4 21L16 17.6L10.6 23L9 21.4l5.4-5.4L9 10.6L10.6 9l5.4 5.4L21.4 9l1.6 1.6l-5.4 5.4l5.4 5.4l-1.6 1.6z"/></svg>`,
    warning: `<svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 32 32"><path fill="currentColor" d="M16 2C8.3 2 2 8.3 2 16s6.3 14 14 14s14-6.3 14-14S23.7 2 16 2zm-1.1 6h2.2v11h-2.2V8zM16 25c-.8 0-1.5-.7-1.5-1.5S15.2 22 16 22s1.5.7 1.5 1.5S16.8 25 16 25z"/></svg>`,
};

const backgroundColor: typeMap = {
    success: "#bbf7d0",
    error: "#fecdd3",
    warning: "#fff3cd",
};

const color: typeMap = {
    success: "#0f5132",
    error: "#842029",
    warning: "#664d03",
};

/**
 * Show a toast message. If a toast is already showing, it will be removed and replaced with the new one.
 * @param message - The message to show.
 * @param options - The options to use.
 * @returns - An object with a remove method to remove the toast.
 * @example
 * toast("Hello world");
 * toast("Hello world", { time: 10000, type: "error", timing: 500, fontSize: "1.5rem" });
 *
 * const { remove } = toast("Hello world");
 * remove();
 */
export const toast = (message: string, options?: Options) => {
    if (!isBrowser()) throw new Error("toast can only be used in a browser");

    const { time, type, timing, fontSize, width, useIcon } = {
        ...defaultOptions,
        ...options,
    };

    const container = document.createElement("div");
    container.classList.add("banjo-toast-container");
    container.style.cssText = `
        position: fixed; 
        bottom: 0; 
        right: 0; 
        left: 0;
        top: 0;
        overflow: hidden;`;

    const toast = document.createElement("div");
    toast.classList.add("banjo-toast");
    toast.style.cssText = `
        transition: all ${timing}ms ease;
        font-size: ${fontSize};
        box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
        width: ${width};
        height: fit-content;
        transform: translateX(200%);
        position: absolute;
        bottom: 2rem;
        right: 2rem;
        padding: 1rem;
        border-radius: 0.5rem;
        display: flex;
        align-items: center;
        gap: 1rem;
        `;

    toast.style.backgroundColor = backgroundColor[type!];
    toast.style.color = color[type!];

    if (useIcon) {
        const icon = document.createElement("i");
        icon.classList.add("banjo-toast-icon");
        icon.innerHTML = icones[type!];
        toast.appendChild(icon);
    }

    toast.appendChild(document.createTextNode(message));

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
