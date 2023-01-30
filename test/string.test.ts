import {
    camelCase,
    ensurePrefix,
    ensureSuffix,
    kebabCase,
    randomString,
} from "./../src/utils/string";
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

    it("camelCase", () => {
        expect(camelCase("hello world")).toBe("helloWorld");
        expect(camelCase("")).toBe("");
        expect(camelCase("this is a long string")).toBe("thisIsALongString");
        expect(camelCase("this-is-a-long-string")).toBe("thisIsALongString");
    });

    it("kebabCase", () => {
        expect(kebabCase("hello world")).toBe("hello-world");
        expect(kebabCase("hello_world")).toBe("hello-world");
        expect(kebabCase("helloWorld")).toBe("hello-world");
        expect(kebabCase("")).toBe("");
        expect(kebabCase("hello-world-already")).toBe("hello-world-already");
    });

    it("ensurePrefix", () => {
        expect(ensurePrefix("hello", "world")).toBe("worldhello");
        expect(ensurePrefix("hello", "hello")).toBe("hello");
        expect(ensurePrefix("hello", "")).toBe("hello");
        expect(ensurePrefix("hello", " ")).toBe(" hello");
        expect(ensurePrefix("hello", "5p-")).toBe("5p-hello");
    });

    it("ensureSuffix", () => {
        expect(ensureSuffix("hello", "world")).toBe("helloworld");
        expect(ensureSuffix("hello", "hello")).toBe("hello");
        expect(ensureSuffix("hello", "")).toBe("hello");
        expect(ensureSuffix("hello", " ")).toBe("hello ");
        expect(ensureSuffix("hello", "-5p")).toBe("hello-5p");
    });
});
