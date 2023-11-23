import fs from "fs-extra";
import { attempt, defaults } from "packages/utils/src";

/**
 * A file utility for reading and writing files using the fs module.
 */

/**
 * Check if a path exists. Configurable with the second argument.
 * @param path - The path.
 * @param config - Configurable options.
 * @returns - Boolean
 * @example
 * const fileOrFolderExists = FileKit.pathExists("file.txt");
 * const explicitFileOrFolderExists = FileKit.pathExists("file.txt", { type: "all" });
 * const fileExists = FileKit.pathExists("file.txt", { type: "file" });
 * const folderExists = FileKit.pathExists("dir", { type: "directory" });
 */
const pathExists = (path: string, config?: { type: "file" | "directory" | "all" }) => {
    const { type } = defaults(config, { type: "all" });

    const stat = attempt(() => fs.statSync(path));
    if (!stat) return false;

    switch (type) {
        case "file":
            return stat.isFile();
        case "directory":
            return stat.isDirectory();
        case "all":
            return stat.isFile() || stat.isDirectory();
    }
};

const ensureDirectory = (path: string) => attempt(() => fs.ensureDirSync(path));
const ensureFile = (file: string) => attempt(() => fs.ensureFileSync(file));

type BaseFileConfig = {
    /**
     * Whether to log errors.
     * @default false
     */
    logError?: boolean;

    /**
     * Handler for errors.
     */
    onError?: (error: unknown) => void;
};

/**
 * Write to a file with the given content. If it exists, it will be overwritten. Otherwise it will be created. If the directory does not exist, it will be created. Configurable with the third argument.
 * @param file - The file path.
 * @param content - The file content.
 * @param config - Configurable options.
 * @returns - void
 * @example
 * FileKit.writeFile("file.txt", "Hello world!");
 *
 * // With config
 * FileKit.writeFile("file.txt", "Hello world!", { logError: true });
 */
const writeFile = (file: string, content: string, config?: BaseFileConfig) => {
    attempt(() => fs.outputFileSync(file, content), {
        logError: config?.logError,
        onError: config?.onError,
    });
};

/**
 * Append content to a file. If the file does not exist, it will be created. If the directory does not exist, it will be created. Configurable with the third argument.
 * @param file - The file path.
 * @param content  - The content to append.
 * @param config - Configurable options.
 * @returns - void
 * @example
 * FileKit.appendFile("file.txt", "Hello world!");
 * FileKit.appendFile("file.txt", "Hello world!", { logError: true });
 * FileKit.appendFile("file.txt", "Hello world!", { onError: (error) => console.log(error) });
 */
const appendFile = (file: string, content: string, config?: BaseFileConfig) => {
    attempt(
        () => {
            ensureFile(file);
            fs.appendFileSync(file, content);
        },
        {
            logError: config?.logError,
            onError: config?.onError,
        }
    );
};

/**
 * Read a file. Will return undefined if the file does not exist. Configurable with the second argument.
 * @param file - The file path.
 * @param config - Configurable options.
 * @returns - The file content or undefined.
 * @example
 * const content = FileKit.readFile("file.txt"); // undefined or string
 *
 * const content = FileKit.readFile("file.txt", { logError: true });
 * const content = FileKit.readFile("file.txt", { onError: (error) => console.log(error) });
 */
const readFile = (file: string, config?: BaseFileConfig) => {
    return attempt(
        () => {
            return fs.readFileSync(file, "utf8");
        },
        {
            logError: config?.logError,
            onError: error => {
                if (error instanceof Error && error.message.includes("ENOENT")) {
                    return undefined;
                }

                config?.onError?.(error);
            },
        }
    );
};

/**
 * Delete a file or directory. Will do nothing if the path does not exist. Configurable with the second argument.
 * @param file - The file path.
 * @param config - Configurable options.
 * @returns - void
 * @example
 * FileKit.remove("file.txt");
 * FileKit.remove("file.txt", { logError: true });
 * FileKit.remove("file.txt", { onError: (error) => console.log(error) });
 *
 * FileKit.remove("dir");
 * FileKit.remove("dir", { logError: true });
 * FileKit.remove("dir", { onError: (error) => console.log(error) });
 */
const remove = (file: string, config?: BaseFileConfig) => {
    return attempt(() => fs.removeSync(file), {
        logError: config?.logError,
        onError: config?.onError,
    });
};

