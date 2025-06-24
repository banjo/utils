/**
 * A simple result type that can be used to return a value or an error.
 */

export type SimpleSuccess<T> = {
    ok: true;
    data: T;
};

export type ErrorType = {
    ok: false;
    message: string;
};

export type SimpleResult<T> = SimpleSuccess<T> | ErrorType;
export type AsyncSimpleResult<T> = Promise<SimpleResult<T>>;

function simpleOk(): SimpleSuccess<void>;
function simpleOk<T>(data: T): SimpleSuccess<T>;
function simpleOk<T>(data?: T): SimpleSuccess<T extends undefined ? void : T> {
    return {
        ok: true,
        data: (data === undefined ? undefined : data) as T extends undefined ? void : T,
    };
}

const simpleError = (message: string): ErrorType => ({
    ok: false,
    message,
});

/**
 * A simple result type that can be used to return a value or an error.
 * @returns A result type that represents a value or an error.
 * @example
 *
 * const result = SimpleResultHelpers.ok(1); // or SimpleResultHelpers.error
 * if (result.ok) {
 *    console.log(result.data);
 * } else {
 *   console.log(result.message);
 * }
 *
 * const error = SimpleResultHelpers.error("error message");
 * console.log(error.message);
 */
export const SimpleResultHelpers = {
    ok: simpleOk,
    error: simpleError,
};

/**
 * Create a wrapper around the simple result type.
 * Making it possible to import the SimpleResult type from your own module.
 * Without any custom error data and types. Use `createResultWithErrorData` for custom error data and types.
 * @returns A result type that represents a value or an error.
 * @example
 *
 * const OwnResult = createSimpleResult();
 *
 * const result = OwnResult.ok(1); // or OwnResult.error
 * if (result.ok) {
 *    console.log(result.data);
 * } else {
 *   console.log(result.message);
 * }
 */
export const createSimpleResult = () => SimpleResultHelpers;

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
> = ErrorType & ErrorResultMeta<TErrorDataMap, TDefaultError>;

export type CreatedResultType<TData, TErrorDataMap extends Record<string, any>, TDefaultError> =
    | SimpleSuccess<TData>
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
 * const OwnResult = createResultWithErrorData<MyErrorDataMap, DefaultError>();
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
        ok: simpleOk,
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

export type ResultWithTypeError<TErrorType> = ErrorType & { type: TErrorType };
export type ResultWithTypeSuccess<TData> = SimpleSuccess<TData>;
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
        ok: simpleOk,
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
