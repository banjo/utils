import currentWeekNumber from "current-week-number";
import { range, sortBy } from "./array";
import { defaults } from "./object";

/**
 * Utility functions for date and time.
 */

type MonthOptions = {
    format?: "long" | "short" | "narrow" | "numeric" | "2-digit";
    locales?: string;
};

const defaultMonthOptions: MonthOptions = {
    format: "long",
    locales: "en-US",
};

/**
 * Returns an array of month names. The array is zero-based, so the first month is January.
 * @param options - Options object.
 * @returns An array of month names.
 * @example
 * getCalendarMonths(); // returns ['January', 'February', ...]
 * getCalendarMonths({ month: 'short' }); // returns ['Jan', 'Feb', ...]
 * getCalendarMonths({ month: 'narrow' }); // returns ['J', 'F', ...]
 * getCalendarMonths({ month: 'numeric' }); // returns ['1', '2', ...]
 *
 * getCalendarMonths({ locales: 'fr-FR' }); // returns ['janvier', 'février', ...]
 * getCalendarMonths({ locales: 'sv-SE' }); // returns ['januari', 'februari', ...]
 */
export const getCalendarMonths = (options?: MonthOptions): string[] => {
    const { locales, format } = defaults(options, defaultMonthOptions);
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

const defaultDayOptions: DayOptions = {
    format: "long",
    locales: "en-US",
    startOnMonday: true,
};

/**
 * Returns an array of day names. The array is zero-based. The first day is Monday by default.
 * @param options - Options object.
 * @returns An array of day names.
 * @example
 * getCalendarDays(); // returns ['Monday', 'Tuesday', ...]
 * getCalendarDays({ day: 'short' }); // returns ['Mon', 'Tue', ...]
 * getCalendarDays({ day: 'narrow' }); // returns ['M', 'T', ...]
 * getCalendarDays({ startOnMonday: false }); // returns ['Sunday', 'Monday', ...]
 *
 * getCalendarDays({ locales: 'fr-FR' }); // returns ['lundi', 'mardi', ...]
 * getCalendarDays({ locales: 'sv-SE' }); // returns ['måndag', 'tisdag', ...]
 * getCalendarDays({ locales: 'sv-SE', startOnMonday: false }); // returns ['söndag', 'måndag', ...]
 */
export const getCalendarDays = (options?: DayOptions): string[] => {
    const { locales, format, startOnMonday } = defaults(options, defaultDayOptions);

    return range(7).map(i => {
        const date = new Date(0, 0, startOnMonday ? i + 1 : i);
        return date.toLocaleString(locales, { weekday: format });
    });
};

type TimeProps = {
    milliseconds?: number;
    seconds?: number;
    minutes?: number;
    hours?: number;
    days?: number;
};

const defaultProps = {
    milliseconds: 0,
    seconds: 0,
    minutes: 0,
    hours: 0,
    days: 0,
};

/**
 * Converts a time unit to milliseconds. Combine all units to get the total time in milliseconds.
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
export const toMilliseconds = (props: TimeProps) => {
    if (!props) {
        throw new Error("You must pass an object with a time definition.");
    }

    const { seconds, minutes, hours, days, milliseconds } = defaults(props, defaultProps);

    return (
        milliseconds +
        seconds * 1000 +
        minutes * 1000 * 60 +
        hours * 1000 * 60 * 60 +
        days * 1000 * 60 * 60 * 24
    );
};

/**
 * Converts a time unit to seconds. Combine all units to get the total time in seconds.
 * @param props - Object with definition or array of objects with definition.
 * @returns - Time in seconds.
 * @example
 * toSeconds({ seconds: 10 }); // returns 10
 * toSeconds({ minutes: 10 }); // returns 600
 * toSeconds({ hours: 10 }); // returns 36000
 * toSeconds({ days: 10 }); // returns 864000
 */
export const toSeconds = (props: TimeProps) => toMilliseconds(props) / 1000;

/**
 * Converts a time unit to minutes. Combine all units to get the total time in minutes.
 * @param props - Object with definition or array of objects with definition.
 * @returns - Time in minutes.
 * @example
 * toMinutes({ seconds: 10 }); // returns 0.16666666666666666
 * toMinutes({ minutes: 10 }); // returns 10
 * toMinutes({ hours: 10 }); // returns 600
 * toMinutes({ days: 10 }); // returns 14400
 */
export const toMinutes = (props: TimeProps) => toSeconds(props) / 60;

/**
 * Converts a time unit to hours. Combine all units to get the total time in hours.
 * @param props - Object with definition or array of objects with definition.
 * @returns - Time in hours.
 * @example
 * toHours({ seconds: 10 }); // returns 0.002777777777777778
 * toHours({ minutes: 10 }); // returns 0.16666666666666666
 * toHours({ hours: 10 }); // returns 10
 * toHours({ days: 10 }); // returns 240
 */
export const toHours = (props: TimeProps) => toMinutes(props) / 60;

/**
 * Converts a time unit to days. Combine all units to get the total time in days.
 * @param props - Object with definition or array of objects with definition.
 * @returns - Time in days.
 * @example
 * toDays({ seconds: 10 }); // returns 0.00011574074074074074
 * toDays({ minutes: 10 }); // returns 0.006944444444444444
 * toDays({ hours: 10 }); // returns 0.4166666666666667
 * toDays({ days: 10 }); // returns 10
 */
export const toDays = (props: TimeProps) => toHours(props) / 24;

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
 * Format date to ISO 8601 format. YYYY-MM-DD.
 * @param date - Date to format.
 * @returns - Formatted date as a string.
 * @example
 * toIsoDateString(new Date(2020, 0, 1)); // returns '2020-01-01'
 */
export const toIsoDateString = (date: Date): string => {
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
export const getWeekNumber = (date = new Date()): number => currentWeekNumber(date);

/**
 * Parse a date string or date object to a Date object based on the provided options.
 * If a Date object is passed, it is returned as is.
 * If throws is true and the date is invalid, it throws an error.
 * If throws is false and the date is invalid, it returns undefined. This is the default behavior.
 * @param date - Date string or date object to parse.
 * @param options - Object with a boolean throws property.
 * @returns - Date object or undefined based on provided options.
 * @example
 * parseDate("2020-01-01"); // returns Date object or returns undefined if invalid
 * parseDate("2020-01-01", { throws: true }); // returns Date object or throws error if invalid
 * parseDate(new Date("2020-01-01")); // returns Date object
 * parseDate(123456789, { throws: true }); // throws error
 * parseDate({}, { throws: false }); // returns undefined
 * parseDate([], { throws: false }); // returns undefined
 */
export function parseDate(date: unknown): Date | undefined;
export function parseDate(date: unknown, options: { throws: true }): Date;
export function parseDate(date: unknown, options: { throws: boolean }): Date | undefined;
export function parseDate(date: unknown, { throws = false } = {}): Date | undefined {
    if (date instanceof Date) {
        return date;
    }

    if (typeof date === "string") {
        const parsedDate = new Date(date);
        if (!isNaN(parsedDate.getTime())) {
            return parsedDate;
        }
    }

    if (!throws) {
        return undefined;
    }

    throw new Error("Invalid date format. Must be a string or a Date object.");
}
