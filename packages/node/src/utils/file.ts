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

const assureDirectory = (path: string) => {
    const isFilePath = extname(path) !== "";

    if (isFilePath) {
        const parentDirectory = path.split("/").slice(0, -1).join("/");
        if (parentDirectory === "") return;
        assureDirectory(parentDirectory);
        return;
    }

    if (!pathExists(path, { type: "directory" })) {
        fs.mkdirSync(path, { recursive: true });
    }
};

const assureFile = (file: string, content?: string): { created: boolean } => {
    if (!pathExists(file)) {
        const parentDirectory = file.split("/").slice(0, -1).join("/");
        assureDirectory(parentDirectory);
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
 * FileKit.writeFile("file.txt", "Hello world!");
 *
 * // With config
 * FileKit.writeFile("file.txt", "Hello world!", { logError: true });
 */
const writeFile = (file: string, content: string, config?: BaseFileConfig) => {
    attempt(
        () => {
            const { created } = assureFile(file, content);
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
 * FileKit.appendFile("file.txt", "Hello world!");
 * FileKit.appendFile("file.txt", "Hello world!", { logError: true });
 * FileKit.appendFile("file.txt", "Hello world!", { onError: (error) => console.log(error) });
 */
const appendFile = (file: string, content: string, config?: BaseFileConfig) => {
    attempt(
        () => {
            const { created } = assureFile(file, content);
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
 * Delete a file. Will do nothing if the file does not exist. Configurable with the second argument.
 * @param file - The file path.
 * @param config - Configurable options.
 * @returns - void
 * @example
 * FileKit.deleteFile("file.txt");
 * FileKit.deleteFile("file.txt", { logError: true });
 * FileKit.deleteFile("file.txt", { onError: (error) => console.log(error) });
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
 * FileKit.deleteFiles(["file.txt", "file2.txt"]);
 * FileKit.deleteFiles(["file.txt", "file2.txt"], { logError: true });
 * FileKit.deleteFiles(["file.txt", "file2.txt"], { onError: (error) => console.log(error) });
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
 * FileKit.deleteDirectory("dir");
 * FileKit.deleteDirectory("dir", { logError: true });
 * FileKit.deleteDirectory("dir", { onError: (error) => console.log(error) });
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
 * FileKit.createDirectory("dir");
 * FileKit.createDirectory("dir", { logError: true });
 * FileKit.createDirectory("dir", { onError: (error) => console.log(error) });
 */
const createDirectory = (dir: string, config?: BaseFileConfig) => {
    return attempt(
        () => {
            if (pathExists(dir, { type: "directory" })) return;
            assureDirectory(dir);
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
 * const exists = FileKit.directoryExists("dir"); // true or false
 * const exists = FileKit.directoryExists("dir", { logError: true });
 * const exists = FileKit.directoryExists("dir", { onError: (error) => console.log(error) });
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
 * FileKit.copyFile("file.txt", "file2.txt");
 * FileKit.copyFile("file.txt", "file2.txt", { logError: true });
 * FileKit.copyFile("file.txt", "file2.txt", { onError: (error) => console.log(error) });
 */
const copyFile = (source: string, destination: string, config?: BaseFileConfig) => {
    return attempt(
        () => {
            assureDirectory(destination);
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
 * FileKit.copyDirectory("dir", "dir2");
 * FileKit.copyDirectory("dir", "dir2", { logError: true });
 * FileKit.copyDirectory("dir", "dir2", { onError: (error) => console.log(error) });
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

            assureDirectory(destination);

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
 * A file utility for reading and writing files using the fs module. You don't need try/catch blocks, use the `onError` callback instead.
 */
export const FileKit = {
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
