import { isBoolean } from "./is";
import { Maybe } from "./types";

/**
 * Utility functions for working with numbers.
 */

/**
 * Produces a random number between min and max (inclusive). If only one argument is provided a number between
 * 0 and the given number is returned. If floating is true, or either min or max are floats, a floating-point
 * number is returned instead of an integer.
 *
 * @param min - the minimum possible value.
 * @param max - the maximum possible value.
 * @param floating - specify returning a floating-point number.
 * @returns - returns the random number.
 *
 * @example
 * random(0, 5); // 2
 * random(5); // 2
 * random(5, true); // 2.123876376
 * random(0, 5, true); // 2.123876376
 */
export function random(max: number, floating?: boolean): number;
export function random(min: number, max: number, floating?: boolean): number;
export function random(...args: any): number {
    let max: number = 0;
    let min: number = 1;

    const floating = isBoolean(args[args.length - 1]) ? args.pop() : false;

    if (args.length === 1) {
        min = 0;
        [max] = args;
    } else {
        [min, max] = args;
    }

    if (floating) {
        return Math.random() * (Number(max.toPrecision()) - min) + min;
    }

    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Parse a string into a number. If the string is empty or cannot be parsed, undefined is returned.
 * @param value - the string to parse.
 * @returns - the parsed number or undefined.
 * @example
 * parseNumber("1"); // 1
 * parseNumber("1.5"); // 1.5
 * parseNumber("1.5.5"); // undefined
 * parseNumber(""); // undefined
 */
export const parseNumber = (value: string): Maybe<number> => {
    if (value.trim() === "") return undefined;
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return undefined;
    return parsed;
};