/**
 * Delete multiple files. Will do nothing if the file does not exist. Configurable with the second argument.
 * @param paths - The file paths.
 * @param config - Configurable options.
 * @returns - void
 * @example
 * FileKit.removeMultiple(["file.txt", "file2.txt"]);
 * FileKit.removeMultiple(["file.txt", "file2.txt"], { logError: true });
 * FileKit.removeMultiple(["file.txt", "file2.txt"], { onError: (error) => console.log(error) });
 *
 * FileKit.removeMultiple(["dir", "dir2"]);
 * FileKit.removeMultiple(["dir", "dir2"], { logError: true });
 * FileKit.removeMultiple(["dir", "dir2"], { onError: (error) => console.log(error) });
 */
const removeMultiple = (paths: string[], config?: BaseFileConfig) => {
    return attempt(
        () => {
            paths.forEach(file => {
                remove(file);
            });
        },
        {
            logError: config?.logError,
            onError: config?.onError,
        }
    );
};

/**
 * Create a directory. Will do nothing if the directory already exists. Configurable with the second argument.
 * @param dir - The directory path.
 * @param config - Configurable options.
 * @returns - void
 * @example
 * FileKit.createDirectory("dir");
 * FileKit.createDirectory("dir", { logError: true });
 * FileKit.createDirectory("dir", { onError: (error) => console.log(error) });
 */
const createDirectory = (dir: string, config?: BaseFileConfig) => {
    return attempt(
        () => {
            if (pathExists(dir, { type: "directory" })) return;
            ensureDirectory(dir);
        },
        {
            logError: config?.logError,
            onError: config?.onError,
        }
    );
};

/**
 * Will return true if the file exists. Does not work for directories. Configurable with the second argument.
 * @param file - The file path.
 * @param config - Configurable options.
 * @returns - Boolean
 * @example
 * const exists = FileKit.fileExists("file.txt"); // true or false
 * const exists = FileKit.fileExists("file.txt", { logError: true });
 * const exists = FileKit.fileExists("file.txt", { onError: (error) => console.log(error) });
 */
const fileExists = (file: string, config?: BaseFileConfig) => {
    return attempt(() => pathExists(file, { type: "file" }), {
        logError: config?.logError,
        onError: config?.onError,
    });
};

/**
 * Check if a directory exists. Does not work for files. Configurable with the second argument.
 * @param dir - The directory path.
 * @param config - Configurable options.
 * @returns - Boolean
 * @example
 * const exists = FileKit.directoryExists("dir"); // true or false
 * const exists = FileKit.directoryExists("dir", { logError: true });
 * const exists = FileKit.directoryExists("dir", { onError: (error) => console.log(error) });
 */
const directoryExists = (dir: string, config?: BaseFileConfig) => {
    return attempt(() => pathExists(dir, { type: "directory" }), {
        logError: config?.logError,
        onError: config?.onError,
    });
};

/**
 * Copy a file or directory. Overwrites the destination by default. Error if source does not exist or destination is a file name. Handle with `onError` callback. Configurable with the third argument.
 * @param source - The source path.
 * @param destination - The destination path.
 * @param config - Configurable options.
 * @returns - void
 * @example
 * FileKit.copy("file.txt", "file2.txt");
 *
 * FileKit.copy("dir", "dir2");
 */
export const copy = (source: string, destination: string, config?: BaseFileConfig) => {
    return attempt(
        () => {
            fs.copySync(source, destination);
        },
        {
            logError: config?.logError,
            onError: config?.onError,
        }
    );
};

/**
 * Move a file or directory. Overwrites the destination by default. Error if source does not exist. Handle with `onError` callback. Configurable with the third argument.
 * @param source - The source path.
 * @param destination - The destination path.
 * @param config - Configurable options.
 * @returns - void
 * @example
 * FileKit.move("file.txt", "file2.txt");
 * FileKit.move("dir", "dir2");
 */
export const move = (source: string, destination: string, config?: BaseFileConfig) => {
    return attempt(() => fs.moveSync(source, destination, { overwrite: true }), {
        logError: config?.logError,
        onError: config?.onError,
    });
};

/**
 * A file utility for reading and writing files using the fs module. You don't need try/catch blocks, use the `onError` callback instead.
 */
export const FileKit = {
    writeFile,
    appendFile,
    remove,
    removeMultiple,
    readFile,
    createDirectory,
    fileExists,
    directoryExists,
    pathExists,
    copy,
    move,
};
