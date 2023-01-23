import { randomString } from "./../src/utils/string";
import { capitalize, isEmptyString } from "../src/utils/string";
import { it, describe, expect } from "vitest";

describe("string", () => {
    it("capitalize", () => {
        expect(capitalize("hello")).toBe("Hello");
        expect(capitalize("hello world")).toBe("Hello world");
        expect(capitalize("HELLO WORLD!")).toBe("Hello world!");
    });

    it("isEmptyString", () => {
        expect(isEmptyString("")).toBe(true);
        expect(isEmptyString(" ")).toBe(false);
        expect(isEmptyString("hello")).toBe(false);
    });

    it("randomString", () => {
        const random = randomString();
        expect(random).toHaveLength(10);
        expect(random).toBeTruthy();

        const random2 = randomString(5);
        expect(random2).toHaveLength(5);
        expect(random2).toBeTruthy();
    });
});
