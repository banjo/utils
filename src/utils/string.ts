import { camelCase as cc } from "change-case";

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

export const camelCase = (str: string): string => cc(str);
