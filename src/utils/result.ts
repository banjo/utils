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

type ResultValue<T> = T extends Ok<infer Value> ? Value : never;
type ResultError<T> = T extends Err<infer Error> ? Error : never;

type ResultValues<T extends readonly ResultType<unknown, unknown>[]> = {
    [K in keyof T]: ResultValue<T[K]>;
};

type ResultErrors<T extends readonly ResultType<unknown, unknown>[]> =
    ResultError<T[number]>;

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
     * const double = (x: number) => x * 2;
     * const addOne = (x: number) => x + 1;
     *
     * Result.ok(5)
     *   .map(double)  // Ok(10)
     *   .map(addOne); // Ok(11)
     *
     * Result.err("fail")
     *   .map(double); // Err("fail") — untouched
     */
    map<U>(fn: (data: T) => U): ResultType<U, E>;

    /**
     * If Err, maps the error using the provided function and returns a new Err result.
     * If Ok, does nothing and returns the original Ok.
     * @example
     * const toError = (msg: string) => new Error(msg);
     *
     * Result.err("not found").mapErr(toError); // Err(Error("not found"))
     * Result.ok(42).mapErr(toError);           // Ok(42) — untouched
     */
    mapErr<F>(fn: (error: E) => F): ResultType<T, F>;

    /**
     * If Ok, runs a side-effect on the value without changing the result. Useful for logging or debugging.
     * If Err, does nothing and returns the original Err.
     * @example
     * const log = (val: string) => console.log("got:", val);
     * const upper = (s: string) => s.toUpperCase();
     *
     * Result.ok("hello")
     *   .tap(log)    // logs "got: hello", still Ok("hello")
     *   .map(upper); // Ok("HELLO")
     */
    tap<U>(fn: (data: T) => U): ResultType<T, E>;

    /**
     * If Err, runs a side-effect on the error without changing the result. Useful for logging errors.
     * If Ok, does nothing and returns the original Ok.
     * @example
     * const logError = (e: string) => console.error("failed:", e);
     * const prefix = (e: string) => `Request ${e}`;
     *
     * Result.err("timeout")
     *   .tapErr(logError)  // logs "failed: timeout", still Err("timeout")
     *   .mapErr(prefix);   // Err("Request timeout")
     */
    tapErr(fn: (error: E) => void): ResultType<T, E>;

    /**
     * If Ok, calls the provided function with the value and returns its Result.
     * Useful for chaining operations that themselves can fail.
     * If Err, does nothing and returns the original Err.
     * @example
     * const parse = (s: string) =>
     *   Result.fromThrowable(JSON.parse)(s);
     * const getAge = (obj: any) =>
     *   obj.age ? Result.ok(obj.age) : Result.err("missing age");
     * const validate = (age: number) =>
     *   age >= 18 ? Result.ok(age) : Result.err("too young");
     *
     * Result.ok('{"age": 25}')
     *   .andThen(parse)    // Ok({ age: 25 })
     *   .andThen(getAge)   // Ok(25)
     *   .andThen(validate); // Ok(25)
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
     * const fetchUser = async (id: number) => {
     *   const res = await fetch(`/api/users/${id}`);
     *   return res.json();
     * };
     *
     * const user = await Result.ok(1).mapAsync(fetchUser); // Ok({ name: "Alice", ... })
     */
    mapAsync<U>(fn: (data: T) => Promise<U>): Promise<ResultType<U, E>>;

    /**
     * If Err, asynchronously maps the error using the provided function and returns a new Err result.
     * If Ok, does nothing and returns the original Ok.
     * @example
     * const enrichError = async (code: string) => {
     *   const message = await lookupErrorMessage(code);
     *   return new AppError(code, message);
     * };
     *
     * const result = await Result.err("not_found")
     *   .mapErrAsync(enrichError); // Err(AppError("not_found", "Resource not found"))
     */
    mapErrAsync<F>(fn: (error: E) => Promise<F>): Promise<ResultType<T, F>>;

    /**
     * If Ok, asynchronously runs a side-effect on the value. Returns the original result unchanged.
     * If Err, does nothing and returns the original Err.
     * @example
     * const trackEvent = async (user: User) => {
     *   await analytics.track("user_loaded", { id: user.id });
     * };
     *
     * const result = await Result.ok(user).tapAsync(trackEvent); // Ok(user) — unchanged
     */
    tapAsync<U>(fn: (data: T) => Promise<U>): Promise<ResultType<T, E>>;

    /**
     * If Err, asynchronously runs a side-effect on the error. Returns the original result unchanged.
     * If Ok, does nothing and returns the original Ok.
     * @example
     * const reportError = async (e: string) => {
     *   await errorReporter.report(e);
     * };
     *
     * const result = await Result.err("timeout")
     *   .tapErrAsync(reportError); // Err("timeout") — unchanged
     */
    tapErrAsync(fn: (error: E) => Promise<void>): Promise<ResultType<T, E>>;

    /**
     * If Ok, asynchronously calls the provided function and returns its Result.
     * Useful for chaining async operations that themselves can fail.
     * If Err, does nothing and returns the original Err.
     * @example
     * const fetchOrders = async (userId: string) => {
     *   const res = await fetch(`/api/orders/${userId}`);
     *   if (!res.ok) return Result.err("fetch failed");
     *   return Result.ok(await res.json());
     * };
     *
     * const orders = await Result.ok("user-123")
     *   .andThenAsync(fetchOrders); // Ok([...orders]) or Err("fetch failed")
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
 * Returns true when a value has the Result shape.
 * Useful at API boundaries where values are unknown, for example when a generic handler accepts
 * either a raw response or a service Result.
 * @example
 * const value: unknown = await maybeReturnsResult();
 *
 * if (Result.isResult(value)) {
 *   return value.match({
 *     Ok: data => ({ status: 200, body: data }),
 *     Err: error => ({ status: 500, body: { message: String(error) } }),
 *   });
 * }
 */
