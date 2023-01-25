import { describe, expect, it, assertType, expectTypeOf } from "vitest";
import {
    merge,
    objectEntries,
    objectKeys,
    objectValues,
} from "../src/utils/object";

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

    it("merge", () => {
        const obj = { a: 1, b: 2, c: 3 };
        const obj2 = { a: 2, d: 4 };
        const obj3 = { a: 2, d: 5, e: { f: 5 } };

        const res = merge(obj, obj2);
        expect(res).toEqual({ a: 2, b: 2, c: 3, d: 4 });

        const res2 = merge(obj, obj3);
        expect(res2).toEqual({ a: 2, b: 2, c: 3, d: 5, e: { f: 5 } });

        const res3 = merge(obj, obj2, obj3);
        expect(res3).toEqual({ a: 2, b: 2, c: 3, d: 5, e: { f: 5 } });
    });
});
