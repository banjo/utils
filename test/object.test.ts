import { describe, expect, it } from "vitest";
import {
    clone,
    defaults,
    flip,
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
        const unaffectedObj = structuredClone(obj);
        const obj2 = { a: 2, d: 4 };
        const obj3 = { a: 2, d: 5, e: { f: 5 } };

        const res = merge(obj, obj2);

        expect(obj).toEqual(unaffectedObj);
        expect(res).toEqual({ a: 2, b: 2, c: 3, d: 4 });

        const res2 = merge(obj, obj3);
        expect(obj).toEqual(unaffectedObj);
        expect(res2).toEqual({ a: 2, b: 2, c: 3, d: 5, e: { f: 5 } });

        const res3 = merge(obj, obj2, obj3);
        expect(obj).toEqual(unaffectedObj);
        expect(res3).toEqual({ a: 2, b: 2, c: 3, d: 5, e: { f: 5 } });

        const res4 = merge({ a: [] }, { b: 2 });
        expect(res4).toEqual({ a: [], b: 2 });
    });

    it("clone", () => {
        const obj = { a: 1, b: 2, c: 3 };
        const res = clone(obj);
        expect(res).toEqual({ a: 1, b: 2, c: 3 });
        expect(res).not.toBe(obj);

        const obj2 = { a: 1, b: 2, c: 3 };
        const cloned = clone(obj2);
        cloned.a = 2;
        expect(obj2.a).toEqual(1);
        expect(cloned.a).toEqual(2);
        expect(cloned).toEqual({ a: 2, b: 2, c: 3 });
        expect(cloned).not.toBe(obj2);
    });

    it("defaults", () => {
        const obj = { a: 1, b: 2, c: 3 };
        const obj2 = { a: 2, d: 4 };
        const obj3 = { a: 2, d: 5, e: { f: 5 } };

        expect(defaults(obj, obj2)).toEqual({ a: 1, b: 2, c: 3, d: 4 });
        expect(defaults(obj, obj3)).toEqual({ a: 1, b: 2, c: 3, d: 5, e: { f: 5 } });
        expect(defaults(obj2, obj3)).toEqual({ a: 2, d: 4, e: { f: 5 } });
        expect(defaults(obj3, obj)).toEqual({ a: 2, b: 2, c: 3, d: 5, e: { f: 5 } });

        expect(obj).toEqual({ a: 1, b: 2, c: 3 });
    });

    it("flip", () => {
        const obj = { a: 1, b: 2, c: 3 };
        const res = flip(obj);
        expect(res).toEqual({ 1: "a", 2: "b", 3: "c" });

        const obj2 = { a: 1, b: 2, c: 3, d: 1 };
        const res2 = flip(obj2);
        expect(res2).toEqual({ 1: "d", 2: "b", 3: "c" });
    });
});
