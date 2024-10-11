/**
 * A result type that can be used to return a value or an error.
 */

export type SuccessResult<T> = {
    success: true;
    data: T;
};

export type ErrorType = {
    success: false;
    message: string;
};

export type ResultType<T> = SuccessResult<T> | ErrorType;
export type AsyncResultType<T> = Promise<ResultType<T>>;

const ok = <T = void>(data?: T): SuccessResult<T extends undefined ? void : T> => ({
    success: true,
    data: data as T extends undefined ? void : T,
});

/**
 * A simple result type that can be used to return a value or an error.
 * @returns A result type that represents a value or an error.
 * @example
 *
 * const result = Result.ok(1); // or Result.error
 * if (result.success) {
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
    error: (message: string): ErrorType => ({
        success: false,
        message,
    }),
};

type ErrorResultMeta<TErrorDataMap extends Record<string, any>> = {
    [K in keyof TErrorDataMap]: {
        type: K;
        data: TErrorDataMap[K];
    };
}[keyof TErrorDataMap];

export type ErrorResultWithType<TErrorDataMap extends Record<string, any>> = ErrorType &
    ErrorResultMeta<TErrorDataMap>;

export type CreatedResultType<TData, TErrorDataMap extends Record<string, any>> =
    | SuccessResult<TData>
    | ErrorResultWithType<TErrorDataMap>;

/**
 * Create a custom Result type with error data and types.
 * @returns A result type that represents a value or an error with custom error data and types.
 * @example
 *
 * type MyErrorDataMap = {
 *    network: { endpoint: string; statusCode: number };
 *    internal: { errorId: string; details: string };
 * };
 *
 * const OwnResult = createResult<MyErrorDataMap>();
 *
 * const error = OwnResult.error("error message", {
 *    type: "network",
 *    data: { endpoint: "http://example.com", statusCode: 404 },
 * });
 *
 * if (error.type === "network") {
 *    console.log(error.data.endpoint);
 * }
 */
export const createResult = <TErrorDataMap extends Record<string, any>>() => ({
    ok,
    error: (
        message: string,
        meta: ErrorResultMeta<TErrorDataMap>
    ): ErrorResultWithType<TErrorDataMap> => ({
        success: false,
        message,
        type: meta.type,
        data: meta.data,
    }),
});
