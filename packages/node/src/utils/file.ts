import fs from "fs";
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
 * const fileOrFolderExists = FileUtil.pathExists("file.txt");
 * const explicitFileOrFolderExists = FileUtil.pathExists("file.txt", { type: "all" });
 * const fileExists = FileUtil.pathExists("file.txt", { type: "file" });
 * const folderExists = FileUtil.pathExists("dir", { type: "directory" });
 */
const pathExists = (path: string, config?: { type: "file" | "directory" | "all" }) => {
    const { type } = defaults(config, { type: "all" });
    const stat = fs.statSync(path);

    switch (type) {
        case "file":
            return stat.isFile();
        case "directory":
            return stat.isDirectory();
        case "all":
            return stat.isFile() || stat.isDirectory();
    }
};

const assertDirectory = (dir: string) => {
    if (!pathExists(dir, { type: "directory" })) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

const assertFile = (file: string, content?: string) => {
    if (!pathExists(file)) {
        assertDirectory(file);
        fs.writeFileSync(file, content ?? "");
    }
};

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
 * Create a file with the given content. If the file already exists, it will be overwritten. If the directory does not exist, it will be created. Configurable with the third argument.
 * @param file - The file path.
 * @param content - The file content.
 * @param config - Configurable options.
 * @returns - void
 * @example
 * FileUtil.createFile("file.txt", "Hello world!");
 *
 * // With config
 * FileUtil.createFile("file.txt", "Hello world!", { logError: true });
 */
const createFile = (file: string, content: string, config?: BaseFileConfig) => {
    attempt(
        () => {
            assertFile(file, content);
        },
        {
            logError: config?.logError,
            onError: config?.onError,
        }
    );
};

/**
 * Append content to a file. If the file does not exist, it will be created. If the directory does not exist, it will be created. Configurable with the third argument.
 * @param file - The file path.
 * @param content  - The content to append.
 * @param config - Configurable options.
 * @returns - void
 * @example
 * FileUtil.appendToFile("file.txt", "Hello world!");
 * FileUtil.appendToFile("file.txt", "Hello world!", { logError: true });
 * FileUtil.appendToFile("file.txt", "Hello world!", { onError: (error) => console.log(error) });
 */
const appendToFile = (file: string, content: string, config?: BaseFileConfig) => {
    attempt(
        () => {
            assertFile(file);
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
 * const content = FileUtil.readFile("file.txt"); // undefined or string
 *
 * const content = FileUtil.readFile("file.txt", { logError: true });
 * const content = FileUtil.readFile("file.txt", { onError: (error) => console.log(error) });
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
 * Delete a file. Will do nothing if the file does not exist. Configurable with the second argument.
 * @param file - The file path.
 * @param config - Configurable options.
 * @returns - void
 * @example
 * FileUtil.deleteFile("file.txt");
 * FileUtil.deleteFile("file.txt", { logError: true });
 * FileUtil.deleteFile("file.txt", { onError: (error) => console.log(error) });
 */
const deleteFile = (file: string, config?: BaseFileConfig) => {
    return attempt(
        () => {
            if (!pathExists(file, { type: "file" })) return;
            fs.unlinkSync(file);
        },
        {
            logError: config?.logError,
            onError: config?.onError,
        }
    );
};

/**
 * Remove a directory. Will do nothing if the directory does not exist. Configurable with the second argument.
 * @param dir - The directory path.
 * @param config - Configurable options.
 * @returns - void
 * @example
 * FileUtil.deleteDirectory("dir");
 * FileUtil.deleteDirectory("dir", { logError: true });
 * FileUtil.deleteDirectory("dir", { onError: (error) => console.log(error) });
 */
const deleteDirectory = (dir: string, config?: BaseFileConfig) => {
    return attempt(
        () => {
            if (!pathExists(dir, { type: "directory" })) return;
            fs.rmdirSync(dir);
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
 * FileUtil.createDirectory("dir");
 * FileUtil.createDirectory("dir", { logError: true });
 * FileUtil.createDirectory("dir", { onError: (error) => console.log(error) });
 */
const createDirectory = (dir: string, config?: BaseFileConfig) => {
    return attempt(
        () => {
            if (pathExists(dir, { type: "directory" })) return;
            assertDirectory(dir);
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
 * const exists = FileUtil.fileExists("file.txt"); // true or false
 * const exists = FileUtil.fileExists("file.txt", { logError: true });
 * const exists = FileUtil.fileExists("file.txt", { onError: (error) => console.log(error) });
 */
const fileExists = (file: string, config?: BaseFileConfig) => {
    return attempt(
        () => {
            return pathExists(file, { type: "file" });
        },
        {
            logError: config?.logError,
            onError: config?.onError,
        }
    );
};

/**
 * Check if a directory exists. Does not work for files. Configurable with the second argument.
 * @param dir - The directory path.
 * @param config - Configurable options.
 * @returns - Boolean
 * @example
 * const exists = FileUtil.directoryExists("dir"); // true or false
 * const exists = FileUtil.directoryExists("dir", { logError: true });
 * const exists = FileUtil.directoryExists("dir", { onError: (error) => console.log(error) });
 */
const directoryExists = (dir: string, config?: BaseFileConfig) => {
    return attempt(
        () => {
            return pathExists(dir, { type: "directory" });
        },
        {
            logError: config?.logError,
            onError: config?.onError,
        }
    );
};

/**
 * A file utility for reading and writing files using the fs module.
 */
export const FileUtil = {
    createFile,
    appendToFile,
    deleteFile,
    readFile,
    createDirectory,
    deleteDirectory,
    fileExists,
    directoryExists,
    pathExists,
};
