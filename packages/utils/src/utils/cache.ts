/**
 * Cache utility.
 */

import { toMilliseconds } from "./date";
import { isBrowser } from "./is";

type Options = {
    /**
     * The time in milliseconds after which the cache expires for each object. Defaults to 5 minutes.
     * @default 300000
     */
    ttl?: number;

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

type SingleOptions = {
    /**
     * The time in milliseconds after which the cache expires for the object. Defaults to the global ttl.
     */
    ttl?: number;

    /**
     * If true, the cache is persisted in local storage. Defaults to the global persistant value.
     * @default false
     */
    persist?: boolean;
};

const defaultOptions = {
    ttl: toMilliseconds({ minutes: 5 }),
    persistant: false,
    key: "banjo-cache",
};

type CacheObject<T> = {
    data: T;
    ttl: number;
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

    try {
        const parsed = JSON.parse(previusCache);
        if (!Array.isArray(parsed)) {
            cache = new Map();
        }
        cache = new Map(parsed);
        return cache;
    } catch (e) {
        cache = new Map();
        return cache;
    }
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
    const { ttl: globalTtl, key, persistant: globalPersist } = { ...defaultOptions, ...options };
    const cache = initMap<T>(key, globalPersist);

    const doPersist = (persist = globalPersist) => {
        if (!isBrowser()) return;
        if (!persist) return;

        const str = JSON.stringify(Array.from(cache.entries()));
        localStorage.setItem(key, str);
    };

    return {
        get: (key: string | symbol) => {
            const cacheObject = cache.get(key);
            if (!cacheObject) {
                return undefined;
            }

            if (isExpired(cacheObject.ttl)) {
                cache.delete(key);
                doPersist();
                return undefined;
            }

            return cacheObject.data;
        },
        set: (key: string | symbol, value: T, options?: SingleOptions) => {
            const { persist, ttl } = options ?? {};
            const localPersist = persist ?? globalPersist;
            const localTtl = ttl ?? globalTtl;
            cache.set(key, {
                data: value,
                ttl: new Date().getTime() + localTtl,
            });
            doPersist(localPersist);
        },
        has: (key: string | symbol) => {
            const cacheObject = cache.get(key);
            if (!cacheObject) {
                return false;
            }

            if (isExpired(cacheObject.ttl)) {
                cache.delete(key);
                doPersist();
                return false;
            }

            return true;
        },
        delete: (key: string | symbol) => {
            const cacheObject = cache.get(key);
            if (!cacheObject) {
                return true;
            }

            if (isExpired(cacheObject.ttl)) {
                cache.delete(key);
                doPersist();
                return true;
            }

            cache.delete(key);
            doPersist();
            return true;
        },
        clear: () => {
            cache.clear();
            doPersist();
        },
    };
};
