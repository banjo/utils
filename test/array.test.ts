import {
    first,
    last,
    toArray,
    uniq,
    range,
    move,
    sample,
    remove,
    compact,
} from "../src/utils/array";
import { it, describe, expect } from "vitest";

describe("array", () => {
    it("first", () => {
        expect(first([1, 2, 3])).toBe(1);
        expect(first([1])).toBe(1);
        expect(first([])).toBe(undefined);
    });

    it("last", () => {
        expect(last([1, 2, 3])).toBe(3);
        expect(last([1])).toBe(1);
        expect(last([])).toBe(undefined);
    });

    it("toArray", () => {
        expect(toArray(1)).toEqual([1]);
        expect(toArray([1])).toEqual([1]);
        expect(toArray([])).toEqual([]);
        expect(toArray(null)).toEqual([]);
        expect(toArray(undefined)).toEqual([]);
        expect(toArray("1")).toEqual(["1"]);
    });

    it("uniq", () => {
        expect(uniq([1, 2, 3, 1, 2, 3])).toEqual([1, 2, 3]);
        expect(uniq([1, 2, 3])).toEqual([1, 2, 3]);
        expect(uniq([])).toEqual([]);
        expect(uniq([1])).toEqual([1]);
        expect(uniq([1, 1])).toEqual([1]);
    });

    it("range", () => {
        expect(range(0)).toEqual([]);
        expect(range(1)).toEqual([0]);
        expect(range(2)).toEqual([0, 1]);
        expect(range(3)).toEqual([0, 1, 2]);

        expect(range(0, 5)).toEqual([0, 1, 2, 3, 4]);
        expect(range(1, 5)).toEqual([1, 2, 3, 4]);
        expect(range(2, 5)).toEqual([2, 3, 4]);

        expect(range(0, 5, 2)).toEqual([0, 2, 4]);
        expect(range(1, 5, 2)).toEqual([1, 3]);
        expect(range(2, 5, 2)).toEqual([2, 4]);
    });

    it("move", () => {
        expect(move([1, 2, 3], 0, 1)).toEqual([2, 1, 3]);
        expect(move([1, 2, 3], 0, 2)).toEqual([2, 3, 1]);
        expect(move([1, 2, 3], 1, 0)).toEqual([2, 1, 3]);
        expect(move([1, 2, 3], 1, 2)).toEqual([1, 3, 2]);
        expect(move([1, 2, 3], 2, 0)).toEqual([3, 1, 2]);
        expect(move([1, 2, 3], 2, 1)).toEqual([1, 3, 2]);
    });

    it("sample", () => {
        const arr = [1, 2, 3];
        const result = range(100).map(() => sample(arr));
        expect(result).toContain(1);
        expect(result).toContain(2);
        expect(result).toContain(3);
    });

    it("remove", () => {
        expect(remove([1, 2, 3], 1)).toEqual([2, 3]);
        expect(remove([1, 2, 3], 2)).toEqual([1, 3]);
        expect(remove([1, 2, 3], 3)).toEqual([1, 2]);
        expect(remove([1, 2, 3], 4)).toEqual([1, 2, 3]);
    });

    it("compact", () => {
        expect(expect(compact([1, 2, 3])).toEqual([1, 2, 3]));
        expect(expect(compact([1, 2, 3, null])).toEqual([1, 2, 3]));
        expect(expect(compact([1, 2, 3, undefined])).toEqual([1, 2, 3]));
        expect(expect(compact([1, 2, 3, null, undefined])).toEqual([1, 2, 3]));
        expect(
            expect(compact([1, 2, 3, null, undefined, 0])).toEqual([1, 2, 3])
        );
    });
});
