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
export type ResultType<T, E> = Ok<T> | Err<E>;

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
     * Returns true if the result is Ok. Narrows the type so you can safely access `.data`.
     * @example
     * const result = Result.ok(42);
     * if (result.isOk()) {
     *   console.log(result.data); // 42
     * }
     */
    isOk(): this is Ok<T>;

    /**
     * Returns true if the result is Err. Narrows the type so you can safely access `.error`.
     * @example
     * const result = Result.err("not found");
     * if (result.isErr()) {
     *   console.log(result.error); // "not found"
     * }
     */
    isErr(): this is Err<E>;

    /**
     * If Ok, maps the value using the provided function and returns a new Ok result.
     * If Err, does nothing and returns the original Err.
     * @example
     * const result = Result.ok(5);
     * const doubled = result.map(x => x * 2); // Ok(10)
     *
     * const err = Result.err("fail");
     * const stillErr = err.map(x => x * 2); // Err("fail")
     */
    map<U>(fn: (data: T) => U): ResultType<U, E>;

    /**
     * If Err, maps the error using the provided function and returns a new Err result.
     * If Ok, does nothing and returns the original Ok.
     * @example
     * const result = Result.err("not found");
     * const mapped = result.mapErr(e => new Error(e)); // Err(Error("not found"))
     *
     * const ok = Result.ok(42);
     * const stillOk = ok.mapErr(e => new Error(e)); // Ok(42)
     */
    mapErr<F>(fn: (error: E) => F): ResultType<T, F>;

    /**
     * If Ok, runs a side-effect on the value without changing the result. Useful for logging or debugging.
     * If Err, does nothing and returns the original Err.
     * @example
     * const result = Result.ok("hello");
     * result
     *   .tap(val => console.log("got:", val)) // logs "got: hello"
     *   .map(s => s.toUpperCase()); // Ok("HELLO")
     */
    tap<U>(fn: (data: T) => U): ResultType<T, E>;

    /**
     * If Err, runs a side-effect on the error without changing the result. Useful for logging errors.
     * If Ok, does nothing and returns the original Ok.
     * @example
     * const result = Result.err("timeout");
     * result
     *   .tapErr(e => console.error("failed:", e)) // logs "failed: timeout"
     *   .mapErr(e => `Request ${e}`); // Err("Request timeout")
     */
    tapErr(fn: (error: E) => void): ResultType<T, E>;

    /**
     * If Ok, calls the provided function with the value and returns its Result.
     * Useful for chaining operations that themselves can fail.
     * If Err, does nothing and returns the original Err.
     * @example
     * const divide = (a: number, b: number) =>
     *   b === 0 ? Result.err("division by zero") : Result.ok(a / b);
     *
     * const result = Result.ok(10)
     *   .andThen(x => divide(x, 2)) // Ok(5)
     *   .andThen(x => divide(x, 0)); // Err("division by zero")
     */
    andThen<U>(fn: (data: T) => ResultType<U, E>): ResultType<U, E>;

    /**
     * Pattern-matches on Ok/Err, calling the corresponding handler and returning its value.
     * @example
     * const result = Result.ok(42);
     * const message = result.match({
     *   Ok: x => `Success: ${x}`,
     *   Err: e => `Failed: ${e}`
     * }); // "Success: 42"
     */
    match<U>(handlers: { Ok: (data: T) => U; Err: (error: E) => U }): U;

    /**
     * Returns the Ok value. Throws an error if the result is Err.
     * Use only when you are certain the result is Ok.
     * @example
     * const result = Result.ok(42);
     * result.unwrap(); // 42
     *
     * const err = Result.err("fail");
     * err.unwrap(); // throws Error
     */
    unwrap(): T;

    /**
     * Returns the Ok value, or the provided default value if Err.
     * @example
     * const ok = Result.ok(42);
     * ok.unwrapOr(0); // 42
     *
     * const err = Result.err("fail");
     * err.unwrapOr(0); // 0
     */
    unwrapOr<U>(defaultValue: U): T | U;

    // Async variants

    /**
     * If Ok, asynchronously maps the value using the provided function and returns a new Ok result.
     * If Err, does nothing and returns the original Err.
     * @example
     * const result = Result.ok(1);
     * const mapped = await result.mapAsync(async x => {
     *   const response = await fetch(`/api/items/${x}`);
     *   return response.json();
     * }); // Ok({ ... })
     */
    mapAsync<U>(fn: (data: T) => Promise<U>): Promise<ResultType<U, E>>;

    /**
     * If Err, asynchronously maps the error using the provided function and returns a new Err result.
     * If Ok, does nothing and returns the original Ok.
     * @example
     * const result = Result.err("not_found");
     * const mapped = await result.mapErrAsync(async code => {
     *   const message = await lookupErrorMessage(code);
     *   return new AppError(code, message);
     * }); // Err(AppError("not_found", "Resource not found"))
     */
    mapErrAsync<F>(fn: (error: E) => Promise<F>): Promise<ResultType<T, F>>;

    /**
     * If Ok, asynchronously runs a side-effect on the value. Returns the original result unchanged.
     * If Err, does nothing and returns the original Err.
     * @example
     * const result = Result.ok(user);
     * await result.tapAsync(async u => {
     *   await analytics.track("user_loaded", { id: u.id });
     * }); // Ok(user) — unchanged
     */
    tapAsync<U>(fn: (data: T) => Promise<U>): Promise<ResultType<T, E>>;

    /**
     * If Err, asynchronously runs a side-effect on the error. Returns the original result unchanged.
     * If Ok, does nothing and returns the original Ok.
     * @example
     * const result = Result.err("timeout");
     * await result.tapErrAsync(async e => {
     *   await errorReporter.report(e);
     * }); // Err("timeout") — unchanged
     */
    tapErrAsync(fn: (error: E) => Promise<void>): Promise<ResultType<T, E>>;

    /**
     * If Ok, asynchronously calls the provided function and returns its Result.
     * Useful for chaining async operations that themselves can fail.
     * If Err, does nothing and returns the original Err.
     * @example
     * const result = Result.ok(userId);
     * const orders = await result.andThenAsync(async id => {
     *   const res = await fetch(`/api/orders/${id}`);
     *   if (!res.ok) return Result.err("fetch failed");
     *   return Result.ok(await res.json());
     * }); // Ok([...orders]) or Err("fetch failed")
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
export class Ok<T> implements GenericMethods<T, never> {
    readonly ok = true;
    constructor(public data: T) {}

    isOk(): this is Ok<T> {
        return true;
    }
    isErr(): this is Err<never> {
        return false;
    }
    map<U>(fn: (data: T) => U): Ok<U> {
        return new Ok<U>(fn(this.data));
    }
    mapErr<F>(fn: (error: never) => F): Ok<T> {
        return this;
    }
    tap<U>(fn: (data: T) => U): Ok<T> {
        fn(this.data);
        return this;
    }
    tapErr(fn: (error: never) => void): Ok<T> {
        return this;
    }
    andThen<U, E2>(fn: (data: T) => ResultType<U, E2>): ResultType<U, E2> {
        return fn(this.data);
    }
    match<U>(handlers: { Ok: (data: T) => U; Err: (error: never) => U }): U {
        return handlers.Ok(this.data);
    }
    unwrap(): T {
        return this.data;
    }
    unwrapOr<U>(defaultValue: U): T | U {
        return this.data;
    }
    async mapAsync<U>(fn: (data: T) => Promise<U>): Promise<Ok<U>> {
        return new Ok<U>(await fn(this.data));
    }
    async mapErrAsync<F>(fn: (error: never) => Promise<F>): Promise<Ok<T>> {
        return this;
    }
    async tapAsync<U>(fn: (data: T) => Promise<U>): Promise<Ok<T>> {
        await fn(this.data);
        return this;
    }
    async tapErrAsync(fn: (error: never) => Promise<void>): Promise<Ok<T>> {
        return this;
    }
    async andThenAsync<U, E2>(
        fn: (data: T) => Promise<ResultType<U, E2>>
    ): Promise<ResultType<U, E2>> {
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
export class Err<E> implements GenericMethods<never, E> {
    readonly ok = false;
    constructor(public error: E) {}

    isOk(): this is Ok<never> {
        return false;
    }
    isErr(): this is Err<E> {
        return true;
    }
    map<U>(fn: (data: never) => U): Err<E> {
        return this;
    }
    mapErr<F>(fn: (error: E) => F): Err<F> {
        return new Err<F>(fn(this.error));
    }
    tap<U>(fn: (data: never) => U): Err<E> {
        return this;
    }
    tapErr(fn: (error: E) => void): Err<E> {
        fn(this.error);
        return this;
    }
    andThen<U, E2>(fn: (data: never) => ResultType<U, E2>): Err<E> {
        return this;
    }
    match<U>(handlers: { Ok: (data: never) => U; Err: (error: E) => U }): U {
        return handlers.Err(this.error);
    }
    unwrap(): never {
        throw new Error(`Attempted to unwrap an Err: ${this.error}`);
    }
    unwrapOr<U>(defaultValue: U): U {
        return defaultValue;
    }
    async mapAsync<U>(fn: (data: never) => Promise<U>): Promise<Err<E>> {
        return this;
    }
    async mapErrAsync<F>(fn: (error: E) => Promise<F>): Promise<Err<F>> {
        return new Err<F>(await fn(this.error));
    }
    async tapAsync<U>(fn: (data: never) => Promise<U>): Promise<Err<E>> {
        return this;
    }
    async tapErrAsync(fn: (error: E) => Promise<void>): Promise<Err<E>> {
        await fn(this.error);
        return this;
    }
    async andThenAsync<U, E2>(fn: (data: never) => Promise<ResultType<U, E2>>): Promise<Err<E>> {
        return this;
    }
}

/**
 * Creates an Ok result.
 * @example
 * const result = Result.ok(42);
 */
