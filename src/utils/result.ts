/**
 * A result type that can be used to return a value or an error.
 */

/**
 * A type representing either a successful result (Ok) or an error (Err).
 * @example
 * let result: ResultType<number, string> = Result.ok(42);
 * if (result.ok) {
 *   // result is Ok
 *   console.log(result.data);
 * } else {
 *   // result is Err
 *   console.log(result.error);
 * }
 */
export type ResultType<T, E> = Ok<T, E> | Err<T, E>;

/**
 * A Promise of a ResultType.
 * @example
 * async function fetchNumber(): AsyncResultType<number, string> {
 *   // ...
 * }
 */
export type AsyncResultType<T, E> = Promise<ResultType<T, E>>;

/**
 * Interface for Result methods.
 * See Ok and Err for concrete implementations.
 */
interface GenericMethods<T, E> {
    /**
     * Returns true if the result is Ok.
     * @example
     * if (result.isOk()) {
     *   // result is Ok
     * }
     */
    isOk(): this is Ok<T, E>;

    /**
     * Returns true if the result is Err.
     * @example
     * if (result.isErr()) {
     *   // result is Err
     * }
     */
    isErr(): this is Err<T, E>;

    /**
     * If Ok, maps the value using the provided function and returns a new Ok result.
     * If Err, does nothing and returns the original Err.
     * @example
     * const mapped = result.map(x => x + 1);
     */
    map<U>(fn: (data: T) => U): ResultType<U, E>;

    /**
     * If Err, maps the error using the provided function and returns a new Err result.
     * If Ok, does nothing and returns the original Ok.
     * @example
     * const mapped = result.mapErr(err => `Error: ${err}`);
     */
    mapErr<F>(fn: (error: E) => F): ResultType<T, F>;

    /**
     * If Ok, runs a side-effect on the value. Returns the original result.
     * If Err, does nothing and returns the original Err.
     * @example
     * result.tap(x => console.log(x));
     */
    tap<U>(fn: (data: T) => U): ResultType<T, E>;

    /**
     * If Err, runs a side-effect on the error. Returns the original result.
     * If Ok, does nothing and returns the original Ok.
     * @example
     * result.tapErr(err => console.error(err));
     */
    tapErr<F>(fn: (error: E) => F): ResultType<T, F>;

    /**
     * If Ok, calls the provided function and returns its result.
     * If Err, does nothing and returns the original Err.
     * @example
     * const chained = result.andThen(x => Result.ok(x + 1));
     */
    andThen<U>(fn: (data: T) => ResultType<U, E>): ResultType<U, E>;

    /**
     * Pattern-matches on Ok/Err and returns the result.
     * @example
     * const message = result.match({
     *   Ok: x => `Value: ${x}`,
     *   Err: e => `Error: ${e}`
     * });
     */
    match<U>(handlers: { Ok: (data: T) => U; Err: (error: E) => U }): U;

    /**
     * Returns the Ok value, or throws if Err.
     * @example
     * const value = result.unwrap();
     */
    unwrap(): T;

    /**
     * Returns the Ok value, or the provided default if Err.
     * @example
     * const value = result.unwrapOr(42);
     */
    unwrapOr<U>(defaultValue: U): T | U;

    // Async variants

    /**
     * If Ok, asynchronously maps the value using the provided function and returns a new Ok result.
     * If Err, does nothing and returns the original Err.
     * @example
     * const mapped = await result.mapAsync(async x => x + 1);
     */
    mapAsync<U>(fn: (data: T) => Promise<U>): Promise<ResultType<U, E>>;

    /**
     * If Err, asynchronously maps the error using the provided function and returns a new Err result.
     * If Ok, does nothing and returns the original Ok.
     * @example
     * const mapped = await result.mapErrAsync(async err => `Error: ${err}`);
     */
    mapErrAsync<F>(fn: (error: E) => Promise<F>): Promise<ResultType<T, F>>;

