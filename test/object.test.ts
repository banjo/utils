import { describe, expect, it, assertType, expectTypeOf } from "vitest";
import { objectEntries, objectKeys, objectValues } from "../src/utils/object";

describe("object", () => {
    it("objectKeys", () => {
        const obj = { a: 1, b: 2, c: 3 };
        expect(objectKeys(obj)).toEqual(["a", "b", "c"]);
        expect(objectKeys({})).toEqual([]);

        const res = objectKeys(obj);
    });

    it("objectValues", () => {
        const obj = { a: 1, b: 2, c: 3 };
        expect(objectValues(obj)).toEqual([1, 2, 3]);
        expect(objectValues({})).toEqual([]);
    });

    it("objectEntries", () => {
        const obj = { a: 1, b: 2, c: 3 };
        expect(objectEntries(obj)).toEqual([
            ["a", 1],
            ["b", 2],
            ["c", 3],
        ]);
        expect(objectEntries([])).toEqual([]);
    });
});
