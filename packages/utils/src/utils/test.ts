/**
 * Simple utility function for tests
 */

import { DeepPartial, defaults, merge } from "./object";

type AttemptOptions<F = unknown> = {
    /**
     * If true, will log the error to the console.
     */
    logError?: boolean;
    /**
     * On error callback
     */
    onError?: (error: unknown) => void;
    /**
     * On finally callback
     */
    onFinally?: () => void;
    /**
     * The fallback value to return if the function throws an error.
     */
    fallbackValue?: F;
};

const defaultOptions: AttemptOptions = {
    logError: false,
};

type FallbackType<F> = F extends undefined ? undefined : F;

/**
 * Try to run a function, and return a fallback value if it throws an error. Defaults to undefined if nothing is provided.
 * @param fn - The function to run.
 * @param options - The options to use.
 * @returns - The result of the function, or the fallback value if the function throws an error.
 * @example
 * attempt(() => 1); // 1
 * attempt(() => { throw new Error("test"); }); // undefined
 *
 * attempt(() => { throw new Error("test"); }, { fallbackValue: 1 }); // 1
 * attempt(() => { throw new Error("test"); }, { fallbackValue: 1, logError: true }); // 1, logs error to console
 * attempt(() => { throw new Error("test"); }, { fallbackValue: 1, onError: (e) => console.error(e) }); // 1, logs error to console
 */
export const attempt = <T, F = undefined>(
    fn: () => T,
    options?: AttemptOptions<F>
): T | FallbackType<F> => {
    // The default fallback value is kept as undefined if it is not provided.
    const { fallbackValue, logError, onError, onFinally } = defaults(options, defaultOptions);
    try {
        return fn();
    } catch (e) {
        if (onError) onError(e);
        if (logError) console.error(e);
        return fallbackValue as FallbackType<F>;
    } finally {
        if (onFinally) onFinally();
    }
};

/**
 * Try to run an async function, and return a fallback value if it throws an error. Defaults to undefined if nothing is provided.
 * @param asyncFn - The async function to run.
 * @param options - The options to use.
 * @returns - The result of the function, or the fallback value if the function throws an error.
 * @example
 * await attemptAsync(() => 1); // 1
 * await attemptAsync(() => { throw new Error("test"); }); // undefined
 *
 * await attemptAsync(() => { throw new Error("test"); }, { fallbackValue: 1 }); // 1
 * await attemptAsync(() => { throw new Error("test"); }, { fallbackValue: 1, logError: true }); // 1, logs error to console
 * await attemptAsync(() => { throw new Error("test"); }, { fallbackValue: 1, onError: (e) => console.error(e) }); // 1, logs error to console
 */
export const attemptAsync = async <T, F = undefined>(
    asyncFn: () => Promise<T>,
    options?: AttemptOptions<F>
): Promise<T | FallbackType<F>> => {
    const { fallbackValue, logError, onError, onFinally } = defaults(options, defaultOptions);
    try {
        return await asyncFn();
    } catch (e) {
        if (onError) onError(e);
        if (logError) console.error(e);
        return fallbackValue as FallbackType<F>;
    } finally {
        if (onFinally) onFinally();
    }
};

/**
 * Create a new create mock function to update the base mock with the partial mock.
 * @param baseMock - base object to use
 * @param partialMock - partial object to use
 * @returns The merged object.
 * @example
 * const numbersMock = { a: 1, b: 2, c: 3 };
 * const updatedData = { a: 2 };
 *
 * export const createNumbersMock = createMockCreator(numbersMock);
 *
 * createNumbersMock(updatedData); // => { a: 2, b: 2, c: 3 }
 */
export const createMockCreator =
    <T extends object>(baseMock: DeepPartial<T>) =>
    (partialMock: DeepPartial<T> = {}): T => {
        return merge(baseMock, partialMock) as T;
    };
