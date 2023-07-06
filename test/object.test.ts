import { describe, expect, it } from "vitest";
import {
    createMockCreator,
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
        const obj2 = { a: 2, d: 4 };
        const obj3 = { a: 2, d: 5, e: { f: 5 } };

        const res = merge(obj, obj2);
        expect(res).toEqual({ a: 2, b: 2, c: 3, d: 4 });

        const res2 = merge(obj, obj3);
        expect(res2).toEqual({ a: 2, b: 2, c: 3, d: 5, e: { f: 5 } });

        const res3 = merge(obj, obj2, obj3);
        expect(res3).toEqual({ a: 2, b: 2, c: 3, d: 5, e: { f: 5 } });
    });

    it("flip", () => {
        const obj = { a: 1, b: 2, c: 3 };
        const res = flip(obj);
        expect(res).toEqual({ 1: "a", 2: "b", 3: "c" });

        const obj2 = { a: 1, b: 2, c: 3, d: 1 };
        const res2 = flip(obj2);
        expect(res2).toEqual({ 1: "d", 2: "b", 3: "c" });
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
