/**
 * A result type that can be used to return a value or an error.
 */

export type ErrorType = "NotFound" | "BadRequest" | "Unauthorized" | "Forbidden" | "InternalError";

export const ErrorStatus: Record<ErrorType, number> = {
    NotFound: 404,
    BadRequest: 400,
    Unauthorized: 401,
    Forbidden: 403,
    InternalError: 500,
};

export type SuccessResult<T> = {
    success: true;
    data: T;
};

export type ErrorResult = {
    success: false;
    type: ErrorType;
    message: string;
    status: number;
};

export type BadRequestError = {
    message: string;
    expected: string;
    received: string;
    parameter?: string;
};

export type BadRequestResult = Omit<ErrorResult, "type"> & {
    type: "BadRequest";
    errors: BadRequestError[];
};

export type ResultType<T> = SuccessResult<T> | ErrorResult | BadRequestResult;

export type AsyncResultType<T> = Promise<ResultType<T>>;

/**
 * A simple result type that can be used to return a value or an error. Much like Rust's Result type.
 * @param error - the error to return if the result is unsuccessful and the type of error.
 * @returns A result type that represents a value or an error.
 * @example
 *
 * // result();
 *
 * const result = Result.ok(1); // or Result.okEmpty, or Result.error, etc;
 * if (result.success) {
 *    console.log(result.data);
 * } else {
 *   console.log(result.message);
 * }
 *
 */
export const Result = {
    ok: <T = void>(data?: T): SuccessResult<T extends undefined ? void : T> => ({
        success: true,
        data: data as T extends undefined ? void : T,
    }),
    /**
     * @deprecated Use `Result.ok()` instead.
     */
    okEmpty: (): SuccessResult<void> => ({
        success: true,
        data: undefined,
    }),
    error: (message: string, type: ErrorType): ErrorResult => ({
        success: false,
        type,
        message,
        status: ErrorStatus[type],
    }),
    badRequest: (message: string, errors: BadRequestError[]): BadRequestResult => ({
        success: false,
        type: "BadRequest",
        message,
        status: ErrorStatus["BadRequest"],
        errors,
    }),
};
