import { beforeEach, describe, expect, it } from "vitest";
import { select } from "../src/utils/select";

// @vitest-environment happy-dom
describe("select", () => {
    beforeEach(() => {
        document.body.innerHTML = "";
    });

    describe("select", () => {
        it("should find an element by selector", () => {
            const el = document.createElement("div");
            el.id = "test";
            document.body.appendChild(el);

            expect(select("#test")).toBe(el);
        });

        it("should find an element by selector from a parent", () => {
            const el = document.createElement("div");
            el.id = "test";
            const parent = document.createElement("div");
            parent.appendChild(el);

            expect(select("#test", parent)).toBe(el);
        });

        it("should find an element by selector from a parent", () => {
            const el = document.createElement("div");
            el.id = "test";
            const parent = document.createElement("div");
            parent.appendChild(el);

            expect(select("#test", parent)).toBe(el);
        });

        it("should return null when no element is found", () => {
            expect(select("#test")).toBe(null);
        });
    });

    describe("exists", () => {
        it("should return true when an element is found", () => {
            const el = document.createElement("div");
            el.id = "test";
            document.body.appendChild(el);

            expect(select.exists("#test")).toBe(true);
        });

        it("should return true when an element is found from a parent", () => {
            const el = document.createElement("div");
            el.id = "test";
            const parent = document.createElement("div");
            parent.appendChild(el);

            expect(select.exists("#test", parent)).toBe(true);
        });

        it("should return false when no element is found", () => {
            expect(select.exists("#test")).toBe(false);
        });
    });

    describe("all", () => {
        it("should find all elements by selector", () => {
            const el1 = document.createElement("div");
            el1.id = "test";
            const el2 = document.createElement("div");
            el2.id = "test";
            document.body.appendChild(el1);
            document.body.appendChild(el2);

            expect(select.all("#test")).toEqual([el1, el2]);
        });

        it("should find all elements by selector from a parent", () => {
            const el1 = document.createElement("div");
            el1.id = "test";
            const el2 = document.createElement("div");
            el2.id = "test";
            const parent = document.createElement("div");
            parent.appendChild(el1);
            parent.appendChild(el2);

            expect(select.all("#test", parent)).toEqual([el1, el2]);
        });

        it("should return an empty array when no element is found", () => {
            expect(select.all("#test")).toEqual([]);
        });
    });

    describe("style", () => {
        it("should set the style of an element", () => {
            const el = document.createElement("div");
            document.body.appendChild(el);

            select.style(el, { color: "red" });

            expect(el.style.color).toBe("red");
        });
    });
});
