import { describe, expect, expectTypeOf, it } from "vitest";
import { attempt, attemptAsync, createMockCreator, wrap, wrapAsync } from "../src/utils/test";

describe("test", () => {
    it("attempt", () => {
        expect(attempt(() => 1)).toBe(1);
        expect(
            attempt(() => {
                throw new Error("test");
            })
        ).toBe(undefined);
        expect(
            attempt(
                () => {
                    throw new Error("test");
                },
                { fallbackValue: 1 }
            )
        ).toBe(1);
        expect(
            attempt(
                () => {
                    throw new Error("test");
                },
                { fallbackValue: 1, logError: false }
            )
        ).toBe(1);
    });

    it("attemptAsync", async () => {
        expect(await attemptAsync(() => Promise.resolve(1))).toBe(1);
        expect(await attemptAsync(() => Promise.reject(new Error("test2")))).toBe(undefined);
        expect(
            await attemptAsync(() => Promise.reject(new Error("test")), { fallbackValue: 1 })
        ).toBe(1);
        expect(
            await attemptAsync(() => Promise.reject(new Error("test")), {
                fallbackValue: 1,
                logError: false,
            })
        ).toBe(1);
    });

    it("wrap", () => {
        expect(wrap(() => 1)).toStrictEqual([1, undefined]);
        expect(
            wrap(() => {
                throw new Error("test");
            })
        ).toStrictEqual([undefined, new Error("test")]);

        const [res, err] = wrap(() => 1);
        expectTypeOf(res).toEqualTypeOf<number | undefined>();
        expectTypeOf(err).toEqualTypeOf<Error | undefined>();

        if (err) {
            expectTypeOf(err).toEqualTypeOf<Error>();
        } else {
            expectTypeOf(res).toEqualTypeOf<number>();
        }
    });

    it("wrapAsync", async () => {
        expect(await wrapAsync(() => Promise.resolve(1))).toStrictEqual([1, undefined]);
        expect(await wrapAsync(() => Promise.reject(new Error("test")))).toStrictEqual([
            undefined,
            new Error("test"),
        ]);

        const [res, err] = await wrapAsync(() => Promise.resolve(1));
        expectTypeOf(res).toEqualTypeOf<number | undefined>();
        expectTypeOf(err).toEqualTypeOf<Error | undefined>();

        if (err) {
            expectTypeOf(err).toEqualTypeOf<Error>();
        } else {
            expectTypeOf(res).toEqualTypeOf<number>();
        }
    });

    it("createMockCreator", () => {
        // normal
        const numbersMock = { a: 1, b: 2, c: 3 };
        const updatedData = { a: 2 };
        const createNumbersMock = createMockCreator(numbersMock);

        const mock = createNumbersMock(updatedData);
        expect(mock).toEqual({ a: 2, b: 2, c: 3 });

        // deep
        const numbersMock2 = { a: 1, b: 2, c: { d: 3 } };
        const updatedData2 = { a: 2, c: { d: 4 } };
        const createNumbersMock2 = createMockCreator(numbersMock2);

        const mock2 = createNumbersMock2(updatedData2);
        expect(mock2).toEqual({ a: 2, b: 2, c: { d: 4 } });

        // should replace arrays and such
        const objectMock = { a: 1, b: 2, c: [1, 2, 3] };
        const updatedData3 = { a: 2, c: [4] };

        const createObjectMock = createMockCreator(objectMock);
        const mock3 = createObjectMock(updatedData3);
        expect(mock3).toEqual({ a: 2, b: 2, c: [4] });
    });
});
