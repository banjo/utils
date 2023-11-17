import { v4 } from "@lukeed/uuid";
import { hash as ohash } from "ohash";

/**
 * Utility functions for crypto.
 */

/**
 * Create a new UUID. Based on the "lukeed/uuid" library.
 * @returns - The generated UUID.
 * @example
 * uuid(); // returns a random UUID
 * uuid(); // returns another random UUID
 */
export const uuid = (): string => v4();

/**
 * Checks if a string is a valid UUID.
 * @param str - The string to check.
 * @returns - True if the string is a valid UUID, false otherwise.
 * @example
 * isUUID("hello world"); // returns false
 * isUUID("9cea4ab2-beb8-4b02-ab10-48a39c6b91fa"); // returns true
 */
export const isUUID = (str: string): boolean => {
    const uuidRegex = /^[\da-f]{8}-[\da-f]{4}-[1-5][\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i;
    return uuidRegex.test(str);
};

/**
 * Encrypt a string with a key. Based on the "uncrypto" library. Uses AES-CBC with a random IV. Returns a string with the IV prepended. Use decrypt to decrypt the string.
 * @param data - The data to encrypt.
 * @param key - The key to use for encryption.
 * @returns - The encrypted string in the format of "IV:encryptedData" in base64 format.
 * @example
 * await encrypt("hello world", "key"); // returns "IV:encryptedData"
 */
// export const encrypt = async (data: string, key: string): Promise<string> => {
//     const iv = getRandomValues(new Uint8Array(16));

//     // encrypt with subtle
//     const enc = new TextEncoder();
//     const encoded = enc.encode(data);
//     const keyBuffer = enc.encode(key);
//     const cryptoKey = await subtle.importKey("raw", keyBuffer, "AES-CBC", false, ["encrypt"]);
//     const encrypted = await subtle.encrypt({ name: "AES-CBC", iv }, cryptoKey, encoded);

//     // return as string from buffer with IV prepended
//     const uint8Array = new Uint8Array(encrypted);
//     const buffer = Buffer.from(uint8Array);
//     const encryptedString = buffer.toString("base64");
//     const ivString = Buffer.from(iv).toString("base64");

//     return `${ivString}:${encryptedString}`;
// };

/**
 * Decrypt a string with a key. Based on the "uncrypto" library. Expects a string in the format of "IV:encryptedData" in base64 format. Use encrypt to encrypt a string.
 * @param cipher - The encrypted string in the format of "IV:encryptedData" in base64 format.
 * @param key - The key to use for decryption.
 * @returns - The decrypted string.
 * @example
 * await decrypt("IV:encryptedData", "key"); // returns "hello world"
 */
// export const decrypt = async (cipher: string, key: string): Promise<string> => {
//     // Split the IV from the ciphertext
//     const [ivString, cipherString] = cipher.split(":");

//     // convert base64 strings to Uint8Array buffers
//     const iv = Uint8Array.from(Buffer.from(ivString, "base64"));
//     const encryptedData = Uint8Array.from(Buffer.from(cipherString, "base64"));

//     // decode key
//     const enc = new TextEncoder();
//     const keyBuffer = enc.encode(key);
//     const cryptoKey = await subtle.importKey("raw", keyBuffer, "AES-CBC", false, ["decrypt"]);

//     // decrypt with subtle
//     const decrypted = await subtle.decrypt({ name: "AES-CBC", iv }, cryptoKey, encryptedData);

//     // Convert decrypted ArrayBuffer back to String
//     const dec = new TextDecoder();
//     return dec.decode(new Uint8Array(decrypted));
// };

/**
 * Hash an object or string with SHA-256. From the `ohash` library.
 * @param data - the data to hash.
 * @returns - The hashed string in base64 format.
 * @example
 * await hash("hello world"); // returns "hashedString"
 * await hash({ foo: "bar" }); // returns "hashedString"
 * await hash({ foo: "bar" }); // returns the same "hashedString" as before
 */
export const hash = (data: any): string => ohash(data);
