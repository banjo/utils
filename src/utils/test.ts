/**
 * Simple utility function for tests
 */

import { DeepPartial, defaults, merge } from "./object";
import { Maybe } from "./types";

type TryOrDefaultOptions = {
    /**
     * If true, will log the error to the console.
     */
    logError?: boolean;
    /**
     * The fallback value to return if the function throws an error.
     */
    fallbackValue?: any;
};

const defaultOptions: TryOrDefaultOptions = {
    logError: false,
    fallbackValue: undefined,
};

/**
 * Try to run a function, and return a fallback value if it throws an error. Defaults to undefined if nothing is provided.
 * @param fn - The function to run.
 * @param options - The options to use.
 * @returns - The result of the function, or the fallback value if the function throws an error.
 * @example
 * tryOrDefault(() => 1); // 1
 * tryOrDefault(() => { throw new Error("test"); }); // undefined
 *
 * tryOrDefault(() => { throw new Error("test"); }, { fallbackValue: 1 }); // 1
 * tryOrDefault(() => { throw new Error("test"); }, { fallbackValue: 1, logError: true }); // 1, logs error to console
 */
export const tryOrDefault = <T>(fn: () => T, options?: TryOrDefaultOptions): Maybe<T> => {
    const { fallbackValue, logError } = defaults(options, defaultOptions);
    try {
        return fn();
    } catch (e) {
        if (logError) {
            console.error(e);
        }
        return fallbackValue;
    }
};

/**
 * Try to run an async function, and return a fallback value if it throws an error. Defaults to undefined if nothing is provided.
 * @param fn - The async function to run.
 * @param options - The options to use.
 * @returns - The result of the function, or the fallback value if the function throws an error.
 * @example
 * await tryOrDefaultAsync(() => 1); // 1
 * await tryOrDefaultAsync(() => { throw new Error("test"); }); // undefined
 *
 * await tryOrDefaultAsync(() => { throw new Error("test"); }, { fallbackValue: 1 }); // 1
 * await tryOrDefaultAsync(() => { throw new Error("test"); }, { fallbackValue: 1, logError: true }); // 1, logs error to console
 */
export const tryOrDefaultAsync = async <T>(
    fn: () => Promise<T>,
    options?: TryOrDefaultOptions
): Promise<Maybe<T>> => {
    const { fallbackValue, logError } = defaults(options, defaultOptions);
    try {
        return await fn();
    } catch (e) {
        if (logError) {
            console.error(e);
        }
        return fallbackValue;
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
