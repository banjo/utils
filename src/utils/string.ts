import {
    camelCase as cc,
    pathCase as pc,
    capitalCase as cac,
    dotCase as dc,
    pascalCase as pascalC,
    snakeCase as sc,
    Options,
} from "change-case";

/**
 * Capitalizes the first letter of a given string and converts the rest of the letters to lowercase.
 * @param str - The string to capitalize.
 * @returns The capitalized string.
 * @example
 * capitalize('hello'); // returns 'Hello'
 * capitalize('HELLO'); // returns 'Hello'
 */
export const capitalize = (str: string): string =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

/**
 * Check if the given value is an empty string.
 * @param value - The value to check.
 * @returns true if the value is an empty string, false otherwise.
 * @example
 * isEmptyString(''); // returns true
 * isEmptyString('hello'); // returns false
 */
export const isEmptyString = (value: string): value is string => value === "";

/**
 * Convert a string to camelCase using the "change-case" library.
 * @param str - The string to convert.
 * @param options - The options to use when converting the string. See the "change-case" library for more information.
 * @returns The converted string.
 * @example
 * camelCase('hello world'); // returns 'helloWorld'
 */
export const camelCase = (str: string, options?: Options): string =>
    cc(str, options);
/**
 *Convert a string to path/case using the "change-case" library.
 *@param str - The string to convert.
 *@param options - The options to use when converting the string. See the "change-case" library for more information.
 *@returns The converted string.
 *@example
 *pathCase('hello world'); // returns 'hello/world'
 */
export const pathCase = (str: string, options?: Options): string =>
    pc(str, options);
/**
 * Convert a string to Capital Case using the "change-case" library.
 * @param str - The string to convert.
 * @param options  - The options to use when converting the string. See the "change-case" library for more information.
 * @returns The converted string.
 * @example
 * capitalCase('hello world'); // returns 'Hello World'
 */
export const capitalCase = (str: string, options?: Options): string =>
    cac(str, options);

/**
 * Convert a string to dot.case using the "change-case" library.
 * @param str - The string to convert.
 * @param options - The options to use when converting the string. See the "change-case" library for more information.
 * @returns The converted string.
 * @example
 * dotCase('hello world'); // returns 'hello.world'
 */
export const dotCase = (str: string, options?: Options): string =>
    dc(str, options);

/**
 * Convert a string to PascalCase using the "change-case" library.
 * @param str - The string to convert.
 * @param options - The options to use when converting the string. See the "change-case" library for more information.
 * @returns The converted string.
 * @example
 * pascalCase('hello world'); // returns 'HelloWorld'
 */
export const pascalCase = (str: string, options?: Options): string =>
    pascalC(str, options);

/**
 * Convert a string to snake_case using the "change-case" library.
 * @param str - The string to convert.
 * @param options - The options to use when converting the string. See the "change-case" library for more information.
 * @returns The converted string.
 * @example
 * snakeCase('hello world'); // returns 'hello_world'
 */
export const snakeCase = (str: string, options?: Options): string =>
    sc(str, options);

/**
 * Generate a random string with the length provided, defaults to 10.
 * @param length - length of string
 * @returns the generated string
 * @example
 * randomString(); // returns 'Fwf4552Dd2'
 * randomString(5); // return 'f5l32'
 */
export const randomString = (length = 10) =>
    Math.random()
        .toString(36)
        .substring(2, length + 2);
