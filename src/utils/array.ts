import { isArray, isNil } from "./is";

/**
 * Check if the given value is an empty array.
 * @param value - The value to check.
 * @returns true if the value is an empty array, false otherwise.
 * @example
 * isEmptyArray([]); // returns true
 * isEmptyArray([1, 2, 3]); // returns false
 */
export const isEmptyArray = (value: any): value is Array<any> =>
    isArray(value) && value.length === 0;

/**
 * Convert a single value or array of values into an array.
 * @param value - The value to convert.
 * @returns An array containing the input value.
 * @example
 * toArray(1); // returns [1]
 * toArray([1, 2, 3]); // returns [1, 2, 3]
 */
export const toArray = <T>(value: T | T[]): T[] => {
    if (isNil(value)) return [];
    return isArray(value) ? value : [value];
};

/**
 * Remove duplicate values from an array.
 * @param array - The array to remove duplicates from.
 * @returns A new array with duplicate values removed.
 * @example
 * uniq([1, 2, 2, 3, 4, 4]); // returns [1, 2, 3, 4]
 * uniq(['a', 'a', 'b', 'c']); // returns ['a', 'b', 'c']
 */
export const uniq = <T>(array: T[]): T[] => Array.from(new Set(array));

/**
 * Return the last element of an array.
 * @param array - The array to get the last element from.
 * @returns The last element of the array.
 * @example
 * last([1, 2, 3]); // returns 3
 * last(['a', 'b', 'c']); // returns 'c'
 */
export const last = <T>(array: T[]): T => array[array.length - 1];

/**
 * Return the first element of an array.
 * @param array - The array to get the first element from.
 * @returns The first element of the array.
 * @example
 * first([1, 2, 3]); // returns 1
 * first(['a', 'b', 'c']); // returns 'a'
 */
export const first = <T>(array: T[]): T => array[0];

/**
 * Generate an array of numbers in a given range.
 * @param start - The starting number of the range.
 * @param stop - The ending number of the range.
 * @param step - The increment to use between numbers in the range.
 * @returns An array of numbers in the specified range.
 * @example
 * range(5); // returns [0, 1, 2, 3, 4]
 * range(2, 5); // returns [2, 3, 4]
 * range(2, 10, 2); // returns [2, 4, 6, 8]
 */
export function range(stop: number): number[];
export function range(start: number, stop: number, step?: number): number[];
export function range(...args: any): number[] {
    let start: number, stop: number, step: number;

    if (args.length === 1) {
        start = 0;
        step = 1;
        [stop] = args;
    } else {
        [start, stop, step = 1] = args;
    }

    const arr: number[] = [];
    let current = start;
    while (current < stop) {
        arr.push(current);
        current += step || 1;
    }

    return arr;
}

/**
 * Move an element of an array from one position to another.
 * @param array - The array to modify.
 * @param from - The index of the element to move.
 * @param to - The index to move the element to.
 * @returns A new array with the element moved to the new position.
 * @example
 * move([1, 2, 3, 4], 0, 2); // returns [2, 3, 1, 4]
 * move(['a', 'b', 'c', 'd'], 1, 3); // returns ['a', 'c', 'd', 'b']
 */
export const move = <T>(array: T[], from: number, to: number): T[] => {
    const newArray = array.slice();
    newArray.splice(to, 0, newArray.splice(from, 1)[0]);
    return newArray;
};

/**
 * Return a random element from an array.
 * @param array - The array to get the random element from.
 * @returns A random element from the array.
 * @example
 * sample([1, 2, 3, 4]); // returns a random element from the array
 * sample(['a', 'b', 'c', 'd']); // returns a random element from the array
 */
export const sample = <T>(array: T[]): T =>
    array[Math.floor(Math.random() * array.length)];

/**
 * Remove an element from an array.
 * @param array - The array to remove the element from.
 * @param item - The element to remove.
 * @returns The input array with the element removed.
 * @example
 * remove([1, 2, 3, 4], 2); // returns [1, 3, 4]
 * remove(['a', 'b', 'c', 'd'], 'b'); // returns ['a', 'c', 'd']
 */
export const remove = <T>(array: T[], item: T): T[] => {
    return array.filter((i) => i !== item);
};

/**
 * Remove falsy values (`null`, `undefined`, `""`, `0`, `false`, `NaN`) from an array.
 * @param array - The array to compact.
 * @returns A new array with falsy values removed.
 * @example
 * compact([1, 2, 3, 4, 0, null, undefined, false]); // returns [1, 2, 3, 4]
 */
export const compact = <T>(array: T[]): T[] => array.filter(Boolean);
