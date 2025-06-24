import { Result, ResultType } from "src/utils/result";
import { describe, expect, it } from "vitest";

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
});
