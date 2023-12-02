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
    -   [pathExistsSync](#pathExistsSync)
    -   [pathExists](#pathExists)
    -   [writeFileSync](#writeFileSync)
    -   [writeFile](#writeFile)
    -   [appendFileSync](#appendFileSync)
    -   [appendFile](#appendFile)
    -   [readFileSync](#readFileSync)
    -   [readFile](#readFile)
    -   [removeSync](#removeSync)
    -   [remove](#remove)
    -   [removeMultipleSync](#removeMultipleSync)
    -   [removeMultiple](#removeMultiple)
    -   [createDirectorySync](#createDirectorySync)
    -   [createDirectory](#createDirectory)
    -   [fileExistsSync](#fileExistsSync)
    -   [fileExists](#fileExists)
    -   [directoryExistsSync](#directoryExistsSync)
    -   [directoryExists](#directoryExists)
    -   [copySync](#copySync)
    -   [copy](#copy)
    -   [moveSync](#moveSync)
    -   [move](#move)
-   [Logger](#logger)
    -   [Logger](#Logger)

### File

A file utility for reading and writing files using the fs module.

---

#### pathExistsSync

> Check if a path exists. Configurable with the second argument.

```ts
const fileOrFolderExists = FileKit.pathExistsSync("file.txt");
const explicitFileOrFolderExists = FileKit.pathExistsSync("file.txt", { type: "all" });
const fileExistsSync = FileKit.pathExistsSync("file.txt", { type: "file" });
const folderExists = FileKit.pathExistsSync("dir", { type: "directory" });
```

---

#### pathExists

> Check if a path exists async. Configurable with the second argument.

```ts
const fileOrFolderExists = await FileKit.pathExists("file.txt");
const explicitFileOrFolderExists = await FileKit.pathExists("file.txt", { type: "all" });
const fileExistsSync = await FileKit.pathExists("file.txt", { type: "file" });
const folderExists = await FileKit.pathExists("dir", { type: "directory" });
```

---

#### writeFileSync

> Write to a file with the given content. If it exists, it will be overwritten. Otherwise it will be created. If the directory does not exist, it will be created. Configurable with the third argument.

```ts
FileKit.writeFileSync("file.txt", "Hello world!");

// With config
FileKit.writeFileSync("file.txt", "Hello world!", { logError: true });
```

---

#### writeFile

> Write to a file with the given content async. If it exists, it will be overwritten. Otherwise it will be created. If the directory does not exist, it will be created. Configurable with the third argument.

```ts
await FileKit.writeFile("file.txt", "Hello world!");

// With config
await FileKit.writeFile("file.txt", "Hello world!", { logError: true });
```

---

#### appendFileSync

> Append content to a file. If the file does not exist, it will be created. If the directory does not exist, it will be created. Configurable with the third argument.

```ts
FileKit.appendFileSync("file.txt", "Hello world!");
FileKit.appendFileSync("file.txt", "Hello world!", { logError: true });
FileKit.appendFileSync("file.txt", "Hello world!", { onError: error => console.log(error) });
```

---

#### appendFile

> Append content to a file async. If the file does not exist, it will be created. If the directory does not exist, it will be created. Configurable with the third argument.

```ts
await FileKit.appendFile("file.txt", "Hello world!");
await FileKit.appendFile("file.txt", "Hello world!", { logError: true });
await FileKit.appendFile("file.txt", "Hello world!", { onError: error => console.log(error) });
```

---

#### readFileSync

> Read a file. Will return undefined if the file does not exist. Configurable with the second argument.

```ts
const content = FileKit.readFileSync("file.txt"); // undefined or string

const content = FileKit.readFileSync("file.txt", { logError: true });
const content = FileKit.readFileSync("file.txt", { onError: error => console.log(error) });
```

---

#### readFile

> Read a file async. Will return undefined if the file does not exist. Configurable with the second argument.

```ts
const content = await FileKit.readFile("file.txt"); // undefined or string

const content = await FileKit.readFile("file.txt", { logError: true });
const content = await FileKit.readFile("file.txt", { onError: error => console.log(error) });
```

---

#### removeSync

> Delete a file or directory. Will do nothing if the path does not exist. Configurable with the second argument.

```ts
FileKit.removeSync("file.txt");
FileKit.removeSync("file.txt", { logError: true });
FileKit.removeSync("file.txt", { onError: error => console.log(error) });

FileKit.removeSync("dir");
FileKit.removeSync("dir", { logError: true });
FileKit.removeSync("dir", { onError: error => console.log(error) });
```

---

#### remove

> Delete a file or directory async. Will do nothing if the path does not exist. Configurable with the second argument.

```ts
await FileKit.remove("file.txt");
await FileKit.remove("file.txt", { logError: true });
await FileKit.remove("file.txt", { onError: error => console.log(error) });

await FileKit.remove("dir");
await FileKit.remove("dir", { logError: true });
await FileKit.remove("dir", { onError: error => console.log(error) });
```

---

#### removeMultipleSync

> Delete multiple files. Will do nothing if the file does not exist. Configurable with the second argument.

```ts
FileKit.removeMultipleSync(["file.txt", "file2.txt"]);
FileKit.removeMultipleSync(["file.txt", "file2.txt"], { logError: true });
FileKit.removeMultipleSync(["file.txt", "file2.txt"], { onError: error => console.log(error) });

FileKit.removeMultipleSync(["dir", "dir2"]);
FileKit.removeMultipleSync(["dir", "dir2"], { logError: true });
FileKit.removeMultipleSync(["dir", "dir2"], { onError: error => console.log(error) });
```

---

#### removeMultiple

> Delete multiple files async. Will do nothing if the file does not exist. Configurable with the second argument.

```ts
await FileKit.removeMultiple(["file.txt", "file2.txt"]);
await FileKit.removeMultiple(["file.txt", "file2.txt"], { logError: true });
await FileKit.removeMultiple(["file.txt", "file2.txt"], { onError: error => console.log(error) });

await FileKit.removeMultiple(["dir", "dir2"]);
await FileKit.removeMultiple(["dir", "dir2"], { logError: true });
await FileKit.removeMultiple(["dir", "dir2"], { onError: error => console.log(error) });
```

---

#### createDirectorySync

> Create a directory. Will do nothing if the directory already exists. Configurable with the second argument.

```ts
FileKit.createDirectorySync("dir");
FileKit.createDirectorySync("dir", { logError: true });
FileKit.createDirectorySync("dir", { onError: error => console.log(error) });
```

---

#### createDirectory

> Create a directory async. Will do nothing if the directory already exists. Configurable with the second argument.

```ts
await FileKit.createDirectory("dir");
await FileKit.createDirectory("dir", { logError: true });
await FileKit.createDirectory("dir", { onError: error => console.log(error) });
```

---

#### fileExistsSync

> Will return true if the file exists. Does not work for directories. Configurable with the second argument.

```ts
const exists = FileKit.fileExistsSync("file.txt"); // true or false
const exists = FileKit.fileExistsSync("file.txt", { logError: true });
const exists = FileKit.fileExistsSync("file.txt", { onError: error => console.log(error) });
```

---

#### fileExists

> Will return true if the file exists async. Does not work for directories. Configurable with the second argument.

```ts
const exists = await FileKit.fileExists("file.txt"); // true or false
const exists = await FileKit.fileExists("file.txt", { logError: true });
const exists = await FileKit.fileExists("file.txt", { onError: error => console.log(error) });
```

---

#### directoryExistsSync

> Check if a directory exists. Does not work for files. Configurable with the second argument.

```ts
const exists = FileKit.directoryExistsSync("dir"); // true or false
const exists = FileKit.directoryExistsSync("dir", { logError: true });
const exists = FileKit.directoryExistsSync("dir", { onError: error => console.log(error) });
```

---

#### directoryExists

> Check if a directory exists async. Does not work for files. Configurable with the second argument.

```ts
const exists = await FileKit.directoryExists("dir"); // true or false
const exists = await FileKit.directoryExists("dir", { logError: true });
const exists = await FileKit.directoryExists("dir", { onError: error => console.log(error) });
```

---

#### copySync

> Copy a file or directory. Overwrites the destination by default. Error if source does not exist or destination is a file name. Handle with `onError` callback. Configurable with the third argument.

```ts
FileKit.copySync("file.txt", "file2.txt");

FileKit.copySync("dir", "dir2");
```

---

#### copy

> Copy a file or directory async. Overwrites the destination by default. Error if source does not exist or destination is a file name. Handle with `onError` callback. Configurable with the third argument.

```ts
await FileKit.copy("file.txt", "file2.txt");

await FileKit.copy("dir", "dir2");
```

---

#### moveSync

> Move a file or directory. Overwrites the destination by default. Error if source does not exist. Handle with `onError` callback. Configurable with the third argument.

```ts
FileKit.moveSync("file.txt", "file2.txt");
FileKit.moveSync("dir", "dir2");
```

---

#### move

> Move a file or directory async. Overwrites the destination by default. Error if source does not exist. Handle with `onError` callback. Configurable with the third argument.

```ts
await FileKit.move("file.txt", "file2.txt");
await FileKit.move("dir", "dir2");
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
