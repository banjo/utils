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
    | SuccessResult<TData>
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
export const createResult = <
    TErrorDataMap extends Record<string, any>,
    TDefaultError = "UnknownError",
>() => {
    return {
        error: (
            message: string,
            meta?: ErrorResultMeta<TErrorDataMap, TDefaultError>
        ): ErrorResultWithType<TErrorDataMap, TDefaultError> => {
            if (meta) {
                return {
                    success: false,
                    message,
                    ...meta,
                };
            }
            return {
                success: false,
                message,
                type: undefined as any as TDefaultError,
            };
        },
    };
};
