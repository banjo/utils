/**
 * Common TypeScript types.
 */

/**
 * A type that represents a function that returns a value of type T or undefined.
 * @example
 * const fn = (): Maybe<number> => {
 *    return 1;
 * };
 *
 * const result = fn(); // result is of type number | undefined
 */
export type Maybe<T> = T | undefined;
/**
 * A type that represents a function that returns a value of type T or null.
 * @example
 * const fn = (): Nullable<number> => {
 *   return 1;
 * };
 *
 * const result = fn(); // result is of type number | null
 */
export type Nullable<T> = T | null;

/**
 * A type that represents a function that returns a value of type T or void.
 * @example
 * const fn: Callback = () => {};
 *
 * const result = fn(); // result is of type void
 */
export type Callback<T = void> = () => T;
/**
 * A type that represents a callback with an argument of type T and returns U.
 * @example
 * const fn: CallbackWithArgs<number, string> = (arg) => {
 *  return arg.toString();
 * };
 *
 * const result = fn(1); // result is of type string
 */
export type CallbackWithArgs<T, U = void> = (arg: T) => U;
/**
 * A type that represents an async function that returns a value of type T or void.
 * @example
 * const fn: AsyncCallback = async () => {};
 *
 * const result = await fn(); // result is of type void
 */
export type AsyncCallback<T = void> = () => Promise<T>;
/**
 * A type that represents an async callback with an argument of type T and returns U.
 * @example
 * const fn: AsyncCallbackWithArgs<number, string> = async (arg) => {
 * return arg.toString();
 * };
 *
 * const result = await fn(1); // result is of type string
 */
export type AsyncCallbackWithArgs<T, U = void> = (arg: T) => Promise<U>;
/**
 * A type that represents a predicate function that returns a boolean.
 * @example
 * const fn: Predicate<number> = (value) => {
 *  return value > 0;
 * };
 *
 * const result = fn(1); // result is of type boolean
 */
export type Predicate<T> = (value: T) => boolean;

/**
 * A type that represents a primitive value.
 * @example
 * const value: Primitive = "hello world";
 * const value: Primitive = 1;
 * const value: Primitive = true;
 * const value: Primitive = null;
 * const value: Primitive = undefined;
 * const value: Primitive = Symbol("test");
 * const value: Primitive = {}; // error
 */
export type Primitive = string | number | boolean | symbol | null | undefined;

/**
 * Prettify nested and extended types to be more readable.
 */
export type Prettify<T> = {
    [K in keyof T]: T[K];
} & {};

/**
 * A type that represents a falsy value.
 */
export type Falsy = false | 0 | "" | null | undefined;
