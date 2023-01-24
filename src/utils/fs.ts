import { readFileSync } from "fs";

type ReadFileSettings = {
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
export const readFile = (path: string, options?: ReadFileSettings) => {
    try {
        return readFileSync(path, "utf8");
    } catch (e) {
        if (options?.throws) throw e;
        if (options?.debug) console.log(e);
        return null;
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
export const readJsonFile = (path: string, options?: ReadFileSettings) => {
    try {
        return JSON.parse(readFileSync(path, "utf8"));
    } catch (e) {
        if (options?.throws) throw e;
        if (options?.debug) console.log(e);
        return null;
    }
};