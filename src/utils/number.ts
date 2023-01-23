import { isBoolean } from "./is";
import { random as r } from "lodash-es";

/**
 * Produces a random number between min and max (inclusive). If only one argument is provided a number between
 * 0 and the given number is returned. If floating is true, or either min or max are floats, a floating-point
 * number is returned instead of an integer.
 *
 * @param min The minimum possible value.
 * @param max The maximum possible value.
 * @param floating Specify returning a floating-point number.
 * @return Returns the random number.
 *
 * @example
 * random(0, 5); // 2
 * random(5); // 2
 */
export function random(max: number): number;
export function random(min: number, max: number): number;
export function random(...args: any): number {
    let max: number = 0;
    let min: number = 1;

    if (args.length === 1) {
        min = 0;
        [max] = args;
    } else {
        [min, max] = args;
    }

    return r(min, max);
}
