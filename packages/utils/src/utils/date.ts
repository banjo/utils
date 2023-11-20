import currentWeekNumber from "current-week-number";
import { range, sortBy } from "./array";

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
    return range(12).map(i => {
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

    return range(7).map(i => {
        const date = new Date(0, 0, startOnMonday ? i + 1 : i);
        return date.toLocaleString(locales, { weekday: format });
    });
};

type Props = {
    seconds?: number;
    minutes?: number;
    hours?: number;
    days?: number;
};

const defaultProps = {
    seconds: 0,
    minutes: 0,
    hours: 0,
    days: 0,
};

/**
 * Converts a time unit to milliseconds. Combined all units to get the total time in milliseconds.
 * @param props - Object with definition or array of objects with definition.
 * @returns Time in milliseconds.
 * @example
 * toMilliseconds({ seconds: 10 }); // returns 10000
 * toMilliseconds({ minutes: 10 }); // returns 600000
 * toMilliseconds({ hours: 10 }); // returns 36000000
 *
 * toMilliseconds({ seconds: 10, minutes: 10 }); // returns 610000
 * toMilliseconds({ seconds: 10, minutes: 10, hours: 10 }); // returns 3610000
 */
export const toMilliseconds = (props: Props) => {
    if (!props) {
        throw new Error("You must pass an object with a time definition.");
    }

    const { seconds, minutes, hours, days } = { ...defaultProps, ...props };

    return (
        seconds * 1000 + minutes * 1000 * 60 + hours * 1000 * 60 * 60 + days * 1000 * 60 * 60 * 24
    );
};

/**
 * Returns the earliest date in an array of dates.
 * @param dates - Array of dates.
 * @returns Earliest date.
 * @example
 * earliest([...dates]);
 *
 * const earlyDate = new Date(2020, 0, 1);
 * const lateDate = new Date(2020, 0, 2);
 *
 * earliest([earlyDate, lateDate]); // returns earlyDate
 */
export const earliest = (dates: Date[]) => {
    const sortedDates = sortBy(dates, v => v.getTime());
    return sortedDates[0];
};

/**
 * Returns the latest date in an array of dates.
 * @param dates - Array of dates.
 * @returns Latest date.
 * @example
 * latest([...dates]);
 *
 * const earlyDate = new Date(2020, 0, 1);
 * const lateDate = new Date(2020, 0, 2);
 *
 * latest([earlyDate, lateDate]); // returns lateDate
 */
export const latest = (dates: Date[]) => {
    const sortedDates = sortBy(dates, v => v.getTime(), "desc");
    return sortedDates[0];
};

/**
 * Returns true if a date is between two other dates.
 * @param date - Date to check.
 * @param earliest - Earliest date.
 * @param latest - Latest date.
 * @returns True if date is between earliest and latest.
 * @example
 * isBetweenDates([...dates]);
 *
 * const earlyDate = new Date(2020, 0, 1);
 * const dateInBetween = new Date(2020, 0, 2);
 * const lateDate = new Date(2020, 0, 3);
 *
 * isBetweenDates(dateInBetween, earlyDate, lateDate); // returns true
 */
export const isBetweenDates = (
    date: string | Date,
    earliest: string | Date,
    latest: string | Date
) => {
    const dateAsDate = new Date(date);
    const earliestAsDate = new Date(earliest);
    const latestAsDate = new Date(latest);

    if (dateAsDate >= earliestAsDate && dateAsDate <= latestAsDate) {
        return true;
    }

    return false;
};

/**
 * Format date to YYYY-MM-DD format.
 * @param date - Date to format.
 * @returns - Formatted date as a string.
 * @example
 * formatDate(new Date(2020, 0, 1)); // returns '2020-01-01'
 */
export const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const paddedMonth = month.toString().padStart(2, "0");
    const paddedDay = day.toString().padStart(2, "0");

    return `${year}-${paddedMonth}-${paddedDay}`;
};

/**
 * Get the first day (monday) of the week.  Defaults to today if nothing is passed.
 * @param date - Date to format, defaults to today.
 * @returns - Date for start of week
 * @example
 * getFirstDayOfWeek(); // returns previous monday
 * getFirstDayOfWeek(new Date("2022-02-02")); // returns previous monday from specified date
 */
export const getFirstDayOfWeek = (date = new Date()) => {
    const dateMonday = new Date(date);
    const day = dateMonday.getDay();
    const diff = dateMonday.getDate() - day + (day === 0 ? -6 : 1);
    dateMonday.setDate(diff);

    return dateMonday;
};

/**
 * Get the week number of the specified date. Defaults to today. Wrapper around "current-week-number".
 * @param date - The date of which to look for a week number. Defaults to today.
 * @returns - The week number as a number
 * @example
 * getWeekNumber(); // returns 5 (if in week 5)
 * getWeekNumber("2020-01-04"); // returns 1
 */
export const getWeekNumber = (date = new Date()): number => {
    return currentWeekNumber(date);
};
