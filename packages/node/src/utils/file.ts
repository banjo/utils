import fs from "fs";
import { attempt, defaults } from "packages/utils/src";
import { extname } from "path";

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

const assertDirectory = (path: string) => {
    const isFilePath = extname(path) !== "";

    if (isFilePath) {
        const parentDirectory = path.split("/").slice(0, -1).join("/");
        if (parentDirectory === "") return;
        assertDirectory(parentDirectory);
        return;
    }

    if (!pathExists(path, { type: "directory" })) {
        fs.mkdirSync(path, { recursive: true });
    }
};

const assertFile = (file: string, content?: string): { created: boolean } => {
    if (!pathExists(file)) {
        const parentDirectory = file.split("/").slice(0, -1).join("/");
        assertDirectory(parentDirectory);
        fs.writeFileSync(file, content ?? "");
        return { created: true };
    }

    return { created: false };
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
 * Write to a file with the given content. If it exists, it will be overwritten. Otherwise it will be created. If the directory does not exist, it will be created. Configurable with the third argument.
 * @param file - The file path.
 * @param content - The file content.
 * @param config - Configurable options.
 * @returns - void
 * @example
 * FileUtil.writeFile("file.txt", "Hello world!");
 *
 * // With config
 * FileUtil.writeFile("file.txt", "Hello world!", { logError: true });
 */
const writeFile = (file: string, content: string, config?: BaseFileConfig) => {
    attempt(
        () => {
            const { created } = assertFile(file, content);
            if (created) return;
            fs.writeFileSync(file, content);
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
 * FileUtil.appendFile("file.txt", "Hello world!");
 * FileUtil.appendFile("file.txt", "Hello world!", { logError: true });
 * FileUtil.appendFile("file.txt", "Hello world!", { onError: (error) => console.log(error) });
 */
const appendFile = (file: string, content: string, config?: BaseFileConfig) => {
    attempt(
        () => {
            const { created } = assertFile(file, content);
            if (created) return;
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
 * Delete multiple files. Will do nothing if the file does not exist. Configurable with the second argument.
 * @param files - The file paths.
 * @param config - Configurable options.
 * @returns - void
 * @example
 * FileUtil.deleteFiles(["file.txt", "file2.txt"]);
 * FileUtil.deleteFiles(["file.txt", "file2.txt"], { logError: true });
 * FileUtil.deleteFiles(["file.txt", "file2.txt"], { onError: (error) => console.log(error) });
 */
const deleteFiles = (files: string[], config?: BaseFileConfig) => {
    return attempt(
        () => {
            files.forEach(file => {
                deleteFile(file);
            });
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
            fs.rmSync(dir, { recursive: true });
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
 * Copy a file. Overwrites the destination by default. Error if source file does not exists. If the destination is a file it should have an extension. Configurable with the third argument.
 * @param source - The source path.
 * @param destination - The destination path. If it is a file, it should have an extension. Will create the directory if it does not exist.
 * @param config - Configurable options.
 * @returns - void
 * @example
 * FileUtil.copyFile("file.txt", "file2.txt");
 * FileUtil.copyFile("file.txt", "file2.txt", { logError: true });
 * FileUtil.copyFile("file.txt", "file2.txt", { onError: (error) => console.log(error) });
 */
const copyFile = (source: string, destination: string, config?: BaseFileConfig) => {
    return attempt(
        () => {
            assertDirectory(destination);
            fs.copyFileSync(source, destination);
        },
        {
            logError: config?.logError,
            onError: config?.onError,
        }
    );
};

/**
 * Copy a directory. Overwrites the destination by default. Error if source does not exist or destination is a file name. Handle with `onError` callback. Configurable with the third argument.
 * @param source - The source path. Should be a directory.
 * @param destination - The destination path. Should be a directory.
 * @param config - Configurable options.
 * @returns - void
 * @example
 * FileUtil.copyDirectory("dir", "dir2");
 * FileUtil.copyDirectory("dir", "dir2", { logError: true });
 * FileUtil.copyDirectory("dir", "dir2", { onError: (error) => console.log(error) });
 */
const copyDirectory = (source: string, destination: string, config?: BaseFileConfig) => {
    return attempt(
        () => {
            if (!directoryExists(source)) throw new Error("Source does not exist.");
            if (extname(destination) !== "") throw new Error("Destination should be a directory.");
            if (source === destination)
                throw new Error("Source and destination should not be the same.");

            const isSubdirectoryOfSource = destination.startsWith(`${source}/`);

            if (isSubdirectoryOfSource)
                throw new Error("Destination should not be a subdirectory of source.");

            assertDirectory(destination);

            const files = fs.readdirSync(source);

            files.forEach(file => {
                const sourcePath = `${source}/${file}`;
                const destinationPath = `${destination}/${file}`;

                if (directoryExists(sourcePath)) {
                    copyDirectory(sourcePath, destinationPath);
                } else {
                    copyFile(sourcePath, destinationPath);
                }
            });
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
    writeFile,
    appendFile,
    deleteFile,
    deleteFiles,
    readFile,
    createDirectory,
    deleteDirectory,
    fileExists,
    directoryExists,
    pathExists,
    copyFile,
    copyDirectory,
};
