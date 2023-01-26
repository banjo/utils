import { debounce as d, throttle as t } from "throttle-debounce";

/**
 * Utilities for working with functions.
 */

type DebounceSettings = {
    /**
     * If true, the debounced function will be invoked at the beginning of the wait timeout.
     * @example
     * const debounced = debounce(() => console.log('hello world'), 1000, { atBeginning: true });
     * debounced(); // logs 'hello world' immediately
     * debounced(); // logs 'hello world' after 1000ms
     * debounced(); // does nothing if called within 1000ms of the previous call
     */
    atBeginning: boolean;
};

type Debounce = <T extends (...args: any[]) => any>(
    callback: T,
    wait: number,
    options?: DebounceSettings
) => d<T>;

/**
 * Created a debounced version of the provided function. The function is a wrapper around the "throttle-debounce" library.
 * @param callback - The function to create a debounced version of.
 * @param wait - The number of milliseconds to wait before invoking the function.
 * @param options - Options for the debounced function. See the "throttle-debounce" library for more information.
 * @returns The debounced function.
 * @example
 * const debounced = debounce(() => console.log('hello world'), 1000);
 * debounced(); // logs 'hello world' after 1000ms
 * debounced(); // does nothing if called within 1000ms of the previous call
 */
export const debounce: Debounce = (callback, wait, options) => {
    return d(wait, callback, options as any);
};

type ThrottleSettings = {
    /**
     * If true, the throttled function will be invoked on the leading edge of the wait timeout, meaning directly.
     * @example
     * const throttled = throttle(() => console.log('hello world'), 1000, { leading: true });
     * throttled(); // logs 'hello world' immediately
     * throttled(); // does nothing if called within 1000ms of the previous call
     * throttled(); // logs 'hello world' after 1000ms
     */
    leading?: boolean;
};

type Throttle = <T extends (...args: any) => any>(
    callback: T,
    wait: number,
    options?: ThrottleSettings | undefined
) => t<T>;

/**
 * Created a throttled version of the provided function. The function is a wrapper around the "throttle-debounce" library.
 * @param callback - The function to create a throttled version of.
 * @param wait - The number of milliseconds to wait before invoking the function.
 * @returns The throttled function.
 * @example
 * // invokes the function not more than once per second
 * const throttled = throttle(() => console.log('hello world'), 1000);
 * element.addEventListener('mousemove', throttled);
 *
 * // cancel the throttled function
 * throttled.cancel();
 */
export const throttle: Throttle = (callback, wait, options) => {
    return t(wait, callback, options as any);
};
