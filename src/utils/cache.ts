/**
 * Cache utility.
 */

import { getMilliseconds } from "./date";

type Options = {
    /**
     * The time in milliseconds after which the cache expires. Defaults to 24 hours.
     * @default 1000 * 60 * 60 * 24
     */
    expires?: number;
};

const defaultOptions = {
    expires: getMilliseconds({ time: 24, unit: "hour" }),
};

type CacheObject<T> = {
    data: T;
    expires: number;
};

const isExpired = (expires: number) => Date.now() > expires;

/**
 * Creates a super simple cache based on a map. Can be used with strings and symbols as key. The cache is not persisted. Is generic and can be used with any type.
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
export const cache = <T>(options: Options = defaultOptions) => {
    const { expires } = { ...defaultOptions, ...options };
    const cache = new Map<string | symbol, CacheObject<T>>();

    return {
        get: (key: string | symbol) => {
            const cacheObject = cache.get(key);
            if (!cacheObject) {
                return undefined;
            }

            if (isExpired(cacheObject.expires)) {
                cache.delete(key);
                return undefined;
            }

            return cacheObject.data;
        },
        set: (key: string | symbol, value: T) => {
            cache.set(key, {
                data: value,
                expires: new Date().getTime() + expires,
            });
        },
        has: (key: string | symbol) => {
            const cacheObject = cache.get(key);
            if (!cacheObject) {
                return false;
            }

            if (isExpired(cacheObject.expires)) {
                cache.delete(key);
                return false;
            }

            return true;
        },
        delete: (key: string | symbol) => {
            const cacheObject = cache.get(key);
            if (!cacheObject) {
                return true;
            }

            if (isExpired(cacheObject.expires)) {
                cache.delete(key);
                return true;
            }

            cache.delete(key);
            return true;
        },
        clear: () => cache.clear(),
    };
};
