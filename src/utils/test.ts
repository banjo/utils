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
 * Attempt to run a synchronous function, and return a fallback value if it throws an error.
 * Defaults to undefined if nothing is provided.
 *
 * @param fn - The synchronous function to run.
 * @param options - Options for controlling error logging, callbacks, and fallback value.
 * @returns The result of the function, or the fallback value if the function throws an error.
 *
 * @example
 * const result = attempt(() => 1); // 1
 * const result = attempt(() => { throw new Error("test"); }); // undefined
 * const result = attempt(() => { throw new Error("test"); }, { fallbackValue: 1 }); // 1
 */
export function attempt<T, F = undefined>(
    fn: () => T,
    options?: AttemptOptions<F>
): T | FallbackType<F>;

/**
 * Attempt to run an asynchronous function, and return a fallback value if it throws an error.
 * Defaults to undefined if nothing is provided.
 *
 * @param asyncFn - The asynchronous function to run.
 * @param options - Options for controlling error logging, callbacks, and fallback value.
 * @returns A Promise resolving to either the result of the function, or the fallback value if the function throws an error.
 *
 * @example
 * const result = await attempt(async () => 1); // 1
 * const result = await attempt(async () => { throw new Error("test"); }); // undefined
 * const result = await attempt(async () => { throw new Error("test"); }, { fallbackValue: 1 }); // 1
 */
export function attempt<T, F = undefined>(
    asyncFn: () => Promise<T>,
    options?: AttemptOptions<F>
): Promise<T | FallbackType<F>>;

export function attempt<T, F = undefined>(
    fn: (() => T) | (() => Promise<T>),
    options?: AttemptOptions<F>
): (T | FallbackType<F>) | Promise<T | FallbackType<F>> {
    const { fallbackValue, logError, onError, onFinally } = defaults(options, defaultOptions);

    let resultOrValue: T | Promise<T>;
    try {
        resultOrValue = fn();
    } catch (e) {
        if (onError) onError(e);
        if (logError) console.error(e);
        if (onFinally) onFinally();
        return fallbackValue as FallbackType<F>;
    }

    if (isThenable<T>(resultOrValue)) {
        return resultOrValue
            .catch(err => {
                if (onError) onError(err);
                if (logError) console.error(err);
                return fallbackValue as FallbackType<F>;
            })
            .finally(() => {
                if (onFinally) onFinally();
            });
    } else {
        if (onFinally) onFinally();
        return resultOrValue;
    }
}

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
