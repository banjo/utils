import fs from "fs";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FileUtil } from "../src";

const testDirectory = "./tests-folder-name";
const getNewPath = (fileName: string) => `${testDirectory}/${fileName}`;

describe("file", () => {
    const defaultFileName = getNewPath("file.txt");
    const content = "Hello world!";

    afterEach(() => {
        FileUtil.deleteDirectory(testDirectory);
    });

    beforeEach(() => {
        FileUtil.createDirectory(testDirectory);
    });

    describe("createFile", () => {
        it("create basic", () => {
            FileUtil.writeFile(defaultFileName, content);
            const fileContent = fs.readFileSync(defaultFileName, "utf8");
            expect(fileContent).toBe(content);
        });

        it("overwrite", () => {
            const newContent = "Hello world 2!";
            FileUtil.writeFile(defaultFileName, content);
            expect(fs.readFileSync(defaultFileName, "utf8")).toBe(content);

            FileUtil.writeFile(defaultFileName, newContent);
            expect(fs.readFileSync(defaultFileName, "utf8")).toBe(newContent);
        });

        it("create to non-existing directory", () => {
            const fileName = getNewPath("folder/file.txt");
            FileUtil.writeFile(fileName, content);
            expect(fs.readFileSync(fileName, "utf8")).toBe(content);
        });
    });

    describe("appendFile", () => {
        it("append basic", () => {
            FileUtil.writeFile(defaultFileName, content);
            const fileContent = fs.readFileSync(defaultFileName, "utf8");
            expect(fileContent).toBe(content);

            const newContent = "Hello world 2!";
            FileUtil.appendFile(defaultFileName, newContent);
            expect(fs.readFileSync(defaultFileName, "utf8")).toBe(content + newContent);
        });

        it("append to non-existing file", () => {
            const newContent = "Hello world 2!";
            FileUtil.appendFile(defaultFileName, newContent);
            expect(fs.readFileSync(defaultFileName, "utf8")).toBe(newContent);
        });

        it("append to non-existing directory", () => {
            const newContent = "Hello world 2!";
            const fileName = getNewPath("folder/file.txt");
            FileUtil.appendFile(fileName, newContent);
            expect(fs.readFileSync(fileName, "utf8")).toBe(newContent);
        });
    });

    describe("readFile", () => {
        it("read basic", () => {
            fs.writeFileSync(defaultFileName, content);
            const fileContent = FileUtil.readFile(defaultFileName);
            expect(fileContent).toBe(content);
        });

        it("read non-existing file", () => {
            const fileContent = FileUtil.readFile(defaultFileName);
            expect(fileContent).toBe(undefined);
        });

        it("read non-existing directory", () => {
            const fileName = getNewPath("folder/file.txt");
            const fileContent = FileUtil.readFile(fileName);
            expect(fileContent).toBe(undefined);
        });
    });

    describe("deleteFile", () => {
        it("delete basic", () => {
            fs.writeFileSync(defaultFileName, content);
            FileUtil.deleteFile(defaultFileName);
            expect(fs.existsSync(defaultFileName)).toBe(false);
        });

        it("delete non-existing file", () => {
            FileUtil.deleteFile(defaultFileName);
            expect(fs.existsSync(defaultFileName)).toBe(false);
        });

        it("delete non-existing directory", () => {
            const fileName = getNewPath("folder/file.txt");
            FileUtil.deleteFile(fileName);
            expect(fs.existsSync(fileName)).toBe(false);
        });
    });

    describe("createDirectory", () => {
        it("create basic", () => {
            FileUtil.createDirectory(testDirectory);
            expect(fs.existsSync(testDirectory)).toBe(true);
        });

        it("create to non-existing directory", () => {
            const directoryName = getNewPath("folder");
            FileUtil.createDirectory(directoryName);
            expect(fs.existsSync(directoryName)).toBe(true);
        });

        it("should return undefined if it already exists", () => {
            FileUtil.createDirectory(testDirectory);
            expect(FileUtil.createDirectory(testDirectory)).toBe(undefined);
        });
    });

    describe("copyFile", () => {
        it("copy basic", () => {
            FileUtil.writeFile(defaultFileName, content);
            const newFileName = getNewPath("file2.txt");
            FileUtil.copyFile(defaultFileName, newFileName);
            expect(fs.existsSync(newFileName)).toBe(true);
        });

        it("copy to non-existing directory should create directory", () => {
            fs.writeFileSync(defaultFileName, content);
            const newFileName = getNewPath("folder/file2.txt");
            FileUtil.copyFile(defaultFileName, newFileName, { logError: true });
            expect(fs.existsSync(newFileName)).toBe(true);
            expect(fs.readFileSync(newFileName, "utf8")).toBe(content);
        });

        it("copy from non-existing file should trigger error", () => {
            const errorFn = vi.fn();
            FileUtil.copyFile(defaultFileName, "file2.txt", { onError: errorFn });
            expect(errorFn).toHaveBeenCalled();
        });

        it("copy from non-existing directory should trigger error", () => {
            const errorFn = vi.fn();
            FileUtil.copyFile("folder/file.txt", "file2.txt", { onError: errorFn });
            expect(errorFn).toHaveBeenCalled();
        });

        it("copy to existing file should overwrite it", () => {
            fs.writeFileSync(defaultFileName, content);
            const newFileName = getNewPath("file2.txt");
            fs.writeFileSync(newFileName, "Hello world 2!");
            FileUtil.copyFile(defaultFileName, newFileName);
            expect(fs.readFileSync(newFileName, "utf8")).toBe(content);
        });
    });

    describe("copyDirectory", () => {
        it("copy basic", () => {
            const newDirectory = getNewPath("newFolder");
            fs.mkdirSync(newDirectory);
            fs.writeFileSync(`${newDirectory}/file.txt`, content);
            FileUtil.copyDirectory(newDirectory, `${newDirectory}2`);
            expect(fs.existsSync(`${newDirectory}2`)).toBe(true);
            expect(fs.existsSync(`${newDirectory}2/file.txt`)).toBe(true);
        });

        it("copy to non-existing directory should create directory", () => {
            const newDirectory = getNewPath("newFolder");
            fs.mkdirSync(newDirectory);
            fs.writeFileSync(`${newDirectory}/file.txt`, content);
            FileUtil.copyDirectory(newDirectory, `${newDirectory}2`);
            expect(fs.existsSync(`${newDirectory}2`)).toBe(true);
            expect(fs.existsSync(`${newDirectory}2/file.txt`)).toBe(true);
        });

        it("copy from non-existing directory should trigger error", () => {
            const errorFn = vi.fn();
            FileUtil.copyDirectory("folder", "folder2", { onError: errorFn });
            expect(errorFn).toHaveBeenCalled();
        });

        it("copy to existing directory should overwrite it", () => {
            const newDirectory = getNewPath("newFolder");
            fs.mkdirSync(newDirectory);
            fs.writeFileSync(`${newDirectory}/file.txt`, content);
            FileUtil.copyDirectory(newDirectory, `${newDirectory}2`);
            expect(fs.existsSync(`${newDirectory}2`)).toBe(true);
            expect(fs.existsSync(`${newDirectory}2/file.txt`)).toBe(true);
        });

        it("copy to subdirectory of source should trigger error", () => {
            const newDirectory = getNewPath("newFolder");
            fs.mkdirSync(newDirectory);
            const errorFn = vi.fn();
            FileUtil.copyDirectory(newDirectory, `${newDirectory}/folder2`, { onError: errorFn });
            expect(errorFn).toHaveBeenCalled();
            expect(fs.existsSync(`${newDirectory}/folder2`)).toBe(false);
        });

        it("copy to itself should trigger error", () => {
            const newDirectory = getNewPath("newFolder");
            fs.mkdirSync(newDirectory);
            const errorFn = vi.fn();
            FileUtil.copyDirectory(newDirectory, newDirectory, { onError: errorFn });
            expect(errorFn).toHaveBeenCalled();
        });

        it("copy to file extension should trigger error", () => {
            const newDirectory = getNewPath("newFolder");
            fs.mkdirSync(newDirectory);
            const errorFn = vi.fn();
            FileUtil.copyDirectory(newDirectory, `${newDirectory}.txt`, { onError: errorFn });
            expect(errorFn).toHaveBeenCalled();
        });
    });
});
