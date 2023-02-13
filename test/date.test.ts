import { describe, expect, it } from "vitest";
import { getDays, getMonths } from "../src/utils/date";

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
});
