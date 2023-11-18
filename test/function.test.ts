import { describe, expect, it, vi } from "vitest";
import { batchInvoke, invariant, memoize, noop, produce, raise } from "../src";

describe("function", () => {
    it("batchInvoke", () => {
        const fn = vi.fn();
        const fn2 = vi.fn();
        const fn3 = vi.fn();
        batchInvoke([fn, fn2, fn3]);
        expect(fn).toHaveBeenCalledTimes(1);
        expect(fn2).toHaveBeenCalledTimes(1);
        expect(fn3).toHaveBeenCalledTimes(1);
    });

    it("noop", () => {
        expect(noop()).toBe(undefined);
    });

    it("memoize", () => {
        const fn = vi.fn();
        const memoized = memoize(fn);
        memoized();
        memoized();
        memoized();
        expect(fn).toHaveBeenCalledTimes(1);
        memoized(1);
        memoized(1);
        memoized(1);
        expect(fn).toHaveBeenCalledTimes(2);
    });

    it("raise", () => {
        expect(() => raise("test")).toThrow("test");
        expect(() => {
            const variable = null;

            const test = variable ?? raise("variable is null");
        }).toThrow("variable is null");
    });

    it("invariant", () => {
        expect(() => invariant(true, "test")).not.toThrow();
        expect(() => invariant(false, "test")).toThrow("test");
        expect(() => invariant("", "test")).toThrow("test");
        expect(() => invariant(0, "test")).toThrow("test");
        expect(() => invariant(null, "test")).toThrow("test");
        expect(() => invariant(undefined, "test")).toThrow("test");
        expect(() => invariant(null)).toThrow("Invariant failed");
        expect(() => invariant(1)).not.toThrow();
    });

    it("produce", () => {
        // objects
        const person = {
            name: "John",
            age: 42,
        };

        const newPerson = produce(person, draft => {
            draft.age = 43;
        });

        expect(person.age).toBe(42);
        expect(newPerson.age).toBe(43);
        expect(person).not.toBe(newPerson);

        // arrays
        const groceries = ["milk", "eggs", "bread"];

        const newGroceries = produce(groceries, draft => {
            draft.push("cheese");
        });

        expect(groceries).not.toBe(newGroceries);
        expect(groceries).toEqual(["milk", "eggs", "bread"]);
        expect(newGroceries).toEqual(["milk", "eggs", "bread", "cheese"]);

        // map
        const map = new Map<string, number>();
        map.set("a", 1);
        map.set("b", 2);

        const newMap = produce(map, draft => {
            draft.set("c", 3);
        });

        expect(map).not.toBe(newMap);
        expect(map.get("c")).toBe(undefined);
        expect(newMap.get("c")).toBe(3);

        // set
        const set = new Set<number>();
        set.add(1);
        set.add(2);

        const newSet = produce(set, draft => {
            draft.add(3);
        });

        expect(set).not.toBe(newSet);
        expect(set.has(3)).toBe(false);
        expect(newSet.has(3)).toBe(true);

        // class
        class Test {
            public a = 1;
            public b = 2;
        }

        const test = new Test();

        const newTest = produce(test, draft => {
            draft.b = 3;
        });

        expect(test).not.toBe(newTest);
        expect(test.a).toBe(1);
        expect(test.b).toBe(2);
        expect(newTest.a).toBe(1);
        expect(newTest.b).toBe(3);
    });
});
