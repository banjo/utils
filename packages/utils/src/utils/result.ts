/**
 * A result type that can be used to return a value or an error.
 */

export type SuccessResult<T> = {
    /*
     * @deprecated Use `ok` instead.
     */
    success: true;
    ok: true;
    data: T;
};

export type ErrorType = {
    /*
     * @deprecated Use `ok` instead.
     */
    success: false;
    ok: false;
    message: string;
};

export type ResultType<T> = SuccessResult<T> | ErrorType;
export type AsyncResultType<T> = Promise<ResultType<T>>;

function ok(): SuccessResult<void>;
function ok<T>(data: T): SuccessResult<T>;
function ok<T>(data?: T): SuccessResult<T extends undefined ? void : T> {
    return {
        success: true,
        ok: true,
        data: (data === undefined ? undefined : data) as T extends undefined ? void : T,
    };
}

const error = (message: string): ErrorType => ({
    success: false,
    ok: false,
    message,
});

/**
 * A simple result type that can be used to return a value or an error.
 * @returns A result type that represents a value or an error.
 * @example
 *
 * const result = Result.ok(1); // or Result.error
 * if (result.ok) {
 *    console.log(result.data);
 * } else {
 *   console.log(result.message);
 * }
 *
 * const error = Result.error("error message");
 * console.log(error.message);
 */
export const Result = {
    ok,
    error,
};

/**
 * Create a wrapper around the default Result type.
 * Making it possible to import the Result type from your own module.
 * Without any custom error data and types. Use `createResultWithErrorData` for custom error data and types.
 * @returns A result type that represents a value or an error.
 * @example
 *
 * const OwnResult = createResult();
 *
 * const result = OwnResult.ok(1); // or OwnResult.error
 * if (result.ok) {
 *    console.log(result.data);
 * } else {
 *   console.log(result.message);
 * }
 */
export const createResult = () => Result;

export type SuccessResultV2<T> = {
    ok: true;
    data: T;
};

export type ErrorTypeV2 = {
    ok: false;
    message: string;
};

type ErrorResultMeta<TErrorDataMap extends Record<string, any>, TDefaultError> =
    | {
          [K in keyof TErrorDataMap]: TErrorDataMap[K] extends undefined
              ? { type: K }
              : { type: K; data: TErrorDataMap[K] };
      }[keyof TErrorDataMap]
    | { type: TDefaultError };

export type ErrorResultWithType<
    TErrorDataMap extends Record<string, any>,
    TDefaultError,
> = ErrorTypeV2 & ErrorResultMeta<TErrorDataMap, TDefaultError>;

export type CreatedResultType<TData, TErrorDataMap extends Record<string, any>, TDefaultError> =
    | SuccessResultV2<TData>
    | ErrorResultWithType<TErrorDataMap, TDefaultError>;

/**
 * Create a custom Result type with error data and types.
 * @returns A result type that represents a value or an error with custom error data and types.
 * @example
 *
 * type MyErrorDataMap = {
 *    network: { endpoint: string; statusCode: number };
 *    internal: { errorId: string; details: string };
 * };
 * type DefaultError = "UnknownError";
 *
 * const OwnResult = createResult<MyErrorDataMap, DefaultError>();
 *
 * const error = OwnResult.error("error message", {
 *    type: "network",
 *    data: { endpoint: "http://example.com", statusCode: 404 },
 * });
 *
 * if (error.type === "network") {
 *    console.log(error.data.endpoint);
 * }
 *
 * const error = OwnResult.error("error message");
 * console.log(error.type); // type "UnknownError"
 */
export const createResultWithErrorData = <
    TErrorDataMap extends Record<string, any>,
    TDefaultError = "UnknownError",
>() => {
    return {
        ok,
        error: (
            message: string,
            meta?: ErrorResultMeta<TErrorDataMap, TDefaultError>
        ): ErrorResultWithType<TErrorDataMap, TDefaultError> => {
            if (meta) {
                return {
                    ok: false,
                    message,
                    ...meta,
                };
            }
            return {
                ok: false,
                message,
                type: undefined as any as TDefaultError,
            };
        },
    };
};

export type ResultWithTypeError<TErrorType> = ErrorTypeV2 & { type: TErrorType };
export type ResultWithTypeSuccess<TData> = SuccessResultV2<TData>;
export type ResultWithType<TData, TErrorType> =
    | ResultWithTypeSuccess<TData>
    | ResultWithTypeError<TErrorType>;
export type AsyncResultWithType<TData, TErrorType> = Promise<ResultWithType<TData, TErrorType>>;

/**
 * Create a custom Result type with error types, no data.
 * @returns A result type that represents a value or an error with custom error types.
 * @example
 *
 * type MyErrorType = "NetworkError" | "InternalError";
 *
 * const OwnResult = createResultWithType<MyErrorType>();
 *
 * const error = OwnResult.error("error message", "NetworkError");
 * if (error.type === "NetworkError") {
 *    console.log(error.message);
 * }
 */
export const createResultWithType = <TErrorType extends string>() => {
    return {
        ok,
        error: (message: string, type: TErrorType): ResultWithTypeError<TErrorType> => ({
            ok: false,
            message,
            type,
        }),
    };
};

export type TryExpressionResult<T = undefined, E extends Error = Error> =
    | [E, undefined]
    | [undefined, T];

export type AsyncTryExpressionResult<T = undefined, E extends Error = Error> = Promise<
    TryExpressionResult<T, E>
>;

/**
 * Create a custom Result type based on try expressions, with a Go-like syntax. Used to return a value or an error.
 * Return value is a `TryExpressionResult` tuple with an error and a value.
 * @returns A tuple with an error and a value. E.g. [error, value]
 * @example
 * const Result = createTryExpressionResult();
 * const getResult = () => {
 *   if (something()) {
 *     return Result.ok(1);
 *   } else {
 *     return Result.error(new Error("error"));
 *   }
 * }
 *
 * const [error, value] = getResult();
 * if (error) {
 *   console.log(error.message); // Error is defined
 * } else {
 *   console.log(value);         // Value is defined
 * }
 */
export const createTryExpressionResult = () => {
    return {
        ok: <TData = undefined>(result = undefined as TData): [undefined, TData] => {
            return [undefined, result];
        },
        error: <TError extends Error>(error: TError): [TError, undefined] => {
            return [error, undefined];
        },
    };
};
