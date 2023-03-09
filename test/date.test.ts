import { describe, expect, it } from "vitest";
import {
    earliest,
    getDays,
    getMonths,
    isBetweenDates,
    latest,
    toMilliseconds,
} from "../src/utils/date";

describe("date", () => {
    it("getMonths", () => {
        expect(getMonths()).toEqual([
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

        expect(getMonths({ format: "short" })).toEqual([
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

        expect(getMonths({ format: "narrow" })).toEqual([
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

        expect(getMonths({ locales: "fr-FR" })).toEqual([
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

    it("getDays", () => {
        expect(getDays()).toEqual([
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
        ]);

        expect(getDays({ format: "short" })).toEqual([
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat",
            "Sun",
        ]);

        expect(getDays({ format: "narrow" })).toEqual([
            "M",
            "T",
            "W",
            "T",
            "F",
            "S",
            "S",
        ]);

        expect(getDays({ startOnMonday: false })).toEqual([
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
        ]);

        expect(getDays({ locales: "fr-FR" })).toEqual([
            "lundi",
            "mardi",
            "mercredi",
            "jeudi",
            "vendredi",
            "samedi",
            "dimanche",
        ]);

        expect(getDays({ locales: "sv-SE" })).toEqual([
            "måndag",
            "tisdag",
            "onsdag",
            "torsdag",
            "fredag",
            "lördag",
            "söndag",
        ]);

        expect(getDays({ locales: "sv-SE", startOnMonday: false })).toEqual([
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
        expect(toMilliseconds({ seconds: 10 })).toBe(10000);
        expect(toMilliseconds({ minutes: 10 })).toBe(600000);
        expect(toMilliseconds({ hours: 10 })).toBe(36000000);
        expect(toMilliseconds({ days: 10 })).toBe(864000000);

        expect(toMilliseconds({ seconds: 10, minutes: 10 })).toBe(610000);
        expect(toMilliseconds({ seconds: 10, minutes: 10, hours: 10 })).toBe(
            36610000
        );
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
});