export function ok<T>(data: T): Ok<T> {
    return new Ok<T>(data);
}

/**
 * Creates an Err result.
 * @example
 * const result = Result.err("Something went wrong");
 */
export function err<E = string>(error: E): Err<E> {
    return new Err<E>(error);
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

/**
 * Creates a Result factory locked to a specific error type.
 * Useful when you want to own a Result type in your module with a consistent error shape.
 * @example
 * class AppError extends Error {
 *     constructor(public code: number, message: string) {
 *         super(message);
 *     }
 * }
 *
 * const Result = createResult<AppError>();
 * type Result<T> = ResultType<T, AppError>;
 *
 * // Services return Results
 * function getUser(id: string): Result<User> {
 *     const user = db.find(id);
 *     if (!user) return Result.err(new AppError(404, "User not found"));
 *     return Result.ok(user);
 * }
 *
 * function getUserOrders(user: User): Result<Order[]> {
 *     const orders = db.ordersFor(user.id);
 *     if (!orders) return Result.err(new AppError(500, "DB failure"));
 *     return Result.ok(orders);
 * }
 *
 * // Chain with andThen + map, then match in the controller
 * const result = getUser(id)
 *     .andThen((user) => getUserOrders(user))
 *     .map((orders) => orders.reduce((sum, o) => sum + o.total, 0));
 *
 * return result.match({
 *     Ok: (total) => ({ status: 200, body: { total } }),
 *     Err: (err) => ({ status: err.code, body: { message: err.message } }),
 * });
 */
export const createResult = <E>() => ({
    ok: <T>(data: T) => ok(data),
    err: (error: E) => err(error),
    fromThrowable: <Args extends unknown[], T>(
        fn: (...args: Args) => T,
        errorFn?: (e: unknown) => E
    ) => fromThrowable<Args, T, E>(fn, errorFn),
    fromAsyncThrowable: <Args extends unknown[], T>(
        fn: (...args: Args) => Promise<T>,
        errorFn?: (e: unknown) => E
    ) => fromAsyncThrowable<Args, T, E>(fn, errorFn),
});
