interface GenericMethods<T, E> {
    isOk(): this is Ok<T, E>;
    isErr(): this is Err<T, E>;
    map<U>(fn: (data: T) => U): ResultType<U, E>;
    mapErr<F>(fn: (error: E) => F): ResultType<T, F>;
    tap<U>(fn: (data: T) => U): ResultType<T, E>;
    tapErr<F>(fn: (error: E) => F): ResultType<T, F>;
    andThen<U>(fn: (data: T) => ResultType<U, E>): ResultType<U, E>;
    match<U>(handlers: { Ok: (data: T) => U; Err: (error: E) => U }): U;
    unwrap(): T;
    unwrapOr<U>(defaultValue: U): T | U;

    // Async variants
    mapAsync<U>(fn: (data: T) => Promise<U>): Promise<ResultType<U, E>>;
    mapErrAsync<F>(fn: (error: E) => Promise<F>): Promise<ResultType<T, F>>;
    tapAsync<U>(fn: (data: T) => Promise<U>): Promise<ResultType<T, E>>;
    tapErrAsync<F>(fn: (error: E) => Promise<F>): Promise<ResultType<T, F>>;
    andThenAsync<U>(fn: (data: T) => Promise<ResultType<U, E>>): Promise<ResultType<U, E>>;
}

export type ResultType<T, E> = Ok<T, E> | Err<T, E>;
export type AsyncResultType<T, E> = Promise<ResultType<T, E>>;

class Ok<T, E> implements GenericMethods<T, E> {
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

class Err<T, E> implements GenericMethods<T, E> {
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

function ok<T, E = string>(data: T): Ok<T, E> {
    return new Ok<T, E>(data);
}
function err<T = never, E = string>(error: E): Err<T, E> {
    return new Err<T, E>(error);
}

const fromThrowable = <Args extends unknown[], T, E>(
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

const fromAsyncThrowable = <Args extends unknown[], T, E>(
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

export const Result = {
    ok,
    err,
    fromThrowable,
    fromAsyncThrowable,
};
