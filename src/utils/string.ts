import {
    camelCase as cc,
    pathCase as pc,
    capitalCase as cac,
    dotCase as dc,
    pascalCase as pascalC,
    snakeCase as sc,
    Options,
} from "change-case";
import wcmatch from "wildcard-match";

/**
 * Utilities for working with strings.
 */

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
 * Convert a string to path/case using the "change-case" library.
 * @param str - The string to convert.
 * @param options - The options to use when converting the string. See the "change-case" library for more information.
 * @returns The converted string.
 * @example
 * pathCase('hello world'); // returns 'hello/world'
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
 * Convert a string to kebab-case using the "change-case" library.
 * @param str - The string to convert.
 * @param options - The options to use when converting the string. See the "change-case" library for more information.
 * @returns The converted string.
 * @example
 * kebabCase('hello world'); // returns 'hello-world'
 * kebabCase('hello_world'); // returns 'hello-world'
 * kebabCase('helloWorld'); // returns 'hello-world'
 */
export const kebabCase = (str: string, options?: Options): string => {
    const result = sc(str, options);
    return result.replace(/_/g, "-");
};

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

const randomDictionary =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_";
/**
 * Generate a random string with the length provided, defaults to 16.
 * @param length - length of string
 * @returns the generated string
 * @example
 * randomString(); // returns 'Fwf4552Dd2'
 * randomString(5); // return 'f5l32'
 */
export const randomString = (length = 16, dictionary = randomDictionary) => {
    let id = "";
    let i = length;
    const len = dictionary.length;
    while (i--) id += dictionary[(Math.random() * len) | 0];
    return id;
};

/**
 * Check if a string matches a wildcard pattern. Uses the "wildcard-match" library.
 * @param str - The string to check.
 * @param pattern - The wildcard pattern to check against.
 * @returns true if the string matches the pattern, false otherwise.
 * @example
 * wildcardMatch('/foo/bar', '/foo/*'); // returns true
 * wildcardMatch('/foo/bar', '/foo/bar'); // returns true
 * wildcardMatch('/foo/bar', '/foo/bar/*'); // returns false
 */
export const wildcardMatch = (str: string, pattern: string): boolean => {
    const isMatch = wcmatch(pattern);
    return isMatch(str);
};

/**
 * Ensure a string starts with a given prefix.
 * @param str - The string to check.
 * @param prefix - The prefix to check for.
 * @returns The string with the prefix added if it was not already present.
 * @example
 * ensurePrefix('hello', 'foo'); // returns 'foohello'
 * ensurePrefix('foohello', 'foo'); // returns 'foohello'
 * ensurePrefix('hello', 'hello'); // returns 'hello'
 */
export const ensurePrefix = (str: string, prefix: string): string =>
    str.startsWith(prefix) ? str : `${prefix}${str}`;

/**
 * Ensure a string ends with a given suffix.
 * @param str - The string to check.
 * @param suffix - The suffix to check for.
 * @returns The string with the suffix added if it was not already present.
 * @example
 * ensureSuffix('hello', 'foo'); // returns 'hellofoo'
 * ensureSuffix('hellofoo', 'foo'); // returns 'hellofoo'
 * ensureSuffix('hello', 'hello'); // returns 'hello'
 */
export const ensureSuffix = (str: string, suffix: string): string =>
    str.endsWith(suffix) ? str : `${str}${suffix}`;

/**
 * Simple templating function that replaces {0}, {1} or {{key}} with the provided arguments.
 * @param string - The string to replace the values in.
 * @param args - The values to replace in the string. Could be multiple string arguments or a single object.
 * @returns The string with the values replaced.
 * @example
 * template('hello {0}', 'world'); // returns 'hello world'
 * template('hello {0} {1}', 'world', 'foo'); // returns 'hello world foo'
 * template('hello {0} {1}', 'world'); // returns 'hello world {1}'
 *
 * template('hello {{name}}', { name: 'world' }); // returns 'hello world'
 * template('hello {{name}}, I am {{me}}', { name: 'world', me: "Kent" }); // returns 'hello world, I am Kent'
 * template('hello {{name}}', { name: 'world', foo: 'bar' }); // returns 'hello world'
 * template('hello {{name}}', { foo: 'bar' }); // returns 'hello {{name}}'
 */
export function template(string: string, data: Record<string, string>): string;
export function template(string: string, ...args: string[]): string;
export function template(string: string, ...args: any): string {
    const data = args[0];
    if (typeof data === "string") {
        return string.replace(/{(\d+)}/g, (match, key) => {
            const index = Number(key);
            if (Number.isNaN(index)) return match;
            const value = args[index];
            if (value === undefined) return match;
            return value;
        });
    }

    return string.replace(/{{\s*([\w.]+)\s*}}/g, (match, key) => {
        const value = data[key];
        if (value === undefined) return match;
        return value;
    });
}
