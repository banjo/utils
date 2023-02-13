import wcmatch from "wildcard-match";
import { flip } from "./object";

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

const htmlEscapes: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
};

/**
 * Escape HTML special characters.
 * @param str - The string to escape.
 * @returns The escaped string.
 * @example
 * escapeHtml('<div>hello</div>'); // returns '&lt;div&gt;hello&lt;/div&gt;'
 */
export const escapeHtml = (str: string): string => {
    return str.replace(/[&<>"']/g, (match) => {
        const escape = htmlEscapes[match];
        if (!escape) return match;
        return escape;
    });
};

const htmlUnescapes: Record<string, string> = flip(htmlEscapes);

/**
 * Unescape HTML special characters. Opposite of escapeHtml.
 * @param str - The string to unescape.
 * @returns The unescaped string.
 * @example
 * unescapeHtml('&lt;div&gt;hello&lt;/div&gt;'); // returns '<div>hello</div>'
 */
export const unescapeHtml = (str: string): string => {
    return str.replace(/&(?:amp|lt|gt|quot|#39);/g, (match) => {
        const unescape = htmlUnescapes[match];
        if (!unescape) return match;
        return unescape;
    });
};

/**
 * Escape RegExp special characters.
 * @param str - The string to escape.
 * @returns The escaped string.
 * @example
 * escapeRegExp('hello world'); // returns 'hello world'
 * escapeRegExp('hello*world'); // returns 'hello\\*world'
 * escapeRegExp('hello?world'); // returns 'hello\\?world'
 * escapeRegExp('hello(world'); // returns 'hello\\(world'
 */
export const escapeRegExp = (str: string): string => {
    return str.replace(/[/\-\\^$*+?.()|[\]{}]/g, "\\$&");
};

/**
 * Slugify a string. Converts a string to lowercase, removes non-word characters and replaces spaces with dashes.
 * @param str - The string to slugify.
 * @returns The slugified string.
 * @example
 * slugify('hello world'); // returns 'hello-world'
 * slugify('hello world!'); // returns 'hello-world'
 * slugify(''); // returns ''
 * slugify('This is a long sentence that should be slugified!!'); // returns 'this-is-a-long-sentence-that-should-be-slugified'
 */
export const slugify = (str: string): string => {
    return str
        .toString()
        .toLowerCase()
        .replace(/\s+/g, "-") // Replace spaces with -
        .replace(/[^\w-]+/g, "") // Remove all non-word chars
        .replace(/--+/g, "-") // Replace multiple - with single -
        .replace(/^-+/, "") // Trim - from start of text
        .replace(/-+$/, ""); // Trim - from end of text
};

/**
 * Truncate a string to a given length. Adds an ellipsis to the end of the string if it was truncated.
 * @param str - The string to truncate.
 * @param length - The length to truncate the string to.
 * @param end - The string to add to the end of the truncated string.
 * @returns The truncated string.
 * @example
 * truncate('hello world', 5); // returns 'hello...'
 * truncate('hello world', 5, '...more'); // returns 'hello...more'
 * truncate('hello world', 100); // returns 'hello world'
 * truncate('hello world', 5, ''); // returns 'hello'
 * truncate('hello world', 5, '...'); // returns 'hello...'
 */
export const truncate = (str: string, length: number, end = "..."): string => {
    if (str.length <= length) return str;
    return str.slice(0, length) + end;
};
