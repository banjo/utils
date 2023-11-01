import { describe, expect, it } from "vitest";
import { createMockCreator, tryOrDefault, tryOrDefaultAsync } from "../src/utils/test";

describe("test", () => {
    it("tryOrDefault", () => {
        expect(tryOrDefault(() => 1)).toBe(1);
        expect(
            tryOrDefault(() => {
                throw new Error("test");
            })
        ).toBe(undefined);
        expect(
            tryOrDefault(
                () => {
                    throw new Error("test");
                },
                { fallbackValue: 1 }
            )
        ).toBe(1);
        expect(
            tryOrDefault(
                () => {
                    throw new Error("test");
                },
                { fallbackValue: 1, logError: true }
            )
        ).toBe(1);
    });

    it("tryOrDefaultAsync", async () => {
        expect(await tryOrDefaultAsync(() => Promise.resolve(1))).toBe(1);
        expect(await tryOrDefaultAsync(() => Promise.reject(new Error("test")))).toBe(undefined);
        expect(
            await tryOrDefaultAsync(() => Promise.reject(new Error("test")), { fallbackValue: 1 })
        ).toBe(1);
        expect(
            await tryOrDefaultAsync(() => Promise.reject(new Error("test")), {
                fallbackValue: 1,
                logError: true,
            })
        ).toBe(1);
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
    });
});
