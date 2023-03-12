import { isArray, isEqual, isNil, isPrimitive } from "./is";
import { getProperty } from "./object";

/**
 * Utility functions for working with arrays.
 */

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
 * Shuffle the elements of an array. Creates a new array with the elements of the original array in a random order.
 * @param array - The array to shuffle.
 * @returns A new array with the elements of the original array in a random order.
 * @example
 * shuffle([1, 2, 3, 4, 5]); // returns [2, 4, 1, 5, 3]
 * shuffle(['a', 'b', 'c', 'd', 'e']); // returns ['b', 'd', 'a', 'e', 'c']
 */
export const shuffle = <T>(array: T[]): T[] => {
    return array
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
};

/**
 * Create a chunk of an array. A chunk is a new array containing a specified number of elements from the original array.
 * @param array - The array to chunk.
 * @param size - The size of the chunk.
 * @returns A new array containing the chunked elements.
 * @example
 * chunk([1, 2, 3, 4, 5], 2); // returns [[1, 2], [3, 4], [5]]
 * chunk(['a', 'b', 'c', 'd', 'e'], 3); // returns [['a', 'b', 'c'], ['d', 'e']]
 * chunk([1, 2, 3, 4, 5], 10); // returns [[1, 2, 3, 4, 5]]
 * chunk([1, 2, 3, 4, 5], 1); // returns [[1], [2], [3], [4], [5]]
 * chunk([1, 2, 3, 4, 5], 0); // returns []
 */
export const chunk = <T>(array: T[], size: number): T[][] => {
    if (size <= 0) return [];

    const chunkedArr: T[][] = [];
    let index = 0;
    while (index < array.length) {
        chunkedArr.push(array.slice(index, index + size));
        index += size;
    }
    return chunkedArr;
};

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
export const sample = <T>(array: T[]): T => array[Math.floor(Math.random() * array.length)];

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
    return array.filter(i => i !== item);
};

/**
 * Remove falsy values (`null`, `undefined`, `""`, `0`, `false`, `NaN`) from an array.
 * @param array - The array to compact.
 * @returns A new array with falsy values removed.
 * @example
 * compact([1, 2, 3, 4, 0, null, undefined, false]); // returns [1, 2, 3, 4]
 */
export const compact = <T>(array: T[]): T[] => array.filter(Boolean);

/**
 * Return the difference between two arrays. Objects are compared by value, meaning that two objects with the same properties will be considered equal. Can also take a custom comparator function.
 * @param array - The array to compare.
 * @param values - The values to exclude.
 * @returns A new array with the values excluded.
 * @example
 * // primitives are compared by value
 * difference([1, 2, 3, 4], [2, 4]); // returns [1, 3]
 * difference(['a', 'b', 'c', 'd'], ['b', 'd']); // returns ['a', 'c']
 *
 * // objects are also compared by value by default
 * const obj = {};
 * difference([obj], [obj]); // returns []
 * difference([{ a: 1 }], [{ a: 1 }]); // returns []
 * difference([{ a: 1 }], [{ a: 2 }]); // returns [{ a: 1 }, { a: 2 }]
 *
 * // custom comparator
 * const comparator = (a: any, b: any) => a === b;
 * difference([1, 2, 3, 4], [2, 4], comparator); // returns [1, 3]
 * difference(['a', 'b', 'c', 'd'], ['b', 'd'], comparator); // returns ['a', 'c']
 *
 *
 */
export const difference = <T>(
    array: T[],
    values: T[],
    comparator?: (a: T, b: T) => boolean
): T[] => {
    return array.filter(x => {
        if (comparator) return !values.some(y => comparator(x, y));
        if (isPrimitive(x)) return !values.includes(x);
        return !values.some(y => isEqual(x, y));
    });
};

