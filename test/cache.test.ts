import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cache } from "../src/utils/cache";

// @vitest-environment happy-dom

const loadValue = (content: string, key: string) => {
    const map = new Map(JSON.parse(content));
    const v: any = map.get(key);
    return v;
};

describe("cache", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        window.localStorage.clear();
    });

    afterEach(() => {
        vi.useRealTimers();
        window.localStorage.clear();
    });
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
        const c = cache({ ttl: time });
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
        const c = cache({ ttl: time });
        const key = "key";
        const value = "value";

        c.set(key, value);
        expect(c.get(key)).toBe(value);
        expect(c.has(key)).toBe(true);

        c.clear();
        expect(c.has(key)).toBe(false);
        expect(c.get(key)).toBeUndefined();
    });

    it("can be used with a type", () => {
        type TestType = {
            val: string;
            val2: number;
        };

        const c = cache<TestType>();
        const key = "key";
        const value: TestType = {
            val: "hello",
            val2: 2,
        };

        c.set(key, value);
        expect(c.get(key)).toBe(value);
        expect(c.has(key)).toBe(true);
    });

    it("can persist in localstorage", () => {
        const localStorageKey = "someKey";
        const c = cache({ persistant: true, key: localStorageKey });
        const key = "key";
        const value = "value";

        c.set(key, value);
        expect(c.get(key)).toBe(value);
        expect(c.has(key)).toBe(true);

        const valueFromLocalStorage = localStorage.getItem(localStorageKey);
        expect(valueFromLocalStorage).toBeDefined();

        const value2 = loadValue(valueFromLocalStorage!, key);
        expect(value2?.data).toBe(value);

        c.clear();
        const valueFromLocalStorage2 = localStorage.getItem(localStorageKey);
        expect(valueFromLocalStorage2).toBeDefined();
        const value3 = loadValue(valueFromLocalStorage2!, key);
        expect(value3).toBeUndefined();
    });

    it("can be used with local expires", () => {
        const time = 1000;
        const c = cache();
        const key = "key";
        const value = "value";

        c.set(key, value, { ttl: time });
        expect(c.get(key)).toBe(value);
        expect(c.has(key)).toBe(true);

        vi.advanceTimersByTime(time + 1);

        expect(c.has(key)).toBe(false);
        expect(c.get(key)).toBeUndefined();
    });
});
