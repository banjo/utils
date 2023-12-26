import { produce } from "./function";
import { isArray, isEqual, isFunction, isNil, isPrimitive, isTruthy } from "./is";
import { getProperty } from "./object";
import { Falsy } from "./types";

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
    return isArray(value) ? value : [value];
};

/**
 * Take the first n elements of an array.
 * @param array - The array to take elements from.
 * @param count - The number of elements to take.
 * @returns - A new array with the first n elements.
 * @example
 * take([1, 2, 3, 4, 5], 2); // returns [1, 2]
 * take(['a', 'b', 'c', 'd', 'e'], 3); // returns ['a', 'b', 'c']
 */
export const take = <T>(array: T[], count: number): T[] => {
    return array.slice(0, count);
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
 * Remove duplicate values from an array by a key. Can also take a custom function that receives the item to choose the value to compare by.
 * @param array - The array to remove duplicates from.
 * @param key - The key to compare by. Can be a string or a function that receives the item and returns the value to compare by.
 * @returns - A new array with duplicate values removed.
 * @example
 * const a = {name: "Alex", age: 20};
 * const b = {name: "Alex", age: 15};
 *
 * // compare by a single key
 * uniqBy([a, b], "name"); // returns [a]
 * uniqBy([a, b], "age"); // returns [a, b]
 *
 * // compare by a custom function
 * uniqBy([a, b], (item) => item.name); // returns [a]
 * uniqBy([a, b], (item) => item.age); // returns [a, b]
 */
export const uniqBy = <T>(array: T[], key: string | ((item: T) => any)): T[] => {
    const keys = new Set();
    return array.filter(item => {
        const value = typeof key === "string" ? getProperty(item, key) : key(item);
        if (keys.has(value)) return false;
        keys.add(value);
        return true;
    });
};

/**
 * Shuffle the elements of an array. Creates a new array with the elements of the original array in a random order.
 * @param array - The array to shuffle.
 * @returns A new array with the elements of the original array in a random order.
 * @example
 * shuffle([1, 2, 3, 4, 5]); // returns [2, 4, 1, 5, 3]
 * shuffle(['a', 'b', 'c', 'd', 'e']); // returns ['b', 'd', 'a', 'e', 'c']
 */
export const shuffle = <T>(array: T[]): T[] => {
    return produce(array, draft => draft.sort(() => Math.random() - 0.5));
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
 * Remove one or more elements from an array. Either by item or by predicate.
 * @param array - The array to remove the element from.
 * @param item - The element to remove or the function to compare.
 * @returns The input array with the element removed.
 * @example
 * remove([1, 2, 3, 4], 2); // returns [1, 3, 4]
 * remove(['a', 'b', 'c', 'd'], 'b'); // returns ['a', 'c', 'd']
 *
 * // remove by a custom function
 * remove([1,2,3], (item) => item === 2); // returns [1, 3]
 * remove(['a', 'b', 'c', 'd'], (item) => item === 'b'); // returns ['a', 'c', 'd']
 */
export function remove<T>(array: T[], item: T): T[];
export function remove<T>(array: T[], predicate: (item: T) => boolean): T[];
export function remove<T>(array: T[], itemOrFunction: T | ((item: T) => boolean)): T[] {
    if (isFunction(itemOrFunction)) {
        const predicate = (item: T) => !itemOrFunction(item);
        return array.filter(predicate);
    }

    return array.filter(i => i !== itemOrFunction);
}

/**
 * Remove falsy values (`null`, `undefined`, `""`, `0`, `false`, `NaN`) from an array.
 * @param array - The array to compact.
 * @returns A new array with falsy values removed.
 * @example
 * compact([1, 2, 3, 4, 0, null, undefined, false]); // returns [1, 2, 3, 4]
 */
export const compact = <T>(array: (T | Falsy)[]): T[] => array.filter(isTruthy);

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
 * Union multiple arrays. Objects are compared by value, meaning that two objects with the same properties will be considered equal.
 * @param arrays - The arrays to union.
 * @returns A new array with the values included.
 * @example
 * union([1, 2, 3], [2, 4]); // returns [1, 2, 3, 4]
 * union(['a', 'b', 'c'], ['b', 'd']); // returns ['a', 'b', 'c', 'd']
 *
 * // multiple arrays
 * union([1, 2, 3], [2, 4], [5, 6]); // returns [1, 2, 3, 4, 5, 6]
 */
export const union = <T>(...arrays: T[]) => uniq(arrays.flat());
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
 * Group an array by a key. Can also take a custom function that receives the item to choose the value to group by.
 * @param array - The array to group.
 * @param key - The key to group by. Can be a string or a function that receives the item and returns the value to group by.
 * @returns - An object with the grouped items.
 * @example
 * const a = {name: "Alex", age: 20};
 * const b = {name: "Alex", age: 15};
 * const c = {name: "Bony", age: 5};
 *
 * groupBy([a, b, c], "name"); // returns {Alex: [a, b], Bony: [c]}
 * groupBy([a, b, c], "age"); // returns {5: [c], 15: [b], 20: [a]}
 *
 * groupBy([a, b, c], (item) => item.name); // returns {Alex: [a, b], Bony: [c]}
 * groupBy([a, b, c], (item) => item.age); // returns {5: [c], 15: [b], 20: [a]}
 */
export const groupBy = <T>(array: T[], key: string | ((item: T) => any)): Record<string, T[]> => {
    const groups: Record<string, T[]> = {};

    array.forEach(item => {
        const value = typeof key === "string" ? getProperty(item, key) : key(item);
        if (!groups[value]) groups[value] = [];
        groups[value].push(item);
    });

    return groups;
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
 * includes(values, valueToCheck); // returns true
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

type ZipInput<T extends any[]> = { [K in keyof T]: T[K][] };
type ZipOutput<T extends any[]> = { [K in keyof T]: T[K] }[];

/**
 * Zip multiple arrays into a single array of arrays. The first element of the result array will contain the first element of all the input arrays, the second element of the result array will contain the second element of all the input arrays, and so on.
 * @param arrays - The arrays to zip.
 * @returns - An array of arrays with the zipped values.
 * @example
 * zip([1, 2, 3], [4, 5, 6]); // returns [[1, 4], [2, 5], [3, 6]]
 * zip([1, 2, 3], ["a", "b", "c"]); // returns [[1, "a"], [2, "b"], [3, "c"]]
 */
export function zip<T extends any[]>(...arrays: ZipInput<T>): ZipOutput<T> {
    const length = Math.max(...arrays.map(array => array.length));
    const result: any[] = [];
    for (let i = 0; i < length; i++) {
        result.push(arrays.map(array => array[i]));
    }
    return result as ZipOutput<T>;
}

/**
 * Partition an array into two arrays. The first array will contain the items that pass the predicate function, the second array will contain the items that don't pass the predicate function.
 * @param array - The array to partition.
 * @param predicate - The predicate function to use.
 * @returns - An array containing two arrays, the first array contains the items that pass the predicate function, the second array contains the items that don't pass the predicate function.
 * @example
 * const a = {name: "Alex", age: 20};
 * const b = {name: "Alex", age: 15};
 *
 * partition([a, b], (item) => item.age > 18); // returns [[a], [b]]
 *
 * const values = [1, 2, 3, 4, 5];
 * partition(values, (item) => item % 2 === 0); // returns [[2, 4], [1, 3, 5]]
 */
export const partition = <T>(array: T[], predicate: (item: T) => boolean): [T[], T[]] => {
    const truthy: T[] = [];
    const falsy: T[] = [];

    array.forEach(item => {
        if (predicate(item)) truthy.push(item);
        else falsy.push(item);
    });

    return [truthy, falsy];
};

/**
 * Return the sum of all the elements in an array.
 * @param array - The array to sum.
 * @returns - The sum of all the elements in the array.
 * @example
 * sum([1, 2, 3, 4, 5]); // returns 15
 */
export const sum = (array: number[]): number => array.reduce((a, b) => a + b, 0);
