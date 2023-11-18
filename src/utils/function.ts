import { debounce as d, throttle as t } from "throttle-debounce";
import { Callback } from "./types";

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

/**
 * Invoke all functions in an array. Will not invoke any functions that are undefined.
 * @param array - The array of functions to invoke.
 * @example
 * batchInvoke([() => console.log('hello'), () => console.log('world')]); // logs 'hello' and 'world'
 * batchInvoke([() => console.log('hello'), undefined, () => console.log('world')]); // logs 'hello' and 'world'
 */
export const batchInvoke = <T extends () => void>(array: T[]): void => {
    array.forEach(fn => fn && fn());
};

/**
 * A no-op function. Useful for default values.
 * @returns undefined
 * @example
 * noop(); // does nothing
 *
 * const myFunction = (callback = noop) => {
 *    callback();
 * };
 *
 * myFunction(); // does nothing
 *
 * const func = noop;
 * func(); // does nothing
 */
export const noop = (): void => {};

/**
 * A no-op async function. Useful for default values.
 * @returns undefined
 * @example
 * noopAsync(); // does nothing
 *
 * const myFunction = async (callback = noopAsync) => {
 *   await callback();
 * };
 *
 * await myFunction(); // does nothing
 *
 */
export const noopAsync = async (): Promise<void> => {};

/**
 * Creates a function that memoizes the result of `fn`. If `fn` is called multiple times with the same arguments, the cached result for that set of arguments is returned.
 * @param fn - The function to memoize.
 * @returns The memoized function.
 * @example
 * const add = (a: number, b: number) => a + b;
 * const memoizedAdd = memoize(add);
 *
 * memoizedAdd(1, 2); // returns 3 and caches the result
 * memoizedAdd(1, 2); // returns 3 from the cache
 * memoizedAdd(1, 2); // returns 3 from the cache
 *
 * memoizedAdd(1, 3); // returns 4 and caches the result
 * memoizedAdd(1, 3); // returns 4 from the cache
 */
export const memoize = <T extends (...args: any[]) => any>(fn: T): T => {
    const cache = new Map();
    return ((...args: any[]) => {
        const key = JSON.stringify(args);
        if (cache.has(key)) {
            return cache.get(key);
        }
        const result = fn(...args);
        cache.set(key, result);
        return result;
    }) as T;
};

/**
 * Creates a function that raises and error with the provided message. Makes it a bit easier to use in some cases.
 * @param message - The message to raise.
 * @returns - never
 * @example
 * raise("Something went wrong");
 *
 * const data = somethingThatMightExist ?? raise("Data does not exist");
 */
export const raise = (message: string): never => {
    throw new Error(message);
};

/**
 * Check that a value is of type never. Useful for checking that a switch statement is exhaustive in TypeScript.
 * @param value - The value to check.
 * @returns - never
 * @example
 * type Foo = "a" | "b";
 *
 *  switch (foo) {
 *    case "a":
 *      // do something
 *      break;
 *    default:
 *      exhaustiveCheck(foo); // raises an error
 *  }
 */
export const exhaustiveCheck = (value: never): never => {
    throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`);
};

/**
 * Check that a value is not falsy. Useful for narrowing types in TypeScript.
 * @param condition - The condition to check.
 * @param message - The message to raise if the condition is falsy.
 * @returns - void
 * @example
 * const person: Person | undefined = getPerson();
 * invariant(person, "Person does not exist"); // person is now of type Person if it exists
 *
 * const person: Person | undefined = undefined;
 * invariant(person, "Person does not exist"); // raises an error
 */
export function invariant(condition: any, message?: string | Callback<string>): asserts condition {
    if (condition) {
        return;
    }

    const messageString = typeof message === "function" ? message() : message;
    throw new Error(messageString ?? "Invariant failed");
}

/**
 * Produce a new object from an existing object without mutating the original object. Uses structured cloning to create a deep clone of the object.
 * Works with non-primitive types like arrays, maps, sets and objects. A simple version of immer.
 * @param item - The item to clone.
 * @param fn - A function that mutates the clone.
 * @returns - The updated clone.
 * @example
 * // original version
 * const person = { name: "John", age: 30 };
 * const updatedPerson = produce(person, draft => {
 *  draft.age = 31;
 * });
 *
 * console.log(person.age); // 30
 * console.log(updatedPerson.age); // 31
 *
 * // curried version
 * const producePerson = produce((draft: Person) => {
 *   draft.age = 31;
 * });
 *
 * const person = { name: "John", age: 30 };
 * const updatedPerson = producePerson(person);
 *
 * console.log(person.age); // 30
 * console.log(updatedPerson.age); // 31
 *
 * // curried version in React
 * const [person, setPerson] = useState({ name: "John", age: 30 });
 *
 * setPerson(produce(draft => {
 *   draft.age = 31;
 * }));
 */
export function produce<T>(fn: (draft: T) => void): (currentState: T) => T;
export function produce<T>(item: T, fn: (draft: T) => void): T;
export function produce<T>(itemOrFn: T | ((draft: T) => void), fn?: (draft: T) => void) {
    const useCurried = typeof itemOrFn === "function" && !fn;
    const useOriginal = typeof itemOrFn !== "function" && fn;

    if (useCurried) {
        return (currentState: T): T => produce(currentState, itemOrFn as (draft: T) => void);
    } else if (useOriginal) {
        const clone = structuredClone(itemOrFn);
        fn(clone);
        return clone;
    }

    throw new Error("Invalid arguments passed to produce.");
}
