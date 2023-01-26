import { readFileSync, writeFileSync } from "fs";

/**
 * Utilities for working with the file system. These functions are synchronous.
 */

type FileSettings = {
    /**
     * If true, the function will throw an error if an error occurs. Defaults to false.
     */
    throws?: boolean;
    /**
     * If true, the function will log the error to the console. Defaults to false.
     */
    debug?: boolean;
};

/**
 * Reads a file from a path. Returns null if an error occurs.
 * @param path - The path to the file.
 * @param options - The options to use.
 * @returns The file contents or null if an error occurs.
 * @example
 * readFile("test.txt");
 * readFile("test.txt", { throws: true, debug: true });
 */
export const readFile = (path: string, options?: FileSettings) => {
    try {
        return readFileSync(path, "utf8");
    } catch (e) {
        if (options?.throws) throw e;
        if (options?.debug) console.log(e);
        return null;
    }
};

/**
 * Writes a file to a path. Returns true if successful, false if an error occurs.
 * @param path - The path to the file.
 * @param data - The data to write to the file.
 * @param options - The options to use.
 * @returns - true if successful, false if an error occurs.
 * @example
 * writeFile("test.txt", "hello world");
 * writeFile("test.txt", "hello world", { throws: true, debug: true });
 */
export const writeFile = (
    path: string,
    data: string,
    options?: FileSettings
) => {
    try {
        writeFileSync(path, data);
        return true;
    } catch (error) {
        if (options?.throws) throw error;
        if (options?.debug) console.log(error);
        return false;
    }
};

/**
 * Reads a JSON file from a path. Returns null if an error occurs.
 * @param path - The path to the file.
 * @param options - The options to use.
 * @returns The JSON object or null if an error occurs.
 *
 * @example
 * readJsonFile("test.json");
 * readJsonFile("test.json", { throws: true, debug: true });
 */
export const readJsonFile = (path: string, options?: FileSettings) => {
    try {
        return JSON.parse(readFileSync(path, "utf8"));
    } catch (e) {
        if (options?.throws) throw e;
        if (options?.debug) console.log(e);
        return null;
    }
};

type JsonFileSettings = {
    /**
     * Defines how many spaces to use for indentation. Defaults to 4.
     * @default 4
     */
    spaces?: number;
};

/**
 * Writes a JSON file to a path. Returns true if successful, false if an error occurs. If the data is a string, it will be parsed before writing.
 * @param path - The path to the file.
 * @param data - The data to write to the file.
 * @param options - The options to use.
 * @returns - true if successful, false if an error occurs.
 * @example
 * const json = {
 *   hello: "world"
 * }
 *
 * writeJsonFile("test.json", json);
 * writeJsonFile("test.json", json, { spaces: 2 });
 *
 * const jsonAsString = JSON.stringify(json);
 * writeJsonFile("test.json", jsonAsString);
 */
export const writeJsonFile = (
    path: string,
    data: string | object,
    options?: FileSettings & JsonFileSettings
) => {
    const spaces = options?.spaces ?? 4;
    try {
        let json: string;
        if (typeof data === "string") {
            const parsed = JSON.parse(data);
            json = JSON.stringify(parsed, null, spaces);
        } else {
            json = JSON.stringify(data, null, spaces);
        }
        writeFileSync(path, json);
        return true;
    } catch (error) {
        if (options?.throws) throw error;
        if (options?.debug) console.log(error);
        return false;
    }
};
