import equal from "fast-deep-equal/es6";

/**
 * Utility functions for checking the type of a value.
 */

/**
 * Check if the given value is a boolean.
 * @param value - The value to check.
 * @returns true if the value is a boolean, false otherwise.
 * @example
 * isBoolean(true); // true
 * isBoolean("hello world"); // false
 */
export const isBoolean = (value: any): value is boolean => typeof value === "boolean";

/**
 * Check if the given value is a number.
 * @param value - The value to check.
 * @returns true if the value is a number, false otherwise.
 * @example
 * isNumber(1); // true
 * isNumber("hello world"); // false
 */
export const isNumber = (value: any): value is number => typeof value === "number";

/**
 * Check if the given value is a string.
 * @param value - The value to check.
 * @returns true if the value is a string, false otherwise.
 * @example
 * isString("hello world"); // true
 * isString(1); // false
 */
export const isString = (value: any): value is string => typeof value === "string";

/**
 * Check if the given value is a function.
 * @param value - The value to check.
 * @returns true if the value is a function, false otherwise.
 * @example
 * isFunction(() => {}); // true
 * isFunction("hello world"); // false
 * isFunction(1); // false
 */
export const isFunction = (value: any): value is Function => typeof value === "function";

/**
 * Check if the given value is an object.
 * @param value - The value to check.
 * @returns true if the value is an object, false otherwise.
 * @example
 * isObject({}); // true
 * isObject("hello world"); // false
 * isObject(1); // false
 */
export const isObject = (value: any): value is object =>
    value !== null && typeof value === "object";

/**
 * Check if the given value is a Date object. Cannot be used to check if a value is a valid date.
 * @param value - The value to check.
 * @returns true if the value is a Date, false otherwise.
 * @example
 * isDateObject(new Date()); // true
 * isDateObject("hello world"); // false
 * isDateObject(1); // false
 * isDateObject(new Date("hello world")); // true
 */
export const isDateObject = (value: any): value is Date => value instanceof Date;

/**
 * Check if the given value is a valid date. Cannot be used to check if a value is a Date object.
 * Can pass strings, numbers, or Date objects. Notice that dates might works differently in different browsers.
 * Passing in "1" will return true in Chrome, but false in Firefox.
 * @param value - The value to check.
 * @returns true if the value is a valid date, false otherwise.
 * @example
 * isDate(new Date()); // true
 * isDate("hello world"); // false
 * isDate(1); // true or false depending on the browser
 * isDate(new Date("hello world")); // false
 * isDate("2022-12-24"); // true
 */
export const isDate = (value: any) => {
    if (isDateObject(value)) {
        return !isNaN(value.getTime());
    }
    return !isNaN(Date.parse(value));
};

/**
 * Check if the given value is a RegExp.
 * @param value - The value to check.
 * @returns true if the value is a RegExp, false otherwise.
 * @example
 * isRegExp(/hello world/); // true
 * isRegExp("hello world"); // false
 * isRegExp(1); // false
 * isRegExp(new RegExp("hello world")); // true
 */
export const isRegExp = (value: any): value is RegExp => value instanceof RegExp;

/**
 * Check if the given value is null.
 * @param value - The value to check.
 * @returns true if the value is null, false otherwise.
 * @example
 * isNull(null); // true
 * isNull("hello world"); // false
 * isNull(1); // false
 * isNull(undefined); // false
 */
export const isNull = (value: any): value is null => value === null;

/**
 * Check if the given value is undefined.
 * @param value - The value to check.
 * @returns true if the value is undefined, false otherwise.
 * @example
 * isUndefined(undefined); // true
 * isUndefined("hello world"); // false
 * isUndefined(1); // false
 * isUndefined(null); // false
 */
export const isUndefined = (value: any): value is undefined => value === undefined;

/**
 * Check if the given value is null or undefined.
 * @param value - The value to check.
 * @returns true if the value is null or undefined, false otherwise.
 * @example
 * isNil(null); // true
 * isNil(undefined); // true
 * isNil("hello world"); // false
 * isNil(1); // false
 */
