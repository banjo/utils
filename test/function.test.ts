import { describe, expect, it, vi } from "vitest";
import { batchInvoke, memoize, noop } from "../src";

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
});
