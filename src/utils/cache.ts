/**
 * Cache utility.
 */

import { toMilliseconds } from "./date";
import { isBrowser, isDefined } from "./is";
import { defaults } from "./object";

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
    persistent?: boolean;

    /**
     * The key used to store the cache in local storage. Defaults to "banjo-cache". Only used if persistent is true. It is recommended to change this if you are using multiple caches.
     * @default "banjo-cache"
     */
    key?: string;
    /**
     * Interval for cleaning the cache in ms. Defaults to 5 minutes. Set to false to disable.
     * @default 300000
     */
    cleanInterval?: number | false;
};

type SingleOptions = {
    /**
     * The time in milliseconds after which the cache expires for the object. Defaults to the global ttl.
     */
    ttl?: number;

    /**
     * If true, the cache is persisted in local storage. Defaults to the global persistent value.
     * @default false
     */
    persist?: boolean;
};

const defaultOptions = {
    ttl: toMilliseconds({ minutes: 5 }),
    persistent: false,
    key: "banjo-cache",
    cleanInterval: toMilliseconds({ minutes: 5 }) as number | false,
};

type CacheObject<T> = {
    data: T;
    ttl: number;
};

const isExpired = (expires: number) => Date.now() > expires;

const initMap = <T>(key: string, persistent: boolean) => {
    let cache: Map<string | symbol, CacheObject<T>>;

    if (!isBrowser()) {
        cache = new Map();
        return cache;
    }

    if (!persistent) {
        cache = new Map();
        return cache;
    }

    const previousCache = localStorage.getItem(key);

    if (!previousCache) {
        cache = new Map();
        return cache;
    }

    try {
        const parsed = JSON.parse(previousCache);
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
 * Creates a super simple cache with expiration and support for persistence in browsers. Can be used with strings and symbols as key. Is generic and can be used with any type.
 * @returns An object with the following methods: get, set, has, delete, clear, stopCleanup, hasActiveCleanup.
 * @example
 * const { get, set, has, delete, clear } = createCache();
 *
 * set("key", "value");
 * get("key"); // "value"
 * has("key"); // true
 * delete("key"); // true
 * clear();
 *
 * // can be used with generics
 * const cache = createCache<string>();
 *
 * // can be used with symbols
 * const cache = cache();
 * const key = Symbol("key");
 * cache.set(key, "value");
 *
 * // can be be persisted in local storage
 * const cache = createCache({ persistent: true });
 *
 * // can be be persisted in local storage with a custom key
 * const cache = createCache({ persistent: true, key: "my-cache" });
 *
 * // custom expiration time in ms
 * const cache = createCache({ ttl: 1000 });
 */
export const createCache = <T>(options: Options = defaultOptions) => {
    const {
        ttl: globalTtl,
        key,
        persistent: globalPersist,
        cleanInterval,
    } = defaults(options, defaultOptions);
    const cache = initMap<T>(key, globalPersist);

    const doPersist = (persist = globalPersist) => {
        if (!isBrowser()) return;
        if (!persist) return;

        const str = JSON.stringify(Array.from(cache.entries()));
        localStorage.setItem(key, str);
    };

    const cleanup = () => {
        for (const [key, value] of cache.entries()) {
            if (isExpired(value.ttl)) {
                cache.delete(key);
            }
        }
    };

    const intervalId = cleanInterval !== false ? setInterval(cleanup, cleanInterval) : undefined;
    const stopCleanup = () => clearInterval(intervalId);
    const hasActiveCleanup = isDefined(intervalId);

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
        stopCleanup,
        hasActiveCleanup,
    };
};
