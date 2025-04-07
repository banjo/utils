import wcmatch from "wildcard-match";
import { flip } from "./object";
import {
    camelCase,
    snakeCase,
    titleCase,
    trainCase,
    upperFirst,
    lowerFirst,
    kebabCase,
    flatCase,
} from "scule";

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

const randomDictionary = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_";
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
    return str.replace(/[&<>"']/g, match => {
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
    return str.replace(/&(?:amp|lt|gt|quot|#39);/g, match => {
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

/**
 * Converts a string to camelCase format (using scule library).
 * @param str - The string to convert to camelCase.
 * @returns The string in camelCase format.
 * @example
 * toCamelCase('hello-world'); // returns 'helloWorld'
 * toCamelCase('hello_world'); // returns 'helloWorld'
 * toCamelCase('HelloWorld'); // returns 'helloWorld'
 */
export const toCamelCase = (str: string): string => camelCase(str);

/**
 * Converts a string to snake_case format (using scule library).
 * @param str - The string to convert to snake_case.
 * @returns The string in snake_case format.
 * @example
 * toSnakeCase('helloWorld'); // returns 'hello_world'
 * toSnakeCase('hello-world'); // returns 'hello_world'
 * toSnakeCase('HelloWorld'); // returns 'hello_world'
 */
export const toSnakeCase = (str: string): string => snakeCase(str);

/**
 * Converts a string to Title Case format (using scule library).
 * @param str - The string to convert to Title Case.
 * @returns The string in Title Case format.
 * @example
 * toTitleCase('helloWorld'); // returns 'Hello World'
 * toTitleCase('hello-world'); // returns 'Hello World'
 * toTitleCase('hello_world'); // returns 'Hello World'
 */
export const toTitleCase = (str: string): string => titleCase(str);

/**
 * Converts a string to Train-Case format (using scule library).
 * @param str - The string to convert to Train-Case.
 * @returns The string in Train-Case format.
 * @example
 * toTrainCase('helloWorld'); // returns 'Hello-World'
 * toTrainCase('hello_world'); // returns 'Hello-World'
 * toTrainCase('HelloWorld'); // returns 'Hello-World'
 */
export const toTrainCase = (str: string): string => trainCase(str);

/**
 * Converts a string to kebab-case format (using scule library).
 * @param str - The string to convert to kebab-case.
 * @returns The string in kebab-case format.
 * @example
 * toKebabCase('helloWorld'); // returns 'hello-world'
 * toKebabCase('hello_world'); // returns 'hello-world'
 * toKebabCase('HelloWorld'); // returns 'hello-world'
 */
export const toKebabCase = (str: string): string => kebabCase(str);

/**
 * Converts a string to flat case format (no separators, all lowercase) (using scule library).
 * @param str - The string to convert to flat case.
 * @returns The string in flat case format.
 * @example
 * toFlatCase('helloWorld'); // returns 'helloworld'
 * toFlatCase('hello-world'); // returns 'helloworld'
 * toFlatCase('Hello_World'); // returns 'helloworld'
 */
export const toFlatCase = (str: string): string => flatCase(str);
