import { describe, expect, expectTypeOf, it } from "vitest";
import {
    attempt,
    attemptSync,
    createMockCreator,
    to,
    toSync,
    wrap,
    wrapAsync,
} from "../src/utils/test";

describe("test", () => {
    it("attemptSync", () => {
        expect(attemptSync(() => 1)).toBe(1);
        expect(
            attemptSync(() => {
                throw new Error("test");
            })
        ).toBe(undefined);
        expect(
            attemptSync(
                () => {
                    throw new Error("test");
                },
                { fallbackValue: 1 }
            )
        ).toBe(1);
        expect(
            attemptSync(
                () => {
                    throw new Error("test");
                },
                { fallbackValue: 1, logError: false }
            )
        ).toBe(1);
    });

    it("attempt", async () => {
        expect(await attempt(() => Promise.resolve(1))).toBe(1);
        expect(await attempt(() => Promise.reject(new Error("test2")))).toBe(undefined);
        expect(await attempt(() => Promise.reject(new Error("test")), { fallbackValue: 1 })).toBe(
            1
        );
        expect(
            await attempt(() => Promise.reject(new Error("test")), {
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

    it("toSync", () => {
        expect(toSync(() => 1)).toStrictEqual([null, 1]);
        expect(
            toSync(() => {
                throw new Error("test");
            })
        ).toStrictEqual([new Error("test"), null]);

        const [err, res] = toSync(() => 1);
        expectTypeOf(res).toEqualTypeOf<number | null>();
        expectTypeOf(err).toEqualTypeOf<Error | null>();

        if (err) {
            expectTypeOf(err).toEqualTypeOf<Error>();
        } else {
            expectTypeOf(res).toEqualTypeOf<number>();
        }
    });

    it("to", async () => {
        expect(await to(() => Promise.resolve(1))).toStrictEqual([null, 1]);
        expect(
            await to(() => Promise.reject(new Error("test"))).then(res => res.map(String))
        ).toStrictEqual(["Error: test", "null"]);

        const [err, res] = await to(() => Promise.resolve(1));
        expectTypeOf(res).toEqualTypeOf<number | null>();
        expectTypeOf(err).toEqualTypeOf<Error | null>();

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

        // should not replace array even though it's empty
        const objectMock2 = { a: 1, b: 2, c: [1] };
        const updatedData4 = { a: 2, c: [] };

        const createObjectMock2 = createMockCreator(objectMock2);
        const mock4 = createObjectMock2(updatedData4);

        expect(mock4).toEqual({ a: 2, b: 2, c: [] });
    });
});
