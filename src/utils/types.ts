/**
 * Common TypeScript types.
 */

/**
 * A type that represents a function that returns a value of type T or undefined.
 */
export type Maybe<T> = T | undefined;
/**
 * A type that represents a function that returns a value of type T or null.
 */
export type Nullable<T> = T | null;

/**
 * A type that represents a function that returns a value of type T or void.
 */
export type Callback<T = void> = () => T;
/**
 * A type that represents a callback with an argument of type T and returns U.
 */
export type CallbackWithArgs<T, U = void> = (arg: T) => U;
/**
 * A type that represents an async function that returns a value of type T or void.
 */
export type AsyncCallback<T = void> = () => Promise<T>;
/**
 * A type that represents an async callback with an argument of type T and returns U.
 */
export type AsyncCallbackWithArgs<T, U> = (arg: T) => Promise<U>;
/**
 * A type that represents a predicate function that returns a boolean.
 */
export type Predicate<T> = (value: T) => boolean;

/**
 * A type that represents a primitive value.
 */
export type Primitive = string | number | boolean | symbol | null | undefined;

/**
 * Prettify nested and extended types to be more readable.
 */
export type Prettify<T> = {
    [K in keyof T]: T[K];
} & {};
