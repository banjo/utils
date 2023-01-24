import {
    getProperty as gp,
    setProperty as sp,
    hasProperty as hp,
    deleteProperty as dp,
} from "dot-prop";

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
