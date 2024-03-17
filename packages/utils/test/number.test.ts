import { describe, expect, it } from "vitest";
import { range } from "../src";
import { parseNumber, random } from "../src/utils/number";

describe("number", () => {
    it("random", () => {
        range(100).forEach(() => {
            const r = random(1, 5);
            expect(r).toBeGreaterThanOrEqual(1);
            expect(r).toBeLessThanOrEqual(5);
        });

        range(100).forEach(() => {
            const r = random(5);
            expect(r).toBeGreaterThanOrEqual(0);
            expect(r).toBeLessThanOrEqual(5);
        });

        range(100).forEach(() => {
            const r = random(5, true);
            expect(r).toBeGreaterThanOrEqual(0);
            expect(r).toBeLessThanOrEqual(5);
            expect(r.toString()).toContain(".");
        });

        range(100).forEach(() => {
            const r = random(0, 5, true);
            expect(r).toBeGreaterThanOrEqual(0);
            expect(r).toBeLessThanOrEqual(5);
            expect(r.toString()).toContain(".");
        });
    });

    it("parseNumber", () => {
        expect(parseNumber("1")).toBe(1);
        expect(parseNumber("1.5")).toBe(1.5);
        expect(parseNumber("1.5.5")).toBe(undefined);
        expect(parseNumber("")).toBe(undefined);
        expect(parseNumber("fifty")).toBe(undefined);
        expect(parseNumber("1,5")).toBe(undefined);
    });
});