export const isNil = (value: any): value is null | undefined => isNull(value) || isUndefined(value);

/**
 * Check if the given value exists (is not null or undefined). Also type guards against null and undefined. Previously named `exists`.
 * @param value - The value to check.
 * @returns true if the value exists, false otherwise.
 * @example
 * isDefined(null); // false
 * isDefined(undefined); // false
 * isDefined("hello world"); // true
 * isDefined(1); // true
 * isDefined(false); // true
 * isDefined([]); // true
 */
export const isDefined = <T>(value: T | null | undefined): value is T =>
    value !== null && value !== undefined;

/**
 * Check if the given value is a primitive type (string, number, boolean).
 * @param value - The value to check.
 * @returns true if the value is a primitive type, false otherwise.
 * @example
 * isPrimitive("hello world"); // true
 * isPrimitive(1); // true
 * isPrimitive(false); // true
 * isPrimitive({}); // false
 * isPrimitive([]); // false
 */
export const isPrimitive = (value: any): boolean =>
    isString(value) || isNumber(value) || isBoolean(value);

/**
 * Check if the given value is an array.
 * @param value - The value to check.
 * @returns true if the value is an array, false otherwise.
 * @example
 * isArray([1, 2, 3]); // true
 * isArray("hello world"); // false
 * isArray(1); // false
 * isArray(new Array(1, 2, 3)); // true
 */
export const isArray = (value: any): value is Array<any> => Array.isArray(value);

/**
 *  Check if the value is a DOM element.
 * @param value - The value to check.
 * @returns true if the value is a DOM element, false otherwise.
 * @example
 * isElement(document.body); // true
 * isElement("hello world"); // false
 */
export const isElement = (value: any): value is Element => value instanceof Element;

/**
 * Check whether the two values are equal. Uses the fast-deep-equal package. Works with all types.
 * @param a - The first value to compare.
 * @param b - The second value to compare.
 * @returns true if the values are equal, false otherwise.
 * @example
 * isEqual(1, 1); // true
 * isEqual(1, 2); // false
 * isEqual("hello", "hello"); // true
 * isEqual(null, undefined); // false
 * isEqual({ a: 1 }, { a: 1 }); // true
 * isEqual({ a: 1 }, { a: 2 }); // false
 * isEqual([1, 2, 3], [1, 2, 3]); // true
 */
export const isEqual = (a: any, b: any): boolean => {
    return equal(a, b);
};

/**
 * Check if the given value is empty. Works with strings, arrays, objects, and maps. Trims strings before checking.
 * @param value - The value to check.
 * @returns true if the value is empty, false otherwise.
 * @example
 * isEmpty(""); // true
 * isEmpty(" "); // true
 * isEmpty("hello world"); // false
 * isEmpty(1); // false
 * isEmpty([]); // true
 * isEmpty([1, 2, 3]); // false
 * isEmpty({}); // true
 * isEmpty({ a: 1 }); // false
 * isEmpty(new Map()); // true
 * isEmpty(new Map([["a", 1]])); // false
 */
export function isEmpty(array: readonly unknown[]): array is readonly [];
export function isEmpty(array: unknown[]): array is [];
export function isEmpty(array: readonly unknown[]): array is [] | readonly [];
export function isEmpty(string: string): string is "";
export function isEmpty(value: any): boolean;
export function isEmpty(value: any): boolean {
    // check for maps
    if (value?.size !== undefined) {
        return value.size === 0;
    }

    if (isNil(value)) {
        return true;
    }
    if (isArray(value)) {
        return value.length === 0;
    }
    if (isObject(value)) {
        return Object.keys(value).length === 0;
    }
    if (isString(value)) {
        return value.trim().length === 0;
    }

    return false;
}

/**
 * Check if the code is running in a browser environment.
 * @returns true if the code is running in a browser environment, false otherwise.
 */
// @ts-ignore
export const isBrowser = (): boolean => typeof window !== "undefined";

/**
 * Check if the code is running in a Node.js environment.
 * @returns true if the code is running in a Node.js environment, false otherwise.
 */
export const isNode = (): boolean => typeof process !== "undefined";
