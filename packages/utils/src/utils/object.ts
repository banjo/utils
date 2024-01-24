import {
    deleteProperty as dp,
    getProperty as gp,
    hasProperty as hp,
    setProperty as sp,
} from "dot-prop";
import { Maybe } from "./types";

/**
 * Utility functions for working with objects. Both wrappers and custom functions.
 */

/**
 * Returns the value at path of object. If the resolved value is undefined, the defaultValue is returned in its place. Undefined will be returned if the path is not found or on failure. Wrapper around the "dot-prop" library.
 * @param obj - object to query
 * @param path - path to query in object
 * @param defaultValue - value to return for undefined resolved values
 * @returns The value at path of object.
 * @example
 * const obj = { a: { b: { c: "d" } } };
 *
 * getProperty(obj, "a.b.c"); // => "d"
 * getProperty(obj, "a.b"); // => { c: "d" }
 *
 * getProperty({a: [{b: "c"}]}, "a[0].b"); // => "c"
 * getProperty({a: [{b: "c"}]}, "a[1].b"); // => undefined
 *
 */
export const getProperty = (obj: any, path: string, defaultValue?: any) => {
    return gp(obj, path, defaultValue);
};

/**
 * Sets the value at path of object. If a portion of path doesn't exist, it's created. Arrays are created for missing index properties while objects are created for all other missing properties. Use deleteProperty to remove property values. Wrapper around the "dot-prop" library.
 * @param obj - object to modify
 * @param path - path to set in object
 * @param value - value to set at path
 * @example
 * const obj = { a: { b: { c: "d" } } };
 *
 * setProperty(obj, "a.b.c", "hello"); // => { a: { b: { c: "hello" } } }
 * setProperty(obj, "a", hello); // => { a: "hello" }
 * setProperty({}, "a.b", "hello"); // => { a: { b: "hello" } }
 */
export const setProperty = (obj: any, path: string, value: any) => {
    sp(obj, path, value);
};

/**
 * Checks if object has a property at path. If the resolved value is undefined, false is returned. Wrapper around the "dot-prop" library.
 * @param obj - object to query
 * @param path - path to query in object
 * @returns true if object has a property at path, else false.
 * @example
 * const obj = { a: { b: { c: "d" } } };
 * hasProperty(obj, "a.b.c"); // => true
 * hasProperty(obj, "a.b"); // => true
 * hasProperty(obj, "a.b.c.d"); // => false
 */
export const hasProperty = (obj: any, path: string) => {
    return hp(obj, path);
};

/**
 * Deletes the property at path of object. Wrapper around the "dot-prop" library.
 * @param obj - object to modify
 * @param path - path to delete in object
 * @returns true if the property is deleted, else false.
 * @example
 * const obj = { a: { b: { c: "d" } } };
 *
 * deleteProperty(obj, "a.b.c"); // => true
 * deleteProperty(obj, "a.b"); // => true
 * deleteProperty(obj, "a.b.c.d"); // => false
 */
export const deleteProperty = (obj: any, path: string) => {
    return dp(obj, path);
};

/**
 * Strictly typed version of Object.keys. Returns an array of keys of the object.
 * @param obj - object to query
 * @returns An array of keys of the object.
 * @example
 * const obj = { a: 1, b: 2, c: 3 };
 * objectKeys(obj); // => ["a", "b", "c"]
 * objectKeys({}); // => []
 */
export const objectKeys = <T extends object>(obj: T): Array<keyof typeof obj> => {
    return Object.keys(obj) as any;
};

/**
 * Strictly typed version of Object.values. Returns an array of values of the object.
 * @param obj - object to query
 * @returns An array of values of the object.
 * @example
 * const obj = { a: 1, b: 2, c: 3 };
 * objectValues(obj); // => [1, 2, 3]
 * objectValues({}); // => []
 */
export const objectValues = <T extends object>(obj: T): Array<T[keyof T]> => {
    return Object.values(obj);
};

type Entries<T> = {
    [K in keyof T]: [K, T[K]];
}[keyof T][];

