import { objectKeys } from "./object";

/**
 * Utility for selecting elements from the DOM. Simplifies the process of working with the DOM.
 */

/**
 * Selects a single element from the DOM,
 * or returns null if no element is found. Can search a parent as well.
 * Can also be used to check if element exists or fetch an array of elements.
 * @param selector - The CSS selector to use.
 * @param context - The parent element to search within.
 * @returns The element or null if not found.
 * @example
 * select("#test"); // returns element
 * select("#test", parent); // returns element if it exists within parent
 * select.exists("#test"); // returns true if element exists
 * select.all(".test"); // returns array of elements
 * select.style(element, { color: "red" }); // sets the color of the element to red
 */
const select = <T = HTMLElement>(
    selector: string,
    context: Document | HTMLElement = document
): T | null => {
    return <T>context.querySelector(selector);
};

/**
 * Check if an element exists in the DOM. Will default to search in the document.
 * @param selector - The CSS selector to use.
 * @param context - The parent element to search within.
 * @returns True if element exists, false otherwise.
 * @example
 * select.exists("#test"); // returns true if element exists
 * select.exists("#test", parent); // returns true if element exists within parent
 */
const exists = (
    selector: string,
    context: HTMLElement | Document = document
): boolean => !!select(selector, context);
/**
 * Selects all elements from the DOM as an array, or returns an empty array if no elements are found.
 * Can search a parent as well.
 * @param selector - The CSS selector to use.
 * @param context - The parent element to search within.
 * @returns The array of elements or an empty array if none are found.
 * @example
 * select.all(".test"); // [element1, element2, ...]
 * select.all(".test", parent); // [element1, element2, ...]
 */
const all = <T = HTMLElement>(
    selector: string,
    context: HTMLElement | Document = document
): T[] => <T[]>Array.from(context.querySelectorAll(selector));

/**
 * Set the style of an element. Can set multiple styles at once. Will not overwrite existing styles.
 * @param element - The element to set the style of.
 * @param styles - The styles to set.
 * @example
 * select.style(element, { color: "red" });
 * select.style(element, { color: "red", backgroundColor: "blue" });
 * select.style(element, { color: "red", backgroundColor: "blue", display: "block" });
 */
const style = (element: HTMLElement, styles: Record<string, string>) =>
    objectKeys(styles).forEach((name) => {
        // @ts-ignore
        return (element.style[name] = styles[name]);
    });

select.exists = exists;
select.all = all;
select.style = style;

export { select };
