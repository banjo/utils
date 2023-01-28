import { toast as t } from "toastler";

/**
 * Toast utility to easily show a toast message in a browser
 */

/**
 * Show a toast message. If a toast is already showing, it will be removed and replaced with the new one. Wrapper around "toastler".
 * @param message - The message to show.
 * @param options - The options to use.
 * @returns - An object with a remove method to remove the toast.
 * @example
 * toast("Hello world");
 * toast("Hello world", { duration: 10000, type: "error", animationTiming: 500, fontSize: "1.5rem" });
 *
 * const { hide } = toast("Hello world");
 * hide();
 */
export const toast = t;