export const isResult = (value: unknown): value is ResultType<unknown, unknown> => {
    if (!value || typeof value !== "object" || !("ok" in value)) {
        return false;
    }

    if (value.ok === true) {
        return "data" in value;
    }

    if (value.ok === false) {
        return "error" in value;
    }

    return false;
};

/**
 * Runs a synchronous operation and converts thrown errors into Err.
 * Use this for sync API/service work that can throw, such as parsing headers, URLs, or request data.
 * @example
 * const tenantResult = Result.try(
 *   () => new URL(request.url).pathname.split('/')[2],
 *   cause => new ApiError('Invalid tenant route', { cause }),
 * );
 *
 * if (!tenantResult.ok) return tenantResult;
 */
export const tryResult = <T, E = unknown>(
    fn: () => T,
    errorFn?: (error: unknown) => E
): ResultType<T, E> => {
    try {
        return ok(fn());
    } catch (error) {
        return err(errorFn ? errorFn(error) : (error as E));
    }
};

/**
 * Runs an async operation and converts rejected promises or thrown errors into Err.
 * This is useful for API service calls such as database queries, external SDK calls, or fetches.
 * @example
 * const ordersResult = await Result.tryAsync(
 *   () => db.orders.findMany({ tenantId }),
 *   cause => new ApiError('DB error listing orders', { cause }),
 * );
 *
 * if (!ordersResult.ok) return ordersResult;
 * return Result.ok(ordersResult.data.map(OrderListItem.fromDb));
 */
export const tryAsync = async <T, E = unknown>(
    fn: () => Promise<T>,
    errorFn?: (error: unknown) => E
): AsyncResultType<T, E> => {
    try {
        return ok(await fn());
    } catch (error) {
        return err(errorFn ? errorFn(error) : (error as E));
    }
};

/**
 * Converts a nullable value into a Result.
 * Useful after lookups such as Array.find, Map.get, or database methods returning undefined.
 * @example
 * const orderResult = Result.fromNullable(
 *   await db.orders.findFirst({ id: orderId, tenantId }),
 *   () => new ApiError('Order not found'),
 * );
 *
 * if (!orderResult.ok) return orderResult;
 */
export const fromNullable = <T, E>(
    value: T | null | undefined,
    error: E | (() => E)
): ResultType<NonNullable<T>, E> => {
    if (value === null || value === undefined) {
        return err(typeof error === "function" ? (error as () => E)() : error);
    }

    return ok(value as NonNullable<T>);
};

/**
 * Combines multiple Results into one Result.
 * Returns Ok with all successful values, or the first Err encountered. Useful for independent
 * service validation steps before running a mutation.
 * @example
 * const validation = Result.all([
 *   requirePositiveInteger(orderId, 'Order ID'),
 *   requireNonEmpty(cancelReason, 'Cancel reason'),
 *   requireTenantAccess(user, tenantId),
 * ] as const);
 *
 * if (!validation.ok) return validation;
 */
export const all = <T extends readonly ResultType<unknown, unknown>[]>(
    results: T
): ResultType<ResultValues<T>, ResultErrors<T>> => {
    const values = [] as unknown[];

    for (const result of results) {
        if (!result.ok) {
            return err(result.error) as ResultType<ResultValues<T>, ResultErrors<T>>;
        }

        values.push(result.data);
    }

    return ok(values as ResultValues<T>);
};

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
    all,
    ok,
    err,
    fromNullable,
    fromThrowable,
    fromAsyncThrowable,
    isResult,
    try: tryResult,
    tryAsync,
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
    all: <T extends readonly ResultType<unknown, E>[]>(results: T) => all(results),
    ok: <T>(data: T) => ok(data),
    err: (error: E) => err(error),
    fromNullable: <T>(value: T | null | undefined, error: E | (() => E)) =>
        fromNullable<T, E>(value, error),
    fromThrowable: <Args extends unknown[], T>(
        fn: (...args: Args) => T,
        errorFn?: (e: unknown) => E
    ) => fromThrowable<Args, T, E>(fn, errorFn),
    fromAsyncThrowable: <Args extends unknown[], T>(
        fn: (...args: Args) => Promise<T>,
        errorFn?: (e: unknown) => E
    ) => fromAsyncThrowable<Args, T, E>(fn, errorFn),
    isResult,
    try: <T>(fn: () => T, errorFn?: (e: unknown) => E) => tryResult<T, E>(fn, errorFn),
    tryAsync: <T>(fn: () => Promise<T>, errorFn?: (e: unknown) => E) =>
        tryAsync<T, E>(fn, errorFn),
});
