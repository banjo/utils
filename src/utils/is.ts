/**
 * Check if the given value is a boolean.
 * @param value - The value to check.
 * @returns true if the value is a boolean, false otherwise.
 */
export const isBoolean = (value: any): value is boolean =>
    typeof value === "boolean";

/**
 * Check if the given value is a number.
 * @param value - The value to check.
 * @returns true if the value is a number, false otherwise.
 */
export const isNumber = (value: any): value is number =>
    typeof value === "number";

/**
 * Check if the given value is a string.
 * @param value - The value to check.
 * @returns true if the value is a string, false otherwise.
 */
export const isString = (value: any): value is string =>
    typeof value === "string";

/**
 * Check if the given value is a function.
 * @param value - The value to check.
 * @returns true if the value is a function, false otherwise.
 */
export const isFunction = (value: any): value is Function =>
    typeof value === "function";

/**
 * Check if the given value is an object.
 * @param value - The value to check.
 * @returns true if the value is an object, false otherwise.
 */
export const isObject = (value: any): value is object =>
    value !== null && typeof value === "object";

/**
 * Check if the given value is a Date.
 * @param value - The value to check.
 * @returns true if the value is a Date, false otherwise.
 */
export const isDate = (value: any): value is Date => value instanceof Date;

/**
 * Check if the given value is a RegExp.
 * @param value - The value to check.
 * @returns true if the value is a RegExp, false otherwise.
 */
export const isRegExp = (value: any): value is RegExp =>
    value instanceof RegExp;

/**
 * Check if the given value is null.
 * @param value - The value to check.
 * @returns true if the value is null, false otherwise.
 */
export const isNull = (value: any): value is null => value === null;

/**
 * Check if the given value is undefined.
 * @param value - The value to check.
 * @returns true if the value is undefined, false otherwise.
 */
export const isUndefined = (value: any): value is undefined =>
    value === undefined;

/**
 * Check if the given value is null or undefined.
 * @param value - The value to check.
 * @returns true if the value is null or undefined, false otherwise.
 */
export const isNil = (value: any): value is null | undefined =>
    isNull(value) || isUndefined(value);
/**
 * Check if the given value is a primitive type (string, number, boolean).
 * @param value - The value to check.
 * @returns true if the value is a primitive type, false otherwise.
 */
export const isPrimitive = (value: any): boolean =>
    isString(value) || isNumber(value) || isBoolean(value);

/**
 * Check if the given value is an array.
 * @param value - The value to check.
 * @returns true if the value is an array, false otherwise.
 */
export const isArray = (value: any): value is Array<any> =>
    Array.isArray(value);

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
