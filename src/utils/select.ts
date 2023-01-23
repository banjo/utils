/**
 * Selects a single element from the DOM,
 * or returns null if no element is found. Can search a parent as well.
 * Can also be used to check if element exists or fetch an array of elements.
 * @param selector - The CSS selector to use.
 * @param parent - The parent element to search within.
 * @returns The element or null if not found.
 * @example
 * select("#test"); // returns element
 * select("#test", parent); // returns element if it exists within parent
 * select.exists("#test"); // returns true if element exists
 * select.all(".test"); // returns array of elements
 */
const select = <T = Element>(selector: string, parent?: Element): T | null => {
    return <T>(parent || document).querySelector(selector);
};

/**
 * Check if an element exists in the DOM. Will default to search in the document.
 * @param selector - The CSS selector to use.
 * @param parent - The parent element to search within.
 * @returns True if element exists, false otherwise.
 * @example
 * select.exists("#test"); // returns true if element exists
 * select.exists("#test", parent); // returns true if element exists within parent
 */
const exists = (selector: string, parent?: Element): boolean => {
    if (parent) return !!select(selector, parent);
    return !!select(selector);
};

/**
 * Selects all elements from the DOM as an array, or returns an empty array if no elements are found.
 * Can search a parent as well.
 * @param selector - The CSS selector to use.
 * @param parent - The parent element to search within.
 * @returns The array of elements or an empty array if none are found.
 * @example
 * select.all(".test"); // [element1, element2, ...]
 * select.all(".test", parent); // [element1, element2, ...]
 */
const all = <T = Element>(selector: string, parent?: Element): T[] => {
    return <T[]>Array.from((parent || document).querySelectorAll(selector));
};

select.exists = exists;
select.all = all;

export { select };
