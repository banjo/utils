import { describe, expect, it, vi } from "vitest";
import { batchInvoke, invariant, memoize, noop, raise } from "../src";

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
});
