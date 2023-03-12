/**
 * Common TypeScript types.
 */

export type Maybe<T> = T | undefined;
export type Nullable<T> = T | null;

export type Callback<T> = () => T;
export type CallbackWithArgs<T, U> = (arg: T) => U;
export type AsyncCallback<T> = () => Promise<T>;
export type Predicate<T> = (value: T) => boolean;

export type Primitive = string | number | boolean | symbol | null | undefined;
