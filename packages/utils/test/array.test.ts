import { describe, expect, expectTypeOf, it } from "vitest";
import {
    chunk,
    compact,
    difference,
    first,
    groupBy,
    includes,
    intersection,
    last,
    move,
    partition,
    range,
    remove,
    sample,
    shuffle,
    sortBy,
    take,
    toArray,
    union,
    uniq,
    uniqBy,
    zip,
} from "../src/utils/array";

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

    it("take", () => {
        expect(take([1, 2, 3], 1)).toEqual([1]);
        expect(take([1, 2, 3], 2)).toEqual([1, 2]);
        expect(take([1, 2, 3], 3)).toEqual([1, 2, 3]);
        expect(take([1, 2, 3], 4)).toEqual([1, 2, 3]);
        expect(take([1, 2, 3], 0)).toEqual([]);
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

    it("uniqBy", () => {
        expect(uniqBy([1, 2, 3, 1, 2, 3], x => x)).toEqual([1, 2, 3]);

        const a = { age: 10, name: "jack" };
        const b = { age: 20, name: "jack" };
        const c = { age: 10, name: "john" };

        expect(uniqBy([a, b, c], x => x.age)).toEqual([a, b]);
        expect(uniqBy([a, b, c], x => x.name)).toEqual([a, c]);

        expect(uniqBy([a, b, c], "age")).toEqual([a, b]);
        expect(uniqBy([a, b, c], "name")).toEqual([a, c]);
    });

    it("shuffle", () => {
        expect(shuffle([1, 2, 3, 4, 5])).not.toEqual([1, 2, 3, 4, 5]);
        expect(shuffle([1, 2, 3, 4, 5]).length).toBe(5);
    });

    it("chunk", () => {
        expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
        expect(chunk([1, 2, 3, 4, 5], 3)).toEqual([
            [1, 2, 3],
            [4, 5],
        ]);
        expect(chunk([1, 2, 3, 4, 5], 5)).toEqual([[1, 2, 3, 4, 5]]);
        expect(chunk([1, 2, 3, 4, 5], 6)).toEqual([[1, 2, 3, 4, 5]]);
        expect(chunk([1, 2, 3, 4, 5], 1)).toEqual([[1], [2], [3], [4], [5]]);
        expect(chunk([1, 2, 3, 4, 5], 0)).toEqual([]);
        expect(chunk([1, 2, 3, 4, 5], -1)).toEqual([]);
        expect(chunk([], 2)).toEqual([]);
        expect(chunk([1], 2)).toEqual([[1]]);
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
        expect(compact([1, 2, 3])).toEqual([1, 2, 3]);
        expect(compact([1, 2, 3, null])).toEqual([1, 2, 3]);
        expect(compact([1, 2, 3, undefined])).toEqual([1, 2, 3]);
        expect(compact([1, 2, 3, null, undefined])).toEqual([1, 2, 3]);
        expect(compact([1, 2, 3, null, undefined, 0])).toEqual([1, 2, 3]);
    });

    it("difference", () => {
        expect(difference([1, 2, 3], [1, 2])).toEqual([3]);
        expect(difference([1, 2, 3], [1, 2, 3])).toEqual([]);
        expect(difference([1, 2, 3], [1, 2, 3, 4])).toEqual([]);
        expect(difference([1, 2, 3], [4])).toEqual([1, 2, 3]);

        expect(difference(["a", "b", "c"], ["a", "b"])).toEqual(["c"]);
        expect(difference(["a", "b", "c"], ["a", "b", "c"])).toEqual([]);
        expect(difference(["a", "b", "c"], ["a", "b", "c", "d"])).toEqual([]);
        expect(difference(["a", "b", "c"], ["d"])).toEqual(["a", "b", "c"]);

        expect(difference([{ a: 1 }, { a: 2 }, { a: 3 }], [{ a: 1 }, { a: 2 }])).toEqual([
            { a: 3 },
        ]);
        expect(difference([{ a: 1 }, { a: 2 }, { a: 3 }], [{ a: 1 }, { a: 2 }, { a: 3 }])).toEqual(
            []
        );
        expect(
            difference([{ a: 1 }, { a: 2 }, { a: 3 }], [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }])
        ).toEqual([]);
        expect(difference([{ a: 1 }, { a: 2 }, { a: 3 }], [{ a: 4 }])).toEqual([
            { a: 1 },
            { a: 2 },
            { a: 3 },
        ]);
    });

    it("intersection", () => {
        expect(intersection([1, 2, 3], [1, 2])).toEqual([1, 2]);
        expect(intersection([1, 2, 3], [1, 2, 3])).toEqual([1, 2, 3]);
        expect(intersection([1, 2, 3], [1, 2, 3, 4])).toEqual([1, 2, 3]);
        expect(intersection([1, 2, 3], [4])).toEqual([]);

        expect(intersection(["a", "b", "c"], ["a", "b"])).toEqual(["a", "b"]);
        expect(intersection(["a", "b", "c"], ["a", "b", "c"])).toEqual(["a", "b", "c"]);
        expect(intersection(["a", "b", "c"], ["a", "b", "c", "d"])).toEqual(["a", "b", "c"]);
        expect(intersection(["a", "b", "c"], ["d"])).toEqual([]);

        expect(intersection([{ a: 1 }, { a: 2 }, { a: 3 }], [{ a: 1 }, { a: 2 }])).toEqual([
            { a: 1 },
            { a: 2 },
        ]);
        expect(
            intersection([{ a: 1 }, { a: 2 }, { a: 3 }], [{ a: 1 }, { a: 2 }, { a: 3 }])
        ).toEqual([{ a: 1 }, { a: 2 }, { a: 3 }]);
        expect(
            intersection([{ a: 1 }, { a: 2 }, { a: 3 }], [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }])
        ).toEqual([{ a: 1 }, { a: 2 }, { a: 3 }]);
        expect(intersection([{ a: 1 }, { a: 2 }, { a: 3 }], [{ a: 4 }])).toEqual([]);
    });

    it("union", () => {
        expect(union([1, 2, 3], [1, 2])).toEqual([1, 2, 3]);
        expect(union([1, 2, 3], [1, 2, 3])).toEqual([1, 2, 3]);
        expect(union([1, 2, 3], [1, 2, 3, 4])).toEqual([1, 2, 3, 4]);

        const a = { a: 1 };
        const b = { a: 2 };
        const c = { a: 3 };
        const d = { a: 3 };

        expect(union([a, b, c], [a, b])).toEqual([a, b, c]);
        expect(union([a, b, c], [a, b, c])).toEqual([a, b, c]);
        expect(union([a, b, c], [a, b, c, d])).toEqual([a, b, c, d]);
    });

    it("sortBy", () => {
        const a = { name: "a", age: 10 };
        const b = { name: "a", age: 20 };
        const c = { name: "b", age: 10 };
        const d = { name: "b", age: 20 };

        // asc
        expect(sortBy([a, b, c, d], "name")).toEqual([a, b, c, d]);
        expect(sortBy([a, b, c, d], "age")).toEqual([a, c, b, d]);
        expect(sortBy([a, b, c, d], ["name", "age"])).toEqual([a, b, c, d]);
        expect(sortBy([a, b, c, d], ["age", "name"])).toEqual([a, c, b, d]);
        expect(sortBy([b, c, d, a], ["name", "age"])).toEqual([a, b, c, d]);
        expect(sortBy([a, b, c, d], x => x.name)).toEqual([a, b, c, d]);
        expect(sortBy([a, b, c, d], x => x.age)).toEqual([a, c, b, d]);

        // desc
        expect(sortBy([a, b, c, d], "name", "desc")).toEqual([c, d, a, b]);
        expect(sortBy([a, b, c, d], "age", "desc")).toEqual([b, d, a, c]);
        expect(sortBy([a, b, c, d], ["name", "age"], "desc")).toEqual([d, c, b, a]);
        expect(sortBy([a, b, c, d], ["age", "name"], "desc")).toEqual([d, b, c, a]);
        expect(sortBy([b, c, d, a], ["name", "age"], "desc")).toEqual([d, c, b, a]);
        expect(sortBy([a, b, c, d], x => x.name, "desc")).toEqual([c, d, a, b]);
        expect(sortBy([a, b, c, d], x => x.age, "desc")).toEqual([b, d, a, c]);

        const a1 = { name: "Alex", age: 20 };
        const b1 = { name: "Alex", age: 15 };
        const c1 = { name: "Bony", age: 5 };

        expect(sortBy([a1, b1, c1], ["name", "age"])).toEqual([b1, a1, c1]); // returns [a, c, b]
    });

    it("groupBy", () => {
        const a = { name: "a", age: 10 };
        const b = { name: "a", age: 20 };
        const c = { name: "b", age: 10 };
        const d = { name: "b", age: 20 };

        // group by string
        expect(groupBy([a, b, c, d], "name")).toEqual({
            a: [a, b],
            b: [c, d],
        });
        expect(groupBy([a, b, c, d], "age")).toEqual({
            10: [a, c],
            20: [b, d],
        });

        // group by function
        expect(groupBy([a, b, c, d], x => x.name)).toEqual({
            a: [a, b],
            b: [c, d],
        });

        expect(groupBy([a, b, c, d], x => x.age)).toEqual({
            10: [a, c],
            20: [b, d],
        });
    });

    it("includes", () => {
        const values = ["a", "b", "c"] as const;
        expect(includes(values, "a")).toBe(true);

        const values2 = [1, 2, 3] as const;
        const expectedValue: unknown = 1;

        expectTypeOf(expectedValue).toEqualTypeOf<unknown>();
        if (includes(values2, expectedValue)) {
            expectTypeOf(expectedValue).toEqualTypeOf<(typeof values2)[number]>();
        }
    });

    it("zip", () => {
        const a = [1, 2, 3];
        const b = ["a", "b", "c"];

        expect(zip(a, b)).toEqual([
            [1, "a"],
            [2, "b"],
            [3, "c"],
        ]);

        expect(zip(a, b, [true, false, true])).toEqual([
            [1, "a", true],
            [2, "b", false],
            [3, "c", true],
        ]);

        expect(zip(a, b, [true, false, true], [1, 2, 3])).toEqual([
            [1, "a", true, 1],
            [2, "b", false, 2],
            [3, "c", true, 3],
        ]);
    });

    it("partition", () => {
        const a = [1, 2, 3];
        expect(partition(a, x => x > 2)).toEqual([[3], [1, 2]]);

        const b = ["a", "b", "c"];
        expect(partition(b, x => x === "a")).toEqual([["a"], ["b", "c"]]);

        const c = [{ a: 1 }, { a: 2 }, { a: 3 }];
        expect(partition(c, x => x.a > 2)).toEqual([[{ a: 3 }], [{ a: 1 }, { a: 2 }]]);

        const d = [
            { name: "john", age: 10 },
            { name: "john", age: 20 },
            { name: "jack", age: 10 },
        ];
        expect(partition(d, x => x.name === "john")).toEqual([
            [
                { name: "john", age: 10 },
                { name: "john", age: 20 },
            ],
            [{ name: "jack", age: 10 }],
        ]);
    });
});
