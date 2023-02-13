/**
 * Cache utility.
 */

import { getMilliseconds } from "./date";
import { isBrowser } from "./is";

type Options = {
    /**
     * The time in milliseconds after which the cache expires. Defaults to 5 minutes.
     * @default 300000
     */
    expires?: number;

    /**
     * If true, the cache is persisted in local storage. Defaults to false.
     * @default false
     */
    persistant?: boolean;

    /**
     * The key used to store the cache in local storage. Defaults to "banjo-cache". Only used if persistant is true. It is recommended to change this if you are using multiple caches.
     * @default "banjo-cache"
     */
    key?: string;
};

const defaultOptions = {
    expires: getMilliseconds({ time: 24, unit: "hour" }),
    persistant: false,
    key: "banjo-cache",
};

type CacheObject<T> = {
    data: T;
    expires: number;
};

const isExpired = (expires: number) => Date.now() > expires;

const initMap = <T>(key: string, persistant: boolean) => {
    let cache: Map<string | symbol, CacheObject<T>>;

    if (!isBrowser()) {
        cache = new Map();
        return cache;
    }

    if (!persistant) {
        cache = new Map();
        return cache;
    }

    const previusCache = localStorage.getItem(key);

    if (!previusCache) {
        cache = new Map();
        return cache;
    }

    cache = new Map(JSON.parse(previusCache));
    return cache;
};

/**
 * Creates a super simple cache with expiration and support for persistance. Can be used with strings and symbols as key. Is generic and can be used with any type.
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
 *
 * // can be be persisted in local storage
 * const cache = cache({ persistant: true });
 *
 * // can be be persisted in local storage with a custom key
 * const cache = cache({ persistant: true, key: "my-cache" });
 *
 * // custom expiration time in ms
 * const cache = cache({ expires: 1000 });
 */
export const cache = <T>(options: Options = defaultOptions) => {
    const { expires, key, persistant } = { ...defaultOptions, ...options };
    const cache = initMap<T>(key, persistant);

    const persist = () => {
        if (!isBrowser()) return;
        if (!persistant) return;

        const str = JSON.stringify(Array.from(cache.entries()));
        localStorage.setItem(key, str);
    };

    return {
        get: (key: string | symbol) => {
            const cacheObject = cache.get(key);
            if (!cacheObject) {
                return undefined;
            }

            if (isExpired(cacheObject.expires)) {
                cache.delete(key);
                persist();
                return undefined;
            }

            return cacheObject.data;
        },
        set: (key: string | symbol, value: T) => {
            cache.set(key, {
                data: value,
                expires: new Date().getTime() + expires,
            });
            persist();
        },
        has: (key: string | symbol) => {
            const cacheObject = cache.get(key);
            if (!cacheObject) {
                return false;
            }

            if (isExpired(cacheObject.expires)) {
                cache.delete(key);
                persist();
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
                persist();
                return true;
            }

            cache.delete(key);
            persist();
            return true;
        },
        clear: () => {
            cache.clear();
            persist();
        },
    };
};
