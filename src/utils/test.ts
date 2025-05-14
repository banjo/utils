/**
 * Simple utility function for tests
 */

import deepmerge from "deepmerge";
import { DeepPartial, defaults } from "./object";

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
 * Try to run a sync function, and return a fallback value if it throws an error. Defaults to undefined if nothing is provided.
 * @param fn - The function to run.
 * @param options - The options to use.
 * @returns - The result of the function, or the fallback value if the function throws an error.
 * @example
 * attemptSync(() => 1); // 1
 * attemptSync(() => { throw new Error("test"); }); // undefined
 *
 * attemptSync(() => { throw new Error("test"); }, { fallbackValue: 1 }); // 1
 * attemptSync(() => { throw new Error("test"); }, { fallbackValue: 1, logError: true }); // 1, logs error to console
 * attemptSync(() => { throw new Error("test"); }, { fallbackValue: 1, onError: (e) => console.error(e) }); // 1, logs error to console
 */
export const attemptSync = <T, F = undefined>(
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
 * await attempt(async () => 1); // 1
 * await attempt(async () => { throw new Error("test"); }); // undefined
 *
 * await attempt(async () => { throw new Error("test"); }, { fallbackValue: 1 }); // 1
 * await attempt(async () => { throw new Error("test"); }, { fallbackValue: 1, logError: true }); // 1, logs error to console
 * await attempt(async () => { throw new Error("test"); }, { fallbackValue: 1, onError: (e) => console.error(e) }); // 1, logs error to console
 */
export const attempt = async <T, F = undefined>(
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
 * Try to run an async function, and return a fallback value if it throws an error. Defaults to undefined if nothing is provided.
 * @deprecated Use `attempt` instead.
 */
export const attemptAsync = async <T, F = undefined>(
    asyncFn: () => Promise<T>,
    options?: AttemptOptions<F>
): Promise<T | FallbackType<F>> => {
    return attempt(asyncFn, options);
};

type Out<T> = [Error, undefined] | [undefined, T];

function isThenable<T>(value: any): value is Promise<T> {
    return value && typeof value.then === "function";
}

/**
 * Attempt to run an async function like in Go, returning a tuple with the error and the result.
 * @param asyncFn The async function to execute.
 * @returns A tuple with an error and a value. E.g. [error, value]
 * @example
 *
 * const [error, result] = await to(async () => 1); // [undefined, 1]
 * const [error, result] = await to(async () => { throw new Error("test"); }); // [Error("test"), undefined]
 */
export function to<T>(fn: () => Promise<T>): Promise<Out<T>>;
/**
 * Attempt to run an sync function like in Go, returning a tuple with the error and the result.
 * @param fn - The function to execute.
 * @returns A tuple with an error and a value. E.g. [error, value]
 * @example
 *
 * const [error, result] = to(() => 1); // [undefined, 1]
 * const [error, result] = to(() => { throw new Error("test"); }); // [Error("test"), undefined]
 */
export function to<T>(fn: () => T): Out<T>;
export function to<T>(fn: () => T | Promise<T>): Out<T> | Promise<Out<T>> {
    try {
        const resultOrPromise = fn();

        if (isThenable<T>(resultOrPromise)) {
            return resultOrPromise
                .then(value => [undefined, value] as Out<T>) // Successfully resolved
                .catch(
                    err =>
                        [err instanceof Error ? err : new Error(String(err)), undefined] as Out<T>
                );
        } else {
            return [undefined, resultOrPromise as T];
        }
    } catch (e) {
        return [e instanceof Error ? e : new Error(String(e)), undefined];
    }
}

type WrapOut<T> = [T, undefined] | [undefined, Error];

/**
 * Attempt to run a function like in Go, returning an array with the result and the error.
 * @deprecated Use `toSync` instead, as it has better defaults.
 * @example
 * const [result, error] = wrap(() => 1); // [1, undefined]
 * const [result, error] = wrap(() => { throw new Error("test"); }); // [undefined, Error("test")]
 */
export const wrap = <T>(fn: () => T): WrapOut<T> => {
    try {
        const result = fn();
        return [result, undefined];
    } catch (e) {
        return [undefined, e instanceof Error ? e : new Error(String(e))];
    }
};

/**
 * Attempt to run an async function like in Go, returning an array with the result and the error.
 * @deprecated Use `to` instead, as it has better defaults.
 * @example
 * const [result, error] = await wrapAsync(async () => Promise.resolve(1)); // [1, undefined]
 * const [result, error] = await wrapAsync(async () => Promise.reject(new Error("test"))); // [undefined, Error("test")]
 */
export const wrapAsync = async <T>(asyncFn: () => Promise<T>): Promise<WrapOut<T>> => {
    try {
        const result = await asyncFn();
        return [result, undefined];
    } catch (e) {
        return [undefined, e instanceof Error ? e : new Error(String(e))];
    }
};

const overwriteMerge = (destinationArray: unknown[], sourceArray: unknown[]) => sourceArray;
/**
 * Create a new create mock function to update the base mock with the partial mock. Will overwrite arrays instead of merging them.
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
    <T extends object>(baseMock: T) =>
    (partialMock: DeepPartial<T> = {}): T => {
        return deepmerge(baseMock, partialMock as any, { arrayMerge: overwriteMerge }) as T;
    };
