import { describe, expect, it } from "vitest";
import { decrypt, encrypt, hash, uuid } from "../src/utils/crypto";

describe("crypto", () => {
    it("uuid", () => {
        expect(uuid()).toHaveLength(36);
        expect(uuid()).toBeTruthy();
        expect(uuid()).not.toBe(uuid());
        expect(uuid()).toMatch(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
        );
    });

    it("encrypt and decrypt", async () => {
        const KEY = "12345678901234567890123456789012";
        const data = "hello world";

        const encrypted = await encrypt(data, KEY);
        expect(encrypted).not.toBe(data);

        const decrypted = await decrypt(encrypted, KEY);
        expect(decrypted).toBe(data);
    });

    it("hash", () => {
        expect(hash("hello world")).toBe("uU0nuZNNPg");
        expect(hash({ a: 1, b: 2, c: 3 })).toBe("1SDFj8s7Im");
        expect(hash("a")).not.toBe(hash("b"));

        const hash1 = { hello: "world" };
        expect(hash(hash1)).toBe(hash(hash1));
    });
});
