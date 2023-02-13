import { describe, expect, it, vi } from "vitest";
import { cache } from "../src/utils/cache";

vi.useFakeTimers();

describe("cache", () => {
    it("can be used with generics", () => {
        const c = cache<string>();
        expect(c).toBeDefined();
    });

    it("can be used with symbols", () => {
        const c = cache();
        const key = Symbol("key");

        c.set(key, "value");
        const t = c.get(key);
        expect(c.get(key)).toBe("value");
        expect(c.has(key)).toBe(true);
        expect(c.get("key")).toBeUndefined();

        c.delete(key);
        expect(c.has(key)).toBe(false);
    });

    it("can be used with strings", () => {
        const c = cache();
        const key = "key";
        const value = "value";

        c.set(key, value);
        expect(c.get(key)).toBe(value);
        expect(c.has(key)).toBe(true);

        c.delete(key);
        expect(c.has(key)).toBe(false);
    });

    it("can be cleared", () => {
        const c = cache();
        const key = "key";
        const value = "value";

        c.set(key, value);
        expect(c.get(key)).toBe(value);
        expect(c.has(key)).toBe(true);

        c.clear();
        expect(c.has(key)).toBe(false);
    });

    it("can be used with expires", () => {
        const time = 1000;
        const c = cache({ expires: time });
        const key = "key";
        const value = "value";

        c.set(key, value);
        expect(c.get(key)).toBe(value);
        expect(c.has(key)).toBe(true);

        vi.advanceTimersByTime(time + 1);

        expect(c.has(key)).toBe(false);
        expect(c.get(key)).toBeUndefined();
    });

    it("can be used with expires and clear", () => {
        const time = 1000;
        const c = cache({ expires: time });
        const key = "key";
        const value = "value";

        c.set(key, value);
        expect(c.get(key)).toBe(value);
        expect(c.has(key)).toBe(true);

        c.clear();
        expect(c.has(key)).toBe(false);
        expect(c.get(key)).toBeUndefined();
    });
});
