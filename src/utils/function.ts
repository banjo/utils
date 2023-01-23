import { debounce as d, throttle as t, DebouncedFunc } from "lodash-es";

type DebounceSettings = {
    /**
     * If true, the debounced function will be invoked on the leading edge of the wait timeout, meaning directly.
     * @example
     * const debounced = debounce(() => console.log('hello world'), 1000, { leading: true });
     * debounced(); // logs 'hello world' immediately
     * debounced(); // logs 'hello world' after 1000ms
     * debounced(); // does nothing if called within 1000ms of the previous call
     */
    leading?: boolean;
    /**
     * The maximum time in milliseconds that the debounced function will be delayed before being invoked.
     */
    maxWait?: number;
};

type Debounce = <T extends (...args: any[]) => any>(
    func: T,
    wait: number,
    options?: DebounceSettings
) => DebouncedFunc<T>;

/**
 * Created a debounced version of the provided function. The function is a wrapper around the "lodash" library.
 * @param func - The function to create a debounced version of.
 * @param wait - The number of milliseconds to wait before invoking the function.
 * @param options - The options to pass to the "lodash" debounce function. See the "lodash" library for more information.
 * @param options.leading - Whether to invoke the function on the leading edge of the wait interval.
 * @param options.maxWait - The maximum time the function is allowed to be delayed before it's invoked.
 * @returns The debounced function.
 * @example
 * const debounced = debounce(() => console.log('hello world'), 1000);
 * debounced(); // logs 'hello world' after 1000ms
 * debounced(); // does nothing if called within 1000ms of the previous call
 */
export const debounce: Debounce = d;

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
    func: T,
    wait?: number | undefined,
    options?: ThrottleSettings | undefined
) => DebouncedFunc<T>;

/**
 * Created a throttled version of the provided function. The function is a wrapper around the "lodash" library.
 * @param func - The function to create a throttled version of.
 * @param wait - The number of milliseconds to wait before invoking the function.
 * @param options - The options to pass to the "lodash" throttle function. See the "lodash" library for more information.
 * @returns The throttled function.
 * @example
 * // invokes the function not more than once per second
 * const throttled = throttle(() => console.log('hello world'), 1000);
 * element.addEventListener('mousemove', throttled);
 *
 * // cancel the throttled function
 * throttled.cancel();
 */
export const throttle: Throttle = t;
