import { describe, expect, it } from "vitest";
import {
    capitalize,
    escapeHtml,
    escapeRegExp,
    isEmptyString,
    unescapeHtml,
} from "../src/utils/string";
import {
    ensurePrefix,
    ensureSuffix,
    randomString,
    template,
} from "./../src/utils/string";

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
        expect(random).toHaveLength(16);
        expect(random).toBeTruthy();

        const random2 = randomString(5);
        expect(random2).toHaveLength(5);
        expect(random2).toBeTruthy();
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

    it("template", () => {
        expect(
            template("hello {{name}}", {
                name: "world",
            })
        ).toBe("hello world");
        expect(
            template("hello {{name}}, my name is {{name}}", {
                name: "world",
            })
        ).toBe("hello world, my name is world");

        expect(
            template("hello {{name}}, my name is {{me}}", {
                name: "world",
                me: "Kent",
            })
        ).toBe("hello world, my name is Kent");

        expect(
            template("hello {{name}}, my name is {{me}}", {
                name: "world",
            })
        ).toBe("hello world, my name is {{me}}");

        expect(
            template("hello {{name}}, my name is {{me}}", {
                name: "world",
                me: "Kent",
                age: "20",
            })
        ).toBe("hello world, my name is Kent");
        expect(
            template("hello {{ name }}, my name is {{  me  }}", {
                name: "world",
                me: "Kent",
            })
        ).toBe("hello world, my name is Kent");

        expect(template("hello {0}", "world")).toBe("hello world");
        expect(template("hello {0}, my name is {0}", "world")).toBe(
            "hello world, my name is world"
        );
        expect(template("hello {0}, my name is {1}", "world", "Kent")).toBe(
            "hello world, my name is Kent"
        );
        expect(template("hello {0}, my name is {1}", "world")).toBe(
            "hello world, my name is {1}"
        );
        expect(
            template("hello {0}, my name is {1}", "world", "Kent", "20")
        ).toBe("hello world, my name is Kent");
    });

    it("escape html", () => {
        expect(escapeHtml("<div>hello</div>")).toBe(
            "&lt;div&gt;hello&lt;/div&gt;"
        );
        expect(escapeHtml("<div><span>hello</span></div>")).toBe(
            "&lt;div&gt;&lt;span&gt;hello&lt;/span&gt;&lt;/div&gt;"
        );
    });

    it("unescape html", () => {
        expect(unescapeHtml("&lt;div&gt;hello&lt;/div&gt;")).toBe(
            "<div>hello</div>"
        );
        expect(
            unescapeHtml(
                "&lt;div&gt;&lt;span&gt;hello&lt;/span&gt;&lt;/div&gt;"
            )
        ).toBe("<div><span>hello</span></div>");
    });

    it("escape regexep", () => {
        expect(escapeRegExp("hello")).toBe("hello");
        expect(escapeRegExp("hello world")).toBe("hello world");

        expect(escapeRegExp("hello*")).toBe("hello\\*");
        expect(escapeRegExp("hello?")).toBe("hello\\?");
        expect(escapeRegExp("hello+")).toBe("hello\\+");
        expect(escapeRegExp("hello.")).toBe("hello\\.");
        expect(escapeRegExp("hello^")).toBe("hello\\^");
        expect(escapeRegExp("hello$")).toBe("hello\\$");
        expect(escapeRegExp("hello|")).toBe("hello\\|");
        expect(escapeRegExp("hello(")).toBe("hello\\(");
        expect(escapeRegExp("hello this .. is * a long / sentence ***")).toBe(
            "hello this \\.\\. is \\* a long \\/ sentence \\*\\*\\*"
        );
    });
});