    /**
     * If Ok, asynchronously runs a side-effect on the value. Returns the original result.
     * If Err, does nothing and returns the original Err.
     * @example
     * await result.tapAsync(async x => console.log(x));
     */
    tapAsync<U>(fn: (data: T) => Promise<U>): Promise<ResultType<T, E>>;

    /**
     * If Err, asynchronously runs a side-effect on the error. Returns the original result.
     * If Ok, does nothing and returns the original Ok.
     * @example
     * await result.tapErrAsync(async err => console.error(err));
     */
    tapErrAsync<F>(fn: (error: E) => Promise<F>): Promise<ResultType<T, F>>;

    /**
     * If Ok, asynchronously calls the provided function and returns its result.
     * If Err, does nothing and returns the original Err.
     * @example
     * const chained = await result.andThenAsync(async x => Result.ok(x + 1));
     */
    andThenAsync<U>(fn: (data: T) => Promise<ResultType<U, E>>): Promise<ResultType<U, E>>;
}

/**
 * Represents a successful result.
 * Use Result.ok() to create.
 * @example
 * const okResult = Result.ok(42);
 * if (okResult.ok) {
 *   console.log(okResult.data); // 42
 * }
 */
export class Ok<T, E> implements GenericMethods<T, E> {
    readonly ok = true;
    constructor(public data: T) {}

    isOk(): this is Ok<T, E> {
        return true;
    }
    isErr(): this is Err<T, E> {
        return false;
    }
    map<U>(fn: (data: T) => U): ResultType<U, E> {
        return new Ok<U, E>(fn(this.data));
    }
    mapErr<F>(fn: (error: E) => F): ResultType<T, F> {
        return new Ok<T, F>(this.data);
    }
    tap<U>(fn: (data: T) => U): ResultType<T, E> {
        fn(this.data);
        return this;
    }
    tapErr<F>(fn: (error: E) => F): ResultType<T, F> {
        return this as unknown as Ok<T, F>;
    }
    andThen<U>(fn: (data: T) => ResultType<U, E>): ResultType<U, E> {
        return fn(this.data);
    }
    match<U>(handlers: { Ok: (data: T) => U; Err: (error: E) => U }): U {
        return handlers.Ok(this.data);
    }
    unwrap(): T {
        return this.data;
    }
    unwrapOr<U>(defaultValue: U): T | U {
        return this.data;
    }
    async mapAsync<U>(fn: (data: T) => Promise<U>): Promise<ResultType<U, E>> {
        return new Ok<U, E>(await fn(this.data));
    }
    async mapErrAsync<F>(fn: (error: E) => Promise<F>): Promise<ResultType<T, F>> {
        return new Ok<T, F>(this.data);
    }
    async tapAsync<U>(fn: (data: T) => Promise<U>): Promise<ResultType<T, E>> {
        await fn(this.data);
        return this;
    }
    async tapErrAsync<F>(fn: (error: E) => Promise<F>): Promise<ResultType<T, F>> {
        return this as unknown as Ok<T, F>;
    }
    async andThenAsync<U>(fn: (data: T) => Promise<ResultType<U, E>>): Promise<ResultType<U, E>> {
        return fn(this.data);
    }
}

/**
 * Represents an error result.
 * Use Result.err() to create.
 * @example
 * const errResult = Result.err("fail");
 * if (!errResult.ok) {
 *   console.log(errResult.error); // "fail"
 * }
 */
export class Err<T, E> implements GenericMethods<T, E> {
    readonly ok = false;
    constructor(public error: E) {}

