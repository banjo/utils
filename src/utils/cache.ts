/**
 * Cache utility.
 */

/**
 * Creates a super simple cache based on a map. Can be used with strings and symbols as key. The cache is not persisted. It is not meant to be used as a replacement for a proper cache library. Is generic and can be used with any type.
 * @returns An object with the following methods: get, set, has, delete, clear.
 * @example
 * const { get, set, has, delete, clear } = cache();
 *
 * set("key", "value");
 * get("key"); // "value"
 * has("key"); // true
 * delete("key"); // true
 * clear();
 *
 * // can be used with generics
 * const cache = cache<string>();
 *
 * // can be used with symbols
 * const cache = cache();
 * const key = Symbol("key");
 * cache.set(key, "value");
 */
export const cache = <T>() => {
    const cache = new Map<string | symbol, T>();

    return {
        get: (key: string | symbol) => cache.get(key),
        set: (key: string | symbol, value: T) => cache.set(key, value),
        has: (key: string | symbol) => cache.has(key),
        delete: (key: string | symbol) => cache.delete(key),
        clear: () => cache.clear(),
    };
};
