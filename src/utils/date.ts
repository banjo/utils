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
 * @param options - Options object.
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
 * @param options - Options object.
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

type Props = {
    time: number;
    unit: "second" | "minute" | "hour" | "day";
};

const converter = (time: number, unit: Props["unit"]) => {
    switch (unit) {
        case "second":
            return time * 1000;
        case "minute":
            return time * 1000 * 60;
        case "hour":
            return time * 1000 * 60 * 60;
        case "day":
            return time * 1000 * 60 * 60 * 24;
    }
};

/**
 * Converts a time unit to milliseconds. If an array of objects is passed, the values are summed.
 * @param props - Object with definition or array of objects with definition.
 * @returns Time in milliseconds.
 * @example
 * getMilliseconds({ time: 1, unit: 'second' }); // returns 1000
 * getMilliseconds({ time: 1, unit: 'minute' }); // returns 60000
 * getMilliseconds({ time: 1, unit: 'hour' }); // returns 3600000
 * getMilliseconds({ time: 1, unit: 'day' }); // returns 86400000
 *
 * getMilliseconds([{ time: 1, unit: 'second' }, { time: 1, unit: 'minute' }]); // returns 61000
 * getMilliseconds([{ time: 1, unit: 'hour' }, { time: 1, unit: 'day' }]); // returns 90060000
 */
export const getMilliseconds = (props: Props | Array<Props>): number => {
    if (Array.isArray(props)) {
        return props.reduce((acc, { time, unit }) => {
            return acc + converter(time, unit);
        }, 0);
    } else {
        return converter(props.time, props.unit);
    }
};