    isOk(): this is Ok<T, E> {
        return false;
    }
    isErr(): this is Err<T, E> {
        return true;
    }
    map<U>(fn: (data: T) => U): ResultType<U, E> {
        return new Err<U, E>(this.error);
    }
    mapErr<F>(fn: (error: E) => F): ResultType<T, F> {
        return new Err<T, F>(fn(this.error));
    }
    tap<U>(fn: (data: T) => U): ResultType<T, E> {
        return this;
    }
    tapErr<F>(fn: (error: E) => F): ResultType<T, F> {
        fn(this.error);
        return this as unknown as Err<T, F>;
    }
    andThen<U>(fn: (data: T) => ResultType<U, E>): ResultType<U, E> {
        return new Err<U, E>(this.error);
    }
    match<U>(handlers: { Ok: (data: T) => U; Err: (error: E) => U }): U {
        return handlers.Err(this.error);
    }
    unwrap(): T {
        throw new Error(`Attempted to unwrap an Err: ${this.error}`);
    }
    unwrapOr<U>(defaultValue: U): T | U {
        return defaultValue;
    }
    async mapAsync<U>(fn: (data: T) => Promise<U>): Promise<ResultType<U, E>> {
        return new Err<U, E>(this.error);
    }
    async mapErrAsync<F>(fn: (error: E) => Promise<F>): Promise<ResultType<T, F>> {
        return new Err<T, F>(await fn(this.error));
    }
    async tapAsync<U>(fn: (data: T) => Promise<U>): Promise<ResultType<T, E>> {
        return this;
    }
    async tapErrAsync<F>(fn: (error: E) => Promise<F>): Promise<ResultType<T, F>> {
        await fn(this.error);
        return this as unknown as Err<T, F>;
    }
    async andThenAsync<U>(fn: (data: T) => Promise<ResultType<U, E>>): Promise<ResultType<U, E>> {
        return new Err<U, E>(this.error);
    }
}

/**
 * Creates an Ok result.
 * @example
 * const result = Result.ok(42);
 */
export function ok<T, E = string>(data: T): Ok<T, E> {
    return new Ok<T, E>(data);
}

/**
 * Creates an Err result.
 * @example
 * const result = Result.err("Something went wrong");
 */
export function err<T = never, E = string>(error: E): Err<T, E> {
    return new Err<T, E>(error);
}

/**
 * Wraps a potentially-throwing function and returns a ResultType.
 * If the function throws, returns Err; otherwise, returns Ok.
 * @example
 * const safeParse = Result.fromThrowable(JSON.parse);
 * const result = safeParse('{"a":1}');
 * if (result.ok) {
 *   console.log(result.data); // parsed object
 * } else {
 *   console.log(result.error); // error object
 * }
 */
export const fromThrowable = <Args extends unknown[], T, E>(
    fn: (...args: Args) => T,
    errorFn?: (e: unknown) => E
): ((...args: Args) => ResultType<T, E>) => {
    return (...args: Args) => {
        try {
            return ok(fn(...args));
        } catch (error) {
            return err(errorFn ? errorFn(error) : (error as E));
        }
    };
};

/**
 * Wraps a potentially-throwing async function and returns a Promise of ResultType.
 * If the function throws or rejects, returns Err; otherwise, returns Ok.
 * @example
 * const safeFetch = Result.fromAsyncThrowable(fetch);
 * const result = await safeFetch("https://example.com");
 * if (result.ok) {
 *   console.log(result.data); // fetch response
 * } else {
 *   console.log(result.error); // error object
 * }
 */
export const fromAsyncThrowable = <Args extends unknown[], T, E>(
    fn: (...args: Args) => Promise<T>,
    errorFn?: (e: unknown) => E
): ((...args: Args) => Promise<ResultType<T, E>>) => {
    return async (...args: Args) => {
        try {
            return ok(await fn(...args));
        } catch (error) {
            return err(errorFn ? errorFn(error) : (error as E));
        }
    };
};

/**
 * Utility object for creating and working with Result types.
 * @example
 * const okResult = Result.ok(42);
 * const errResult = Result.err("fail");
 */
export const Result = {
    ok,
    err,
    fromThrowable,
    fromAsyncThrowable,
};
