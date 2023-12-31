import { describe, expect, it } from "vitest";
import { ObjectSet } from "../src/utils/set";

describe("ObjectSet", () => {
    it("can be used with generics", () => {
        const set = new ObjectSet<string>();
        expect(set).toBeDefined();
    });

    it("works with objects", () => {
        const set = new ObjectSet<{ a: number }>();
        const key = { a: 1 };
        const value = { a: 2 };

        set.add(key);
        expect(set.has(key)).toBe(true);
        expect(set.has(value)).toBe(false);

        set.add(value);
        expect(set.has(value)).toBe(true);
        expect(set.size).toBe(2);
        expect(set.values).toEqual([key, value]);

        set.remove(key);
        expect(set.has(key)).toBe(false);
        expect(set.has(value)).toBe(true);
        expect(set.size).toBe(1);
    });

    it("should not base on reference", () => {
        type Point = {
            x: number;
            y: number;
        };

        const set = new ObjectSet<Point>();

        const point1 = { x: 1, y: 1 };
        const point2 = { x: 1, y: 1 };

        set.add(point1);
        expect(set.has(point1)).toBe(true);
        expect(set.has(point2)).toBe(true);
        expect(set.size).toBe(1);

        set.remove(point2);
        expect(set.has(point1)).toBe(false);
        expect(set.has(point2)).toBe(false);
    });

    it("order of keys should not matter", () => {
        const set = new ObjectSet<{ a: number; b: number }>();

        const key1 = { a: 1, b: 2 };
        const key2 = { b: 2, a: 1 };

        set.add(key1);
        expect(set.has(key1)).toBe(true);
        expect(set.has(key2)).toBe(true);
        expect(set.size).toBe(1);

        set.remove(key2);
        expect(set.has(key1)).toBe(false);
        expect(set.has(key2)).toBe(false);
    });

    it("order of array should not be affected when removing", () => {
        type Point = {
            x: number;
            y: number;
        };

        const set = new ObjectSet<Point>();

        const point1 = { x: 1, y: 1 };
        const point2 = { x: 2, y: 2 };
        const point3 = { x: 3, y: 3 };
        const point4 = { x: 4, y: 4 };
        const point5 = { x: 5, y: 5 };
        const point6ButSame = { x: 5, y: 5 };

        set.add(point1);
        set.add(point2);
        set.add(point3);
        set.add(point4);
        set.add(point5);
        set.add(point6ButSame);

        expect(set.values).toEqual([point1, point2, point3, point4, point5]);
        expect(set.size).toBe(5);

        set.remove(point3);
        expect(set.values).toEqual([point1, point2, point4, point5]);
    });

    it("should be able to iterate", () => {
        const set = new ObjectSet<number>();

        set.add(1);
        set.add(2);
        set.add(3);

        const values: number[] = [];

        for (const value of set) {
            values.push(value);
        }

        expect(values).toEqual([1, 2, 3]);
    });

    it("should be able to iterate with objects", () => {
        const set = new ObjectSet<{ a: number }>();

        const key1 = { a: 1 };
        const key2 = { a: 2 };
        const key3 = { a: 3 };

        set.add(key1);
        set.add(key2);
        set.add(key3);

        const values: { a: number }[] = [];

        for (const value of set) {
            values.push(value);
        }

        expect(values).toEqual([key1, key2, key3]);
    });

    it("should be able to initiate with array", () => {
        const point1 = { x: 1, y: 1 };
        const point2 = { x: 2, y: 2 };
        const point3 = { x: 3, y: 3 };
        const point3ButSame = { x: 3, y: 3 };

        const set = new ObjectSet([point1, point2, point3, point3ButSame]);

        expect(set.size).toBe(3);
        expect(set.has(point1)).toBe(true);
        expect(set.has(point2)).toBe(true);
        expect(set.has(point3)).toBe(true);
        expect(set.has(point3ButSame)).toBe(true);

        expect(set.values).toEqual([point1, point2, point3]);
    });

    it("can be used to make array unique", () => {
        const point1 = { x: 1, y: 1 };
        const point2 = { x: 2, y: 2 };
        const point3 = { x: 3, y: 3 };
        const point3ButSame = { x: 3, y: 3 };

        const uniqeArray = [...new ObjectSet([point1, point2, point3, point3ButSame])];
        expect(uniqeArray).toEqual([point1, point2, point3]);
    });
});