/**
 * Return the intersection between two arrays. Objects are compared by value, meaning that two objects with the same properties will be considered equal. Can also take a custom comparator function.
 * @param array - The array to compare.
 * @param values - The values to include.
 * @returns A new array with the values included.
 * @example
 * // primitives are compared by value
 * intersection([1, 2, 3, 4], [2, 4]); // returns [2, 4]
 * intersection(['a', 'b', 'c', 'd'], ['b', 'd']); // returns ['b', 'd']
 * intersection([1, 2, 3, 4], [2, 4, 5]); // returns [2, 4]
 *
 * // objects are also compared by value by default
 * const obj = {};
 * intersection([obj], [obj]); // returns [obj]
 * intersection([{ a: 1 }], [{ a: 1 }]); // returns [{ a: 1 }]
 * intersection([{ a: 1 }], [{ a: 2 }]); // returns []
 *
 * // custom comparator
 * const comparator = (a: any, b: any) => a === b;
 * intersection([1, 2, 3, 4], [2, 4], comparator); // returns [2, 4]
 * intersection(['a', 'b', 'c', 'd'], ['b', 'd'], comparator); // returns ['b', 'd']
 */
export const intersection = <T>(
    array: T[],
    values: T[],
    comparator?: (a: T, b: T) => boolean
): T[] => {
    return array.filter(x => {
        if (comparator) return values.some(y => comparator(x, y));
        if (isPrimitive(x)) return values.includes(x);
        return values.some(y => isEqual(x, y));
    });
};

/**
 * Sort an array. Can sort by a single key or multiple keys. Can also take a custom function that receives the item to choose the value to sort by.
 * @param array - The array to sort.
 * @param key - The key to sort by. Can be a string, an array of strings, or a function that receives the item and returns the value to sort by.
 * @param order - The order to sort by. Defaults to asc.
 * @returns A new sorted array.
 * @example
 * const a = {name: "Alex", age: 20};
 * const b = {name: "Alex", age: 15};
 * const c = {name: "Bony", age: 5};
 *
 * // sort by a single key
 * sortBy([a, b, c], "name"); // returns [a, b, c]
 * sortBy([a, b, c], "age"); // returns [c, b, a]
 *
 * // sort by multiple keys
 * sortBy([a, b, c], ["name", "age"]); // returns [b, a, c]
 *
 * // sort by a custom function
 * sortBy([a, b, c], (item) => item.name); // returns [a, b, c]
 * sortBy([a, b, c], (item) => item.age); // returns [c, b, a]
 */
export const sortBy = <T>(
    array: T[],
    key: string | ((item: T) => any) | string[],
    order: "asc" | "desc" = "asc"
): T[] => {
    const handle = (a: unknown, b: unknown) => {
        if (isNil(a) || isNil(b)) return 0;

        if (typeof a === "string" && typeof b === "string") {
            return order === "asc" ? a.localeCompare(b) : b.localeCompare(a);
        }

        if (typeof a === "number" && typeof b === "number") {
            if (a < b) return order === "asc" ? -1 : 1;
            if (a > b) return order === "asc" ? 1 : -1;
        }

        return 0;
    };

    let comparator;
    if (typeof key === "string") {
        comparator = (a: T, b: T) => {
            const aVal = getProperty(a, key);
            const bVal = getProperty(b, key);

            return handle(aVal, bVal);
        };
    } else if (isArray(key)) {
        comparator = (a: T, b: T) => {
            for (let i = 0; i < key.length; i++) {
                const k = key[i];
                const aVal = getProperty(a, k);
                const bVal = getProperty(b, k);

                const result = handle(aVal, bVal);
                if (result !== 0) return result;
            }

            return 0;
        };
    } else {
        comparator = (a: T, b: T) => {
            const aVal = key(a);
            const bVal = key(b);

            return handle(aVal, bVal);
        };
    }

    return [...array].sort(comparator);
};

/**
 * Type guard to check if a value is included in an array. Useful for filtering arrays.
 * @param array - The array to check.
 * @param value - The value to check.
 * @returns - True if the value is included in the array.
 * @example
 * const values = ["a", "b", "c"] as const;
 * const valueToCheck: unknown = "a";
 *
 * if (includes(values, valueToCheck)) {
 *    // valueToCheck is now of type "a" | "b" | "c"
 * }
 */
export const includes = <Type extends SuperType, SuperType = unknown>(
    array: Type[] | readonly Type[],
    value: SuperType
): value is Type => {
    return array.includes(value as Type);
};
