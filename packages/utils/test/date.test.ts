import { describe, expect, it } from "vitest";
import {
    earliest,
    formatDate,
    getCalendarDays,
    getFirstDayOfWeek,
    getCalendarMonths,
    getWeekNumber,
    isBetweenDates,
    latest,
    toDays,
    toHours,
    toMilliseconds,
    toSeconds,
} from "../src/utils/date";

describe("date", () => {
    it("getCalendarMonths", () => {
        expect(getCalendarMonths()).toEqual([
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ]);

        expect(getCalendarMonths({ format: "short" })).toEqual([
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ]);

        expect(getCalendarMonths({ format: "narrow" })).toEqual([
            "J",
            "F",
            "M",
            "A",
            "M",
            "J",
            "J",
            "A",
            "S",
            "O",
            "N",
            "D",
        ]);

        expect(getCalendarMonths({ locales: "fr-FR" })).toEqual([
            "janvier",
            "février",
            "mars",
            "avril",
            "mai",
            "juin",
            "juillet",
            "août",
            "septembre",
            "octobre",
            "novembre",
            "décembre",
        ]);
    });

    it("getCalendarDays", () => {
        expect(getCalendarDays()).toEqual([
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
        ]);

        expect(getCalendarDays({ format: "short" })).toEqual([
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat",
            "Sun",
        ]);

        expect(getCalendarDays({ format: "narrow" })).toEqual(["M", "T", "W", "T", "F", "S", "S"]);

        expect(getCalendarDays({ startOnMonday: false })).toEqual([
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
        ]);

        expect(getCalendarDays({ locales: "fr-FR" })).toEqual([
            "lundi",
            "mardi",
            "mercredi",
            "jeudi",
            "vendredi",
            "samedi",
            "dimanche",
        ]);

        expect(getCalendarDays({ locales: "sv-SE" })).toEqual([
            "måndag",
            "tisdag",
            "onsdag",
            "torsdag",
            "fredag",
            "lördag",
            "söndag",
        ]);

        expect(getCalendarDays({ locales: "sv-SE", startOnMonday: false })).toEqual([
            "söndag",
            "måndag",
            "tisdag",
            "onsdag",
            "torsdag",
            "fredag",
            "lördag",
        ]);
    });

    it("toMilliseconds", () => {
        expect(toMilliseconds({ milliseconds: 10 })).toBe(10);
        expect(toMilliseconds({ seconds: 10 })).toBe(10000);
        expect(toMilliseconds({ minutes: 10 })).toBe(600000);
        expect(toMilliseconds({ hours: 10 })).toBe(36000000);
        expect(toMilliseconds({ days: 10 })).toBe(864000000);

        expect(toMilliseconds({ seconds: 10, minutes: 10 })).toBe(610000);
        expect(toMilliseconds({ seconds: 10, minutes: 10, hours: 10 })).toBe(36610000);
    });

    it("toSeconds", () => {
        expect(toSeconds({ milliseconds: 10000 })).toBe(10);
        expect(toSeconds({ seconds: 10 })).toBe(10);
        expect(toSeconds({ minutes: 10 })).toBe(600);
        expect(toSeconds({ hours: 10 })).toBe(36000);
        expect(toSeconds({ days: 10 })).toBe(864000);
    });

    it("toHours", () => {
        expect(toHours({ milliseconds: 3600000 })).toBe(1);
        expect(toHours({ seconds: 3600 })).toBe(1);
        expect(toHours({ minutes: 60 })).toBe(1);
        expect(toHours({ hours: 1 })).toBe(1);
        expect(toHours({ days: 10 })).toBe(240);
    });

    it("toDays", () => {
        expect(toDays({ milliseconds: 86400000 })).toBe(1);
        expect(toDays({ seconds: 86400 })).toBe(1);
        expect(toDays({ minutes: 1440 })).toBe(1);
        expect(toDays({ hours: 24 })).toBe(1);
        expect(toDays({ days: 1 })).toBe(1);
    });

    it("earliest", () => {
        const date1 = new Date("2021-01-01");
        const date2 = new Date("2021-01-02");

        expect(earliest([date1, date2])).toBe(date1);
        expect(earliest([date2, date1])).toBe(date1);

        const date3 = new Date("2021-01-03");
        expect(earliest([date1, date2, date3])).toBe(date1);
    });

    it("latest", () => {
        const date1 = new Date("2021-01-01");
        const date2 = new Date("2021-01-02");

        expect(latest([date1, date2])).toBe(date2);
        expect(latest([date2, date1])).toBe(date2);

        const date3 = new Date("2021-01-03");
        expect(latest([date1, date2, date3])).toBe(date3);
    });
    it("isBetweenDates", () => {
        const date1 = new Date("2021-01-01");
        const date2 = new Date("2021-01-02");
        const date3 = new Date("2021-01-03");

        expect(isBetweenDates(date2, date1, date3)).toBe(true);
        expect(isBetweenDates(date1, date2, date3)).toBe(false);
    });

    it("formatDate", () => {
        expect(formatDate(new Date(2022, 0, 1))).toBe("2022-01-01");
        expect(formatDate(new Date(2022, 2, 10))).toBe("2022-03-10");
    });

    it("getFirstDayOfWeek", () => {
        expect(getFirstDayOfWeek(new Date("2023-04-09"))).toStrictEqual(new Date("2023-04-03"));
        expect(getFirstDayOfWeek(new Date("2023-03-09"))).toStrictEqual(new Date("2023-03-06"));
    });

    it("getWeekNumber", () => {
        expect(getWeekNumber(new Date("2023-04-09"))).toBe(14);
        expect(getWeekNumber(new Date("2023-03-09"))).toBe(10);
    });
});
