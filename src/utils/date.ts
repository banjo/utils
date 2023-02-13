import { range } from "./array";

/**
 * Utility functions for date and time.
 */

type MonthOptions = {
    format?: "long" | "short" | "narrow" | "numeric" | "2-digit";
    locales?: string;
};

const defaultMonthOptions = {
    format: "long",
    locales: "en-US",
} as const;

/**
 * Returns an array of month names. The array is zero-based, so the first month is January.
 * @param options
 * @returns An array of month names.
 * @example
 * getMonths(); // returns ['January', 'February', ...]
 * getMonths({ month: 'short' }); // returns ['Jan', 'Feb', ...]
 * getMonths({ month: 'narrow' }); // returns ['J', 'F', ...]
 * getMonths({ month: 'numeric' }); // returns ['1', '2', ...]
 *
 * getMonths({ locales: 'fr-FR' }); // returns ['janvier', 'février', ...]
 * getMonths({ locales: 'sv-SE' }); // returns ['januari', 'februari', ...]
 */
export const getMonths = (options?: MonthOptions): string[] => {
    const { locales, format } = { ...defaultMonthOptions, ...options };
    return range(12).map((i) => {
        const date = new Date(0, i);
        return date.toLocaleString(locales, { month: format });
    });
};

type DayOptions = {
    format?: "long" | "short" | "narrow";
    locales?: string;
    startOnMonday?: boolean;
};

const defaultDayOptions = {
    format: "long",
    locales: "en-US",
    startOnMonday: true,
} as const;

/**
 * Returns an array of day names. The array is zero-based. The first day is Monday by default.
 * @param options
 * @returns An array of day names.
 * @example
 * getDays(); // returns ['Monday', 'Tuesday', ...]
 * getDays({ day: 'short' }); // returns ['Mon', 'Tue', ...]
 * getDays({ day: 'narrow' }); // returns ['M', 'T', ...]
 * getDays({ startOnMonday: false }); // returns ['Sunday', 'Monday', ...]
 *
 * getDays({ locales: 'fr-FR' }); // returns ['lundi', 'mardi', ...]
 * getDays({ locales: 'sv-SE' }); // returns ['måndag', 'tisdag', ...]
 * getDays({ locales: 'sv-SE', startOnMonday: false }); // returns ['söndag', 'måndag', ...]
 */
export const getDays = (options?: DayOptions): string[] => {
    const { locales, format, startOnMonday } = {
        ...defaultDayOptions,
        ...options,
    };

    return range(7).map((i) => {
        const date = new Date(0, 0, startOnMonday ? i + 1 : i);
        return date.toLocaleString(locales, { weekday: format });
    });
};
