import { random } from "../src/utils/number";
import { expect, describe, it } from "vitest";
import { range } from "../src";

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
    });
});
