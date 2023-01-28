import { DEV, BROWSER } from "esm-env";
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
export const isBoolean = (value: any): value is boolean =>
    typeof value === "boolean";

/**
 * Check if the given value is a number.
 * @param value - The value to check.
 * @returns true if the value is a number, false otherwise.
 * @example
 * isNumber(1); // true
 * isNumber("hello world"); // false
 */
export const isNumber = (value: any): value is number =>
    typeof value === "number";

/**
 * Check if the given value is a string.
 * @param value - The value to check.
 * @returns true if the value is a string, false otherwise.
 * @example
 * isString("hello world"); // true
 * isString(1); // false
 */
export const isString = (value: any): value is string =>
    typeof value === "string";

/**
 * Check if the given value is a function.
 * @param value - The value to check.
 * @returns true if the value is a function, false otherwise.
 * @example
 * isFunction(() => {}); // true
 * isFunction("hello world"); // false
 * isFunction(1); // false
 */
export const isFunction = (value: any): value is Function =>
    typeof value === "function";

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
export const isDateObject = (value: any): value is Date =>
    value instanceof Date;

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
export const isRegExp = (value: any): value is RegExp =>
    value instanceof RegExp;

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
export const isUndefined = (value: any): value is undefined =>
    value === undefined;

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
export const isNil = (value: any): value is null | undefined =>
    isNull(value) || isUndefined(value);

/**
 * Check if the given value exists (is not null or undefined).
 * @param value - The value to check.
 * @returns true if the value exists, false otherwise.
 * @example
 * exists(null); // false
 * exists(undefined); // false
 * exists("hello world"); // true
 * exists(1); // true
 * exists(false); // true
 * exists([]); // true
 */
export const exists = <T>(value: T | null | undefined): value is T =>
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
export const isArray = (value: any): value is Array<any> =>
    Array.isArray(value);

/**
 *  Check if the value is a DOM element.
 * @param value - The value to check.
 * @returns true if the value is a DOM element, false otherwise.
 * @example
 * isElement(document.body); // true
 * isElement("hello world"); // false
 */
export const isElement = (value: any): value is Element =>
    value instanceof Element;

/**
 * Check if the code is running in a browser environment.
 * @returns true if the code is running in a browser environment, false otherwise.
 */
// @ts-ignore
export const isBrowser = (): boolean =>
    typeof window !== "undefined" && BROWSER === true;

/**
 * Check if the code is running in a Node.js environment.
 * @returns true if the code is running in a Node.js environment, false otherwise.
 */
export const isNode = (): boolean =>
    typeof process !== "undefined" && BROWSER === false;

/**
 * Check if the code is running in a development environment.  Wrapper around the "esm-env" library.
 * @returns true if the code is running in a development environment, false otherwise.
 */
export const isDev = (): boolean => DEV === true;
