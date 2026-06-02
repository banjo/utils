import { describe, expect, expectTypeOf, it } from "vitest";
import { Result, ResultType, Ok, Err } from "../src/utils/result";

describe("Result", () => {
    describe("isOk", () => {
        it("should return true for an Ok variant", () => {
            const okResult = Result.ok("success");
            expect(okResult.isOk()).toBe(true);
        });

        it("should return false for an Err variant", () => {
            const errResult = Result.err("failure");
            expect(errResult.isOk()).toBe(false);
        });
    });

    describe("isErr", () => {
        it("should return false for an Ok variant", () => {
            const okResult = Result.ok("success");
            expect(okResult.isErr()).toBe(false);
        });

        it("should return true for an Err variant", () => {
            const errResult = Result.err("failure");
            expect(errResult.isErr()).toBe(true);
        });
    });

    it("should work with default case", () => {
        const res = Result.ok("42");
        expect(res.ok).toBe(true);
    });

    it("should map values correctly", () => {
        const res = Result.ok("42");
        const mapped = res.map(x => parseInt(x, 10));

        expect(mapped.ok).toBe(true);
        if (mapped.ok) {
            expect(mapped.data).toBe(42);
        }
    });

    it("should handle errors correctly", () => {
        const res = Result.err("An error occurred");
        expect(res.ok).toBe(false);
        if (!res.ok) {
            expect(res.error).toBe("An error occurred");
        }
    });

    it("should map errors correctly", () => {
        const res = Result.err("An error occurred");
        const mappedError = res.mapErr(err => `Error: ${err}`);

        expect(mappedError.ok).toBe(false);
        if (!mappedError.ok) {
            expect(mappedError.error).toBe("Error: An error occurred");
        }
    });

    it("should tap into values correctly", () => {
        const res = Result.ok("42");
        let tappedValue: string | undefined;

        const tapped = res.tap(value => {
            tappedValue = value;
        });

        expect(tapped.ok).toBe(true);
        if (tapped.ok) {
            expect(tapped.data).toBe("42");
            expect(tappedValue).toBe("42");
        }
    });

    it("should tap into errors correctly", () => {
        const res = Result.err("An error occurred");
        let tappedError: string | undefined;

        const tapped = res.tapErr(error => {
            tappedError = error;
        });

        expect(tapped.ok).toBe(false);
        if (!tapped.ok) {
            expect(tapped.error).toBe("An error occurred");
            expect(tappedError).toBe("An error occurred");
        }
    });

    it("should not map err on normal map", () => {
        const randomResult = Math.random() > 0.5 ? Result.ok(42) : Result.err("An error occurred");
        const mapped = randomResult.map(x => x + 1).mapErr(err => `Error: ${err}`);

        expect(mapped.ok).toBe(randomResult.ok);

        if (mapped.ok) {
            expect(mapped.data).toBe(43);
        } else {
            expect(mapped.error).toBe("Error: An error occurred");
        }
    });

    it("should not run mapErr on not error", () => {
        const ok = Result.ok(42);

        let value = 0;

        const res = ok
            .map(x => x + 1)
            .mapErr(err => {
                value = 1;
            });

        expect(res.ok).toBe(true);
        if (res.ok) {
            expect(res.data).toBe(43);
        }
        expect(value).toBe(0);
    });

    it("should chain methods correctly", () => {
        const res = Result.ok("42")
            .map(x => parseInt(x, 10))
            .tap(value => {
                expect(value).toBe(42);
            })
            .mapErr(err => `Error: ${err}`);

        expect(res.ok).toBe(true);
        if (res.ok) {
            expect(res.data).toBe(42);
        }
    });

    it("andThen should work with Ok", () => {
        const res = Result.ok("42").andThen(value => Result.ok(parseInt(value, 10)));

        expect(res.ok).toBe(true);
        if (res.ok) {
            expect(res.data).toBe(42);
        }
    });

    it("andThen should work with Err", () => {
        const res = Result.err("An error occurred").andThen(() => Result.ok(42));

        expect(res.ok).toBe(false);
        if (!res.ok) {
            expect(res.error).toBe("An error occurred");
        }
    });

    it("andThen should work with long chains", () => {
        const res = Result.ok("42")
            .andThen(value => Result.ok(parseInt(value, 10)))
            .andThen(value => Result.ok(value + 1));

        expect(res.ok).toBe(true);
        if (res.ok) {
            expect(res.data).toBe(43);
        }
    });

    it("should work if it breaks the chain", () => {
        const getError = (): ResultType<string, string> => Result.err("An error occurred");

        const res = Result.ok("42")
            .andThen(value => Result.ok(parseInt(value, 10)))
            .andThen(getError)
            .andThen(value => Result.ok(value + 1));

        expect(res.ok).toBe(false);
        if (!res.ok) {
            expect(res.error).toBe("An error occurred");
        }
    });

    it("should match Ok correctly", () => {
        const res = Result.ok("42");
        const result = res.match({
            Ok: data => `Value: ${data}`,
            Err: error => `Error: ${error}`,
        });

        expect(result).toBe("Value: 42");
    });

    it("should match Err correctly", () => {
        const res = Result.err("An error occurred");
        const result = res.match({
            Ok: data => `Value: ${data}`,
            Err: error => `Error: ${error}`,
        });

        expect(result).toBe("Error: An error occurred");
    });

    it("should handle chained with match", () => {
        const res = Result.ok("42")
            .andThen(value => Result.ok(parseInt(value, 10)))
            .andThen(value => Result.ok(value + 1))
            .match({
                Ok: data => `Value: ${data}`,
                Err: error => `Error: ${error}`,
            });

        expect(res).toBe("Value: 43");
    });

    it("can mix sync and async methods", async () => {
        const res = Result.ok("42")
            .andThen(value => Result.ok(parseInt(value, 10)))
            .andThen(value => Result.ok(value + 1))
            .mapAsync(async value => value * 2);

        const finalResult = await res;

        expect(finalResult.ok).toBe(true);
        if (finalResult.ok) {
            expect(finalResult.data).toBe(86);
        }
    });

    describe("unwrap", () => {
        it("should return the value for an Ok variant", () => {
            const okResult = Result.ok("success");
            expect(okResult.unwrap()).toBe("success");
        });

        it("should throw an error for an Err variant", () => {
            const errResult = Result.err("failure");
            expect(() => errResult.unwrap()).toThrow("Attempted to unwrap an Err: failure");
        });
    });

    describe("unwrapOr", () => {
        it("should return the value for an Ok variant", () => {
            const okResult = Result.ok("success");
            expect(okResult.unwrapOr("default")).toBe("success");
        });

        it("should return the default value for an Err variant", () => {
            const errResult = Result.err("failure");
            expect(errResult.unwrapOr("default")).toBe("default");
        });
    });

    describe("static", () => {
        describe("fromThrowable", () => {
            it("can wrap dangerous function", () => {
                const dangerousFunction = (x: number) => {
                    if (x < 0) {
                        throw new Error("Negative value not allowed");
                    }

                    return x * 2;
                };

                const safeFunction = Result.fromThrowable(dangerousFunction);

                const result = safeFunction(5);
                expect(result.ok).toBe(true);

                if (result.ok) {
                    expect(result.data).toBe(10);
                }

                const badResult = safeFunction(-5);

                expect(badResult.ok).toBe(false);
                if (!result.ok) {
                    const error = result.error as Error;
                    expect(error).toBeInstanceOf(Error);
                    expect(error.message).toBe("Negative value not allowed");
                }
            });

            it("can wrap JSON.parse", () => {
                const safeParse = Result.fromThrowable(JSON.parse);

                expect(safeParse('{"key": "value"}').ok).toBe(true);
                const parsed = safeParse('{"key": "value"}');

                expect(parsed.ok).toBe(true);

                if (parsed.ok) {
                    expect(parsed.data).toEqual({ key: "value" });
                }

                const failedParse = safeParse("tjenere");

                expect(failedParse.ok).toBe(false);

                if (!failedParse.ok) {
                    expect(failedParse.error).toBeInstanceOf(SyntaxError);
                }
            });

            it("can use the error handler", () => {
                const safeFunction = Result.fromThrowable(
                    (x: number) => {
                        if (x < 0) {
                            throw new Error("Negative value not allowed");
                        }
                        return x * 2;
                    },
                    error =>
                        `Custom error: ${error instanceof Error ? error.message : String(error)}`
                );

                const result = safeFunction(5);
                expect(result.ok).toBe(true);
                if (result.ok) {
                    expect(result.data).toBe(10);
                }

                const badResult = safeFunction(-5);
                expect(badResult.ok).toBe(false);
                if (!badResult.ok) {
                    expect(badResult.error).toBe("Custom error: Negative value not allowed");
                }
            });
        });

        describe("fromAsyncThrowable", () => {
            it("should resolve with the value when the promise resolves", async () => {
                const asyncFn = async () => 42;
                const result = await Result.fromAsyncThrowable(asyncFn)();

                expect(result.ok).toBe(true);
                if (result.ok) {
                    expect(result.data).toBe(42);
                }
            });

            it("should reject with the error when the promise rejects", async () => {
                const error = new Error("fail");
                const asyncFn = async () => {
                    throw error;
                };
                const result = await Result.fromAsyncThrowable(asyncFn)();

                expect(result.ok).toBe(false);
                if (!result.ok) {
                    expect(result.error).toBe(error);
                }
            });
        });
    });

    describe("async", () => {
        it("mapAsync should map Ok value asynchronously", async () => {
            const ok = Result.ok("42");
            const mapped = await ok.mapAsync(async x => parseInt(x, 10));
            expect(mapped.ok).toBe(true);
            if (mapped.ok) expect(mapped.data).toBe(42);
        });

        it("mapAsync should not map Err", async () => {
            const err = Result.err("fail");
            const mapped = await err.mapAsync(async x => 123);
            expect(mapped.ok).toBe(false);
            if (!mapped.ok) expect(mapped.error).toBe("fail");
        });

        it("mapErrAsync should map Err value asynchronously", async () => {
            const err = Result.err("fail");
            const mapped = await err.mapErrAsync(async e => `Error: ${e}`);
            expect(mapped.ok).toBe(false);
            if (!mapped.ok) expect(mapped.error).toBe("Error: fail");
        });

        it("mapErrAsync should not map Ok", async () => {
            const ok = Result.ok(42);
            const mapped = await ok.mapErrAsync(async e => "should not run");
            expect(mapped.ok).toBe(true);
            if (mapped.ok) expect(mapped.data).toBe(42);
        });

        it("tapAsync should call function on Ok", async () => {
            const ok = Result.ok("42");
            let called = false;
            const tapped = await ok.tapAsync(async value => {
                called = value === "42";
            });
            expect(called).toBe(true);
            expect(tapped.ok).toBe(true);
            if (tapped.ok) expect(tapped.data).toBe("42");
        });

        it("tapAsync should not call function on Err", async () => {
            const err = Result.err("fail");
            let called = false;
            const tapped = await err.tapAsync(async value => {
                called = true;
            });
            expect(called).toBe(false);
            expect(tapped.ok).toBe(false);
            if (!tapped.ok) expect(tapped.error).toBe("fail");
        });

        it("tapErrAsync should call function on Err", async () => {
            const err = Result.err("fail");
            let called = false;
            const tapped = await err.tapErrAsync(async error => {
                called = error === "fail";
            });
            expect(called).toBe(true);
            expect(tapped.ok).toBe(false);
            if (!tapped.ok) expect(tapped.error).toBe("fail");
        });

        it("tapErrAsync should not call function on Ok", async () => {
            const ok = Result.ok(42);
            let called = false;
            const tapped = await ok.tapErrAsync(async error => {
                called = true;
            });
            expect(called).toBe(false);
            expect(tapped.ok).toBe(true);
            if (tapped.ok) expect(tapped.data).toBe(42);
        });

        it("andThenAsync should chain Ok values asynchronously", async () => {
            const ok = Result.ok("42");
            const result = await ok.andThenAsync(async value => Result.ok(parseInt(value, 10)));
            expect(result.ok).toBe(true);
            if (result.ok) expect(result.data).toBe(42);
        });

        it("andThenAsync should not call function on Err", async () => {
            const err = Result.err("fail");
            let called = false;
            const result = await err.andThenAsync(async value => {
                called = true;
                return Result.ok(42);
            });
            expect(called).toBe(false);
            expect(result.ok).toBe(false);
            if (!result.ok) expect(result.error).toBe("fail");
        });
    });

    describe("type inference with mixed return types", () => {
        class AppError {
            constructor(
                public code: string,
                public message: string
            ) {}
        }

        function getOrder(id: number): ResultType<{ id: number; name: string }, AppError> {
            if (id <= 0) return Result.err(new AppError("NOT_FOUND", "Order not found"));
            return Result.ok({ id, name: "Test Order" });
        }

        function inferredGetOrder(id: number) {
            if (id <= 0) return Result.err(new AppError("NOT_FOUND", "Order not found"));
            return Result.ok({ id, name: "Test Order" });
        }

        function deleteOrder(id: number): ResultType<void, AppError> {
            if (id <= 0) return Result.err(new AppError("NOT_FOUND", "Order not found"));
            return Result.ok(undefined as void);
        }

        function validateOrder(id: number): ResultType<void, AppError> {
            if (id <= 0) return Result.err(new AppError("VALIDATION", "Invalid order"));
            return Result.ok(undefined as void);
        }

        it("should handle function returning object result", () => {
            const result = getOrder(1);
            expect(result.ok).toBe(true);
            if (result.ok) {
                expect(result.data).toEqual({ id: 1, name: "Test Order" });
            }
        });

        it("should handle inferred function returning object result", () => {
            const result = inferredGetOrder(1);
            expect(result.ok).toBe(true);
            if (result.ok) {
                expect(result.data).toEqual({ id: 1, name: "Test Order" });
            }
        });

        it("should handle function returning void result", () => {
            const result = deleteOrder(1);
            expect(result.ok).toBe(true);
            if (result.ok) {
                expect(result.data).toBeUndefined();
            }
        });

        it("should chain void result into object result", () => {
            const result = validateOrder(1).andThen(() => getOrder(1));
            expect(result.ok).toBe(true);
            if (result.ok) {
                expect(result.data).toEqual({ id: 1, name: "Test Order" });
            }
        });

        it("should propagate error from void result in chain", () => {
            const result = validateOrder(-1).andThen(() => getOrder(1));
            expect(result.ok).toBe(false);
            if (!result.ok) {
                expect(result.error).toBeInstanceOf(AppError);
                expect(result.error.code).toBe("VALIDATION");
            }
        });

        it("should handle early return pattern with different result types", () => {
            function processOrder(id: number): ResultType<{ id: number; name: string }, AppError> {
                const validation = validateOrder(id);
                if (!validation.ok) return validation;

                const order = getOrder(id);
                if (!order.ok) return order;

                return Result.ok(order.data);
            }

            const success = processOrder(1);
            expect(success.ok).toBe(true);
            if (success.ok) {
                expect(success.data).toEqual({ id: 1, name: "Test Order" });
            }

            const failure = processOrder(-1);
            expect(failure.ok).toBe(false);
            if (!failure.ok) {
                expect(failure.error.code).toBe("VALIDATION");
            }
        });

        it("should allow returning Err<AppError> where ResultType<T, AppError> is expected", () => {
            function getOrDelete(
                id: number,
                del: boolean
            ): ResultType<{ id: number; name: string }, AppError> {
                if (del) {
                    const deleted = deleteOrder(id);
                    if (!deleted.ok) return deleted;
                    return Result.ok({ id, name: "Deleted" });
                }
                return getOrder(id);
            }

            const result = getOrDelete(1, true);
            expect(result.ok).toBe(true);
            if (result.ok) {
                expect(result.data.name).toBe("Deleted");
            }

            const errResult = getOrDelete(-1, true);
            expect(errResult.ok).toBe(false);
        });

        it("should match on result from mixed-return function", () => {
            function doWork(id: number): ResultType<{ id: number; name: string }, AppError> {
                const v = validateOrder(id);
                if (!v.ok) return v;
                return getOrder(id);
            }

            const message = doWork(-1).match({
                Ok: data => `Got: ${data.name}`,
                Err: err => `Failed: ${err.code}`,
            });

            expect(message).toBe("Failed: VALIDATION");
        });
    });

    describe("type tests", () => {
        class AppError {
            constructor(
                public code: string,
                public message: string
            ) {}
        }

        it("Ok<T> has no phantom E type parameter", () => {
            const ok = Result.ok({ id: 1, name: "test" });
            expectTypeOf(ok).toEqualTypeOf<Ok<{ id: number; name: string }>>();
        });

        it("Err<E> has no phantom T type parameter", () => {
            const err = Result.err(new AppError("FAIL", "failed"));
            expectTypeOf(err).toEqualTypeOf<Err<AppError>>();
        });

        it("early return Err narrows correctly", () => {
            function process(): ResultType<{ id: number }, AppError> {
                const validation: ResultType<void, AppError> = Result.ok(undefined as void);
                if (!validation.ok) return validation;

                // After narrowing, we know validation is Ok<void>
                expectTypeOf(validation).toEqualTypeOf<Ok<void>>();
                return Result.ok({ id: 1 });
            }

            process();
        });

        it("map transforms Ok type without affecting Err type", () => {
            const ok = Result.ok("42");
            const mapped = ok.map(x => parseInt(x, 10));
            expectTypeOf(mapped).toEqualTypeOf<Ok<number>>();
        });

        it("mapErr transforms Err type without affecting Ok type", () => {
            const err = Result.err("fail");
            const mapped = err.mapErr(e => new AppError("X", e));
            expectTypeOf(mapped).toEqualTypeOf<Err<AppError>>();
        });

        it("andThen infers correct union type", () => {
            const result = Result.ok("42").andThen(v => {
                if (v === "42") return Result.ok(42);
                return Result.err(new AppError("PARSE", "not a number"));
            });
            expectTypeOf(result).toEqualTypeOf<ResultType<number, AppError>>();
        });

        it("unwrapOr returns T | U", () => {
            const result: ResultType<number, AppError> = Result.ok(42);
            const value = result.unwrapOr("default");
            expectTypeOf(value).toEqualTypeOf<number | string>();
        });

        it("ResultType<void, E> error is assignable to ResultType<T, E>", () => {
            function deleteItem(): ResultType<void, AppError> {
                return Result.err(new AppError("NOT_FOUND", "missing"));
            }

            function getItem(): ResultType<{ name: string }, AppError> {
                const del = deleteItem();
                if (!del.ok) return del;
                return Result.ok({ name: "item" });
            }

            // This test passes if it compiles — the assignment in getItem() is the real test
            const result = getItem();
            expectTypeOf(result).toEqualTypeOf<ResultType<{ name: string }, AppError>>();
        });
    });
});
