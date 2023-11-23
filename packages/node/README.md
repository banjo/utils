# @banjoanton/node-utils

A collection of some of my most used node-specific JavaScript / TypeScript utility functions.

[![NPM version](https://img.shields.io/npm/v/@banjoanton/node-utils?color=%23c53635&label=%20)](https://www.npmjs.com/package/@banjoanton/node-utils)

-   :palm_tree: - Three-shakable ESM modules.
-   :speech_balloon: - Fully typed TSDocs with examples
-   :file_folder: - Small size
-   :bookmark: - Own well-tested utilities or imported from large open source projects.

## Install

```bash
# npm
npm install @banjoanton/node-utils

# yarn
yarn add @banjoanton/node-utils

# pnpm
pnpm install @banjoanton/node-utils
```

## Import

```ts
import { Logger } from "@banjoanton/node-utils";
// or
const { Logger } = require("@banjoanton/node-utils");
```

## Docs

Auto generated from TSDocs.

<!-- DOCS START -->

### Table of Contents

-   [File](#file)
    -   [copy](#copy)
    -   [move](#move)
    -   [pathExists](#pathExists)
    -   [writeFile](#writeFile)
    -   [appendFile](#appendFile)
    -   [readFile](#readFile)
    -   [remove](#remove)
    -   [removeMultiple](#removeMultiple)
    -   [createDirectory](#createDirectory)
    -   [fileExists](#fileExists)
    -   [directoryExists](#directoryExists)
-   [Logger](#logger)
    -   [Logger](#Logger)

### File

A file utility for reading and writing files using the fs module.

---

#### copy

> Copy a file or directory. Overwrites the destination by default. Error if source does not exist or destination is a file name. Handle with `onError` callback. Configurable with the third argument.

```ts
FileKit.copy("file.txt", "file2.txt");

FileKit.copy("dir", "dir2");
```

---

#### move

> Move a file or directory. Overwrites the destination by default. Error if source does not exist. Handle with `onError` callback. Configurable with the third argument.

```ts
FileKit.move("file.txt", "file2.txt");
FileKit.move("dir", "dir2");
```

---

#### pathExists

> Check if a path exists. Configurable with the second argument.

```ts
const fileOrFolderExists = FileKit.pathExists("file.txt");
const explicitFileOrFolderExists = FileKit.pathExists("file.txt", { type: "all" });
const fileExists = FileKit.pathExists("file.txt", { type: "file" });
const folderExists = FileKit.pathExists("dir", { type: "directory" });
```

---

#### writeFile

> Write to a file with the given content. If it exists, it will be overwritten. Otherwise it will be created. If the directory does not exist, it will be created. Configurable with the third argument.

```ts
FileKit.writeFile("file.txt", "Hello world!");

// With config
FileKit.writeFile("file.txt", "Hello world!", { logError: true });
```

---

#### appendFile

> Append content to a file. If the file does not exist, it will be created. If the directory does not exist, it will be created. Configurable with the third argument.

```ts
FileKit.appendFile("file.txt", "Hello world!");
FileKit.appendFile("file.txt", "Hello world!", { logError: true });
FileKit.appendFile("file.txt", "Hello world!", { onError: error => console.log(error) });
```

---

#### readFile

> Read a file. Will return undefined if the file does not exist. Configurable with the second argument.

```ts
const content = FileKit.readFile("file.txt"); // undefined or string

const content = FileKit.readFile("file.txt", { logError: true });
const content = FileKit.readFile("file.txt", { onError: error => console.log(error) });
```

---

#### remove

> Delete a file or directory. Will do nothing if the path does not exist. Configurable with the second argument.

```ts
FileKit.remove("file.txt");
FileKit.remove("file.txt", { logError: true });
FileKit.remove("file.txt", { onError: error => console.log(error) });

FileKit.remove("dir");
FileKit.remove("dir", { logError: true });
FileKit.remove("dir", { onError: error => console.log(error) });
```

---

#### removeMultiple

> Delete multiple files. Will do nothing if the file does not exist. Configurable with the second argument.

```ts
FileKit.removeMultiple(["file.txt", "file2.txt"]);
FileKit.removeMultiple(["file.txt", "file2.txt"], { logError: true });
FileKit.removeMultiple(["file.txt", "file2.txt"], { onError: error => console.log(error) });

FileKit.removeMultiple(["dir", "dir2"]);
FileKit.removeMultiple(["dir", "dir2"], { logError: true });
FileKit.removeMultiple(["dir", "dir2"], { onError: error => console.log(error) });
```

---

#### createDirectory

> Create a directory. Will do nothing if the directory already exists. Configurable with the second argument.

```ts
FileKit.createDirectory("dir");
FileKit.createDirectory("dir", { logError: true });
FileKit.createDirectory("dir", { onError: error => console.log(error) });
```

---

#### fileExists

> Will return true if the file exists. Does not work for directories. Configurable with the second argument.

```ts
const exists = FileKit.fileExists("file.txt"); // true or false
const exists = FileKit.fileExists("file.txt", { logError: true });
const exists = FileKit.fileExists("file.txt", { onError: error => console.log(error) });
```

---

#### directoryExists

> Check if a directory exists. Does not work for files. Configurable with the second argument.

```ts
const exists = FileKit.directoryExists("dir"); // true or false
const exists = FileKit.directoryExists("dir", { logError: true });
const exists = FileKit.directoryExists("dir", { onError: error => console.log(error) });
```

---

### Logger

A simple logger that logs to the console and optionally to a file. Based on consola. Should mainly be used for CLI tools.

---

#### Logger

> A simple logger with styled output. Support for debug mode, file logging, and more.

```ts
// Log to console
Logger.debug("Hello world!");
Logger.log("Hello world!");
Logger.info("Hello world!");
Logger.success("Hello world!");
Logger.warning("Hello world!");
Logger.error("Hello world!");

// Configure logger
Logger.setLoggerConfig({ debug: true });

// Log to file
Logger.setLoggerConfig({ logFile: "logs.txt" });
```

---

<!-- DOCS END -->
