import fs from "fs-extra";
import { attempt, attemptAsync, defaults } from "packages/utils/src";

/**
 * A file utility for reading and writing files using the fs module.
 */

type FileType = "file" | "directory" | "all";

/**
 * Check if a path exists. Configurable with the second argument.
 * @param path - The path.
 * @param config - Configurable options.
 * @returns - Boolean
 * @example
 * const fileOrFolderExists = FileKit.pathExistsSync("file.txt");
 * const explicitFileOrFolderExists = FileKit.pathExistsSync("file.txt", { type: "all" });
 * const fileExistsSync = FileKit.pathExistsSync("file.txt", { type: "file" });
 * const folderExists = FileKit.pathExistsSync("dir", { type: "directory" });
 */
const pathExistsSync = (path: string, config?: { type: FileType }) => {
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

/**
 * Check if a path exists async. Configurable with the second argument.
 * @param path - The path.
 * @param config - Configurable options.
 * @returns - Boolean
 * @example
 * const fileOrFolderExists = await FileKit.pathExists("file.txt");
 * const explicitFileOrFolderExists = await FileKit.pathExists("file.txt", { type: "all" });
 * const fileExistsSync = await FileKit.pathExists("file.txt", { type: "file" });
 * const folderExists = await FileKit.pathExists("dir", { type: "directory" });
 */
const pathExists = async (path: string, config?: { type: FileType }) => {
    const { type } = defaults(config, { type: "all" });

    const stat = await attemptAsync(() => fs.stat(path));
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

const ensureDirectorySync = (path: string) => attempt(() => fs.ensureDirSync(path));
const ensureFileSync = (file: string) => attempt(() => fs.ensureFileSync(file));

const ensureDirectory = (path: string) => attemptAsync(() => fs.ensureDir(path));
const ensureFile = (file: string) => attemptAsync(() => fs.ensureFile(file));

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
 * FileKit.writeFileSync("file.txt", "Hello world!");
 *
 * // With config
 * FileKit.writeFileSync("file.txt", "Hello world!", { logError: true });
 */
const writeFileSync = (file: string, content: string, config?: BaseFileConfig) => {
    attempt(() => fs.outputFileSync(file, content), {
        logError: config?.logError,
        onError: config?.onError,
    });
};

/**
 * Write to a file with the given content async. If it exists, it will be overwritten. Otherwise it will be created. If the directory does not exist, it will be created. Configurable with the third argument.
 * @param file - The file path.
 * @param content - The file content.
 * @param config - Configurable options.
 * @returns - void
 * @example
 * await FileKit.writeFile("file.txt", "Hello world!");
 *
 * // With config
 * await FileKit.writeFile("file.txt", "Hello world!", { logError: true });
 */
const writeFile = async (file: string, content: string, config?: BaseFileConfig) => {
    await attemptAsync(() => fs.outputFile(file, content), {
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
 * FileKit.appendFileSync("file.txt", "Hello world!");
 * FileKit.appendFileSync("file.txt", "Hello world!", { logError: true });
 * FileKit.appendFileSync("file.txt", "Hello world!", { onError: (error) => console.log(error) });
 */
const appendFileSync = (file: string, content: string, config?: BaseFileConfig) => {
    attempt(
        () => {
            ensureFileSync(file);
            fs.appendFileSync(file, content);
        },
        {
            logError: config?.logError,
            onError: config?.onError,
        }
    );
};

/**
 * Append content to a file async. If the file does not exist, it will be created. If the directory does not exist, it will be created. Configurable with the third argument.
 * @param file - The file path.
 * @param content  - The content to append.
 * @param config - Configurable options.
 * @returns - void
 * @example
 * await FileKit.appendFile("file.txt", "Hello world!");
 * await FileKit.appendFile("file.txt", "Hello world!", { logError: true });
 * await FileKit.appendFile("file.txt", "Hello world!", { onError: (error) => console.log(error) });
 */
const appendFile = async (file: string, content: string, config?: BaseFileConfig) => {
    await attemptAsync(
        async () => {
            await ensureFile(file);
            await fs.appendFile(file, content);
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
 * const content = FileKit.readFileSync("file.txt"); // undefined or string
 *
 * const content = FileKit.readFileSync("file.txt", { logError: true });
 * const content = FileKit.readFileSync("file.txt", { onError: (error) => console.log(error) });
 */
const readFileSync = (file: string, config?: BaseFileConfig) => {
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
 * Read a file async. Will return undefined if the file does not exist. Configurable with the second argument.
 * @param file - The file path.
 * @param config - Configurable options.
 * @returns - The file content or undefined.
 * @example
 * const content = await FileKit.readFile("file.txt"); // undefined or string
 *
 * const content = await FileKit.readFile("file.txt", { logError: true });
 * const content = await FileKit.readFile("file.txt", { onError: (error) => console.log(error) });
 */
const readFile = async (file: string, config?: BaseFileConfig) => {
    return attemptAsync(
        () => {
            return fs.readFile(file, "utf8");
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
 * FileKit.removeSync("file.txt");
 * FileKit.removeSync("file.txt", { logError: true });
 * FileKit.removeSync("file.txt", { onError: (error) => console.log(error) });
 *
 * FileKit.removeSync("dir");
 * FileKit.removeSync("dir", { logError: true });
 * FileKit.removeSync("dir", { onError: (error) => console.log(error) });
 */
const removeSync = (file: string, config?: BaseFileConfig) => {
    return attempt(() => fs.removeSync(file), {
        logError: config?.logError,
        onError: config?.onError,
    });
};

/**
 * Delete a file or directory async. Will do nothing if the path does not exist. Configurable with the second argument.
 * @param file - The file path.
 * @param config - Configurable options.
 * @returns - void
 * @example
 * await FileKit.remove("file.txt");
 * await FileKit.remove("file.txt", { logError: true });
 * await FileKit.remove("file.txt", { onError: (error) => console.log(error) });
 *
 * await FileKit.remove("dir");
 * await FileKit.remove("dir", { logError: true });
 * await FileKit.remove("dir", { onError: (error) => console.log(error) });
 */
const remove = async (file: string, config?: BaseFileConfig) => {
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
 * FileKit.removeMultipleSync(["file.txt", "file2.txt"]);
 * FileKit.removeMultipleSync(["file.txt", "file2.txt"], { logError: true });
 * FileKit.removeMultipleSync(["file.txt", "file2.txt"], { onError: (error) => console.log(error) });
 *
 * FileKit.removeMultipleSync(["dir", "dir2"]);
 * FileKit.removeMultipleSync(["dir", "dir2"], { logError: true });
 * FileKit.removeMultipleSync(["dir", "dir2"], { onError: (error) => console.log(error) });
 */
const removeMultipleSync = (paths: string[], config?: BaseFileConfig) => {
    return attempt(
        () => {
            paths.forEach(file => {
                removeSync(file);
            });
        },
        {
            logError: config?.logError,
            onError: config?.onError,
        }
    );
};

/**
 * Delete multiple files async. Will do nothing if the file does not exist. Configurable with the second argument.
 * @param paths - The file paths.
 * @param config - Configurable options.
 * @returns - void
 * @example
 * await FileKit.removeMultiple(["file.txt", "file2.txt"]);
 * await FileKit.removeMultiple(["file.txt", "file2.txt"], { logError: true });
 * await FileKit.removeMultiple(["file.txt", "file2.txt"], { onError: (error) => console.log(error) });
 *
 * await FileKit.removeMultiple(["dir", "dir2"]);
 * await FileKit.removeMultiple(["dir", "dir2"], { logError: true });
 * await FileKit.removeMultiple(["dir", "dir2"], { onError: (error) => console.log(error) });
 */
const removeMultiple = async (paths: string[], config?: BaseFileConfig) => {
    return attemptAsync(
        async () => {
            for (const file of paths) {
                await remove(file);
            }
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
 * FileKit.createDirectorySync("dir");
 * FileKit.createDirectorySync("dir", { logError: true });
 * FileKit.createDirectorySync("dir", { onError: (error) => console.log(error) });
 */
const createDirectorySync = (dir: string, config?: BaseFileConfig) => {
    return attempt(
        () => {
            if (pathExistsSync(dir, { type: "directory" })) return;
            ensureDirectorySync(dir);
        },
        {
            logError: config?.logError,
            onError: config?.onError,
        }
    );
};

/**
 * Create a directory async. Will do nothing if the directory already exists. Configurable with the second argument.
 * @param dir - The directory path.
 * @param config - Configurable options.
 * @returns - void
 * @example
 * await FileKit.createDirectory("dir");
 * await FileKit.createDirectory("dir", { logError: true });
 * await FileKit.createDirectory("dir", { onError: (error) => console.log(error) });
 */
const createDirectory = async (dir: string, config?: BaseFileConfig) => {
    return attemptAsync(
        async () => {
            if (await pathExists(dir, { type: "directory" })) return;
            await ensureDirectory(dir);
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
 * const exists = FileKit.fileExistsSync("file.txt"); // true or false
 * const exists = FileKit.fileExistsSync("file.txt", { logError: true });
 * const exists = FileKit.fileExistsSync("file.txt", { onError: (error) => console.log(error) });
 */
const fileExistsSync = (file: string, config?: BaseFileConfig) => {
    return attempt(() => pathExistsSync(file, { type: "file" }), {
        logError: config?.logError,
        onError: config?.onError,
    });
};

/**
 * Will return true if the file exists async. Does not work for directories. Configurable with the second argument.
 * @param file - The file path.
 * @param config - Configurable options.
 * @returns - Boolean
 * @example
 * const exists = await FileKit.fileExists("file.txt"); // true or false
 * const exists = await FileKit.fileExists("file.txt", { logError: true });
 * const exists = await FileKit.fileExists("file.txt", { onError: (error) => console.log(error) });
 */
const fileExists = async (file: string, config?: BaseFileConfig) => {
    return attemptAsync(() => pathExists(file, { type: "file" }), {
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
 * const exists = FileKit.directoryExistsSync("dir"); // true or false
 * const exists = FileKit.directoryExistsSync("dir", { logError: true });
 * const exists = FileKit.directoryExistsSync("dir", { onError: (error) => console.log(error) });
 */
const directoryExistsSync = (dir: string, config?: BaseFileConfig) => {
    return attempt(() => pathExistsSync(dir, { type: "directory" }), {
        logError: config?.logError,
        onError: config?.onError,
    });
};

/**
 * Check if a directory exists async. Does not work for files. Configurable with the second argument.
 * @param dir - The directory path.
 * @param config - Configurable options.
 * @returns - Boolean
 * @example
 * const exists = await FileKit.directoryExists("dir"); // true or false
 * const exists = await FileKit.directoryExists("dir", { logError: true });
 * const exists = await FileKit.directoryExists("dir", { onError: (error) => console.log(error) });
 */
const directoryExists = async (dir: string, config?: BaseFileConfig) => {
    return attemptAsync(() => pathExists(dir, { type: "directory" }), {
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
 * FileKit.copySync("file.txt", "file2.txt");
 *
 * FileKit.copySync("dir", "dir2");
 */
const copySync = (source: string, destination: string, config?: BaseFileConfig) => {
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
 * Copy a file or directory async. Overwrites the destination by default. Error if source does not exist or destination is a file name. Handle with `onError` callback. Configurable with the third argument.
 * @param source - The source path.
 * @param destination - The destination path.
 * @param config - Configurable options.
 * @returns - void
 * @example
 * await FileKit.copy("file.txt", "file2.txt");
 *
 * await FileKit.copy("dir", "dir2");
 */
const copy = async (source: string, destination: string, config?: BaseFileConfig) => {
    return attemptAsync(
        async () => {
            await fs.copy(source, destination);
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
 * FileKit.moveSync("file.txt", "file2.txt");
 * FileKit.moveSync("dir", "dir2");
 */
const moveSync = (source: string, destination: string, config?: BaseFileConfig) => {
    return attempt(() => fs.moveSync(source, destination, { overwrite: true }), {
        logError: config?.logError,
        onError: config?.onError,
    });
};

/**
 * Move a file or directory async. Overwrites the destination by default. Error if source does not exist. Handle with `onError` callback. Configurable with the third argument.
 * @param source - The source path.
 * @param destination - The destination path.
 * @param config - Configurable options.
 * @returns - void
 * @example
 * await FileKit.move("file.txt", "file2.txt");
 * await FileKit.move("dir", "dir2");
 */
const move = async (source: string, destination: string, config?: BaseFileConfig) => {
    return attemptAsync(
        async () => {
            await fs.move(source, destination, { overwrite: true });
        },
        {
            logError: config?.logError,
            onError: config?.onError,
        }
    );
};
/**
 * A file utility for reading and writing files using the fs module. You don't need try/catch blocks, use the `onError` callback instead.
 */
export const FileKit = {
    writeFileSync,
    writeFile,
    appendFileSync,
    appendFile,
    removeSync,
    remove,
    removeMultipleSync,
    removeMultiple,
    readFileSync,
    readFile,
    createDirectorySync,
    createDirectory,
    fileExistsSync,
    fileExists,
    directoryExistsSync,
    directoryExists,
    pathExistsSync,
    pathExists,
    copySync,
    copy,
    moveSync,
    move,
};