/**
 * Strictly typed version of Object.entries. Returns an array of key-value pairs of the object.
 * @param obj - object to query
 * @returns An array of key-value pairs of the object.
 * @example
 * const obj = { a: 1, b: 2, c: 3 };
 * objectEntries(obj); // => [["a", 1], ["b", 2], ["c", 3]]
 * objectEntries({}); // => []
 */
export const objectEntries = <T extends object>(obj: T): Entries<T> => {
    return Object.entries(obj) as any;
};

export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

const isMergableObject = (item: any): item is Record<string, any> => {
    return item !== null && typeof item === "object";
};

const _merge = <T extends object = object, S extends object = DeepPartial<T>>(
    _target: T | S,
    ...sources: Array<S | undefined>
): T | S => {
    let target = _target as T & S;
    if (!sources.length) return target;

    const source = sources.shift();
    if (source === undefined) return target;

    if (isMergableObject(target) && isMergableObject(source)) {
        Object.keys(source).forEach(key => {
            // @ts-expect-error
            if (isMergableObject((source as S)[key])) {
                // @ts-expect-error
                if (!target[key]) target[key] = {} as any;
                // @ts-expect-error
                _merge(target[key] as S, (source as S)[key]);
            } else {
                // @ts-expect-error
                target[key] = (source as S)[key] as T[keyof T];
            }
        });
    }
    return _merge(target, ...sources);
};

/**
 * Deeply merges two or more objects. The last object in the arguments list overwrites previous values. No mutation.
 * @param target - object to merge into
 * @param sources - objects to merge from
 * @returns A new merged object.
 * @example
 * const obj1 = { a: 1};
 * const obj2 = { a: 2};
 * merge(obj1, obj2); // => { a: 2 }
 *
 * const obj1 = { a: { b: 1 } };
 * const obj2 = { a: { c: 2 } };
 * merge(obj1, obj2); // => { a: { b: 1, c: 2 } }
 *
 * const obj1 = { a: { b: 1 } };
 * const obj2 = { a: { b: 2 } };
 * const obj3 = { a: { b: 3 } };
 * merge(obj1, obj2, obj3); // => { a: { b: 3 } }
 */
export const merge = <T extends object = object, S extends object = DeepPartial<T>>(
    target: T | S,
    ...sources: Array<S | undefined>
): T | S => {
    return _merge({} as T & S, target, ...sources);
};

/**
 * Deeply clones an object. No mutation.
 * @param obj - object to clone
 * @returns A new cloned object.
 * @example
 * const obj = { a: { b: 1 } };
 * const cloned = clone(obj);
 * cloned.a.b = 2;
 * console.log(obj.a.b); // => 1
 */
export const clone = <T extends object>(obj: T): T => {
    return merge(obj);
};

/**
 * Used for setting default values. Deeply merges two objects. No mutation. The first object is the partial one, and the second object is the default one. If a value is already set in the partial object, it will not be overwritten.
 * @param obj - the settings object from the user
 * @param defaultsList - the default settings objects
 * @returns - A new merged object.
 * @example
 * const obj1 = { a: 1};
 * const obj2 = { a: 2};
 * defaults(obj1, obj2); // => { a: 1 }
 * defaults(obj2, obj1); // => { a: 2 }
 *
 */
export const defaults = <T extends object, U extends Partial<T>>(
    obj: Maybe<U>,
    defaultObj: T
): T => {
    const safeObj: Partial<T> = obj ?? {};
    const updated = merge(defaultObj, safeObj);
    return updated as T;
};

/**
 * Flips the keys and values of an object. If the object has duplicate values, the last key will be used.
 * @param obj - object to flip
 * @returns The flipped object.
 * @example
 * const obj = { a: 1, b: 2, c: 3 };
 * flip(obj); // => { 1: "a", 2: "b", 3: "c" }
 */
export const flip = <T extends object>(obj: T): T => {
    const ret: any = {};
    objectKeys(obj).forEach(key => {
        ret[obj[key]] = key;
    });
    return ret;
};
