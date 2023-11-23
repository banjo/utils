import fs from "fs";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FileKit } from "../src";

const testDirectory = "./tests-folder-name";
const getNewPath = (fileName: string) => `${testDirectory}/${fileName}`;

describe("file", () => {
    const defaultFileName = getNewPath("file.txt");
    const content = "Hello world!";

    afterEach(() => {
        FileKit.remove(testDirectory);
    });

    beforeEach(() => {
        FileKit.createDirectory(testDirectory);
    });

    describe("createFile", () => {
        it("create basic", () => {
            FileKit.writeFile(defaultFileName, content);
            const fileContent = fs.readFileSync(defaultFileName, "utf8");
            expect(fileContent).toBe(content);
        });

        it("overwrite", () => {
            const newContent = "Hello world 2!";
            FileKit.writeFile(defaultFileName, content);
            expect(fs.readFileSync(defaultFileName, "utf8")).toBe(content);

            FileKit.writeFile(defaultFileName, newContent);
            expect(fs.readFileSync(defaultFileName, "utf8")).toBe(newContent);
        });

        it("create to non-existing directory", () => {
            const fileName = getNewPath("folder/file.txt");
            FileKit.writeFile(fileName, content);
            expect(fs.readFileSync(fileName, "utf8")).toBe(content);
        });
    });

    describe("appendFile", () => {
        it("append basic", () => {
            FileKit.writeFile(defaultFileName, content);
            const fileContent = fs.readFileSync(defaultFileName, "utf8");
            expect(fileContent).toBe(content);

            const newContent = "Hello world 2!";
            FileKit.appendFile(defaultFileName, newContent);
            expect(fs.readFileSync(defaultFileName, "utf8")).toBe(content + newContent);
        });

        it("append to non-existing file", () => {
            const newContent = "Hello world 2!";
            FileKit.appendFile(defaultFileName, newContent);
            expect(fs.readFileSync(defaultFileName, "utf8")).toBe(newContent);
        });

        it("append to non-existing directory", () => {
            const newContent = "Hello world 2!";
            const fileName = getNewPath("folder/file.txt");
            FileKit.appendFile(fileName, newContent);
            expect(fs.readFileSync(fileName, "utf8")).toBe(newContent);
        });
    });

    describe("readFile", () => {
        it("read basic", () => {
            fs.writeFileSync(defaultFileName, content);
            const fileContent = FileKit.readFile(defaultFileName);
            expect(fileContent).toBe(content);
        });

        it("read non-existing file", () => {
            const fileContent = FileKit.readFile(defaultFileName);
            expect(fileContent).toBe(undefined);
        });

        it("read non-existing directory", () => {
            const fileName = getNewPath("folder/file.txt");
            const fileContent = FileKit.readFile(fileName);
            expect(fileContent).toBe(undefined);
        });
    });

    describe("remove file", () => {
        it("delete basic", () => {
            fs.writeFileSync(defaultFileName, content);
            FileKit.remove(defaultFileName);
            expect(fs.existsSync(defaultFileName)).toBe(false);
        });

        it("delete non-existing file", () => {
            FileKit.remove(defaultFileName);
            expect(fs.existsSync(defaultFileName)).toBe(false);
        });

        it("delete non-existing directory", () => {
            const fileName = getNewPath("folder/file.txt");
            FileKit.remove(fileName);
            expect(fs.existsSync(fileName)).toBe(false);
        });
    });

    describe("createDirectory", () => {
        it("create basic", () => {
            FileKit.createDirectory(testDirectory);
            expect(fs.existsSync(testDirectory)).toBe(true);
        });

        it("create to non-existing directory", () => {
            const directoryName = getNewPath("folder");
            FileKit.createDirectory(directoryName);
            expect(fs.existsSync(directoryName)).toBe(true);
        });

        it("should return undefined if it already exists", () => {
            FileKit.createDirectory(testDirectory);
            expect(FileKit.createDirectory(testDirectory)).toBe(undefined);
        });
    });

    describe("copy file", () => {
        it("copy basic", () => {
            FileKit.writeFile(defaultFileName, content);
            const newFileName = getNewPath("file2.txt");
            FileKit.copy(defaultFileName, newFileName);
            expect(fs.existsSync(newFileName)).toBe(true);
        });

        it("copy to non-existing directory should create directory", () => {
            fs.writeFileSync(defaultFileName, content);
            const newFileName = getNewPath("folder/file2.txt");
            FileKit.copy(defaultFileName, newFileName, { logError: true });
            expect(fs.existsSync(newFileName)).toBe(true);
            expect(fs.readFileSync(newFileName, "utf8")).toBe(content);
        });

        it("copy from non-existing file should trigger error", () => {
            const errorFn = vi.fn();
            FileKit.copy(defaultFileName, "file2.txt", { onError: errorFn });
            expect(errorFn).toHaveBeenCalled();
        });

        it("copy from non-existing directory should trigger error", () => {
            const errorFn = vi.fn();
            FileKit.copy("folder/file.txt", "file2.txt", { onError: errorFn });
            expect(errorFn).toHaveBeenCalled();
        });

        it("copy to existing file should overwrite it", () => {
            fs.writeFileSync(defaultFileName, content);
            const newFileName = getNewPath("file2.txt");
            fs.writeFileSync(newFileName, "Hello world 2!");
            FileKit.copy(defaultFileName, newFileName);
            expect(fs.readFileSync(newFileName, "utf8")).toBe(content);
        });
    });

    describe("copy directory", () => {
        it("copy basic", () => {
            const newDirectory = getNewPath("newFolder");
            fs.mkdirSync(newDirectory);
            fs.writeFileSync(`${newDirectory}/file.txt`, content);
            FileKit.copy(newDirectory, `${newDirectory}2`);
            expect(fs.existsSync(`${newDirectory}2`)).toBe(true);
            expect(fs.existsSync(`${newDirectory}2/file.txt`)).toBe(true);
        });

        it("copy to non-existing directory should create directory", () => {
            const newDirectory = getNewPath("newFolder");
            fs.mkdirSync(newDirectory);
            fs.writeFileSync(`${newDirectory}/file.txt`, content);
            FileKit.copy(newDirectory, `${newDirectory}2`);
            expect(fs.existsSync(`${newDirectory}2`)).toBe(true);
            expect(fs.existsSync(`${newDirectory}2/file.txt`)).toBe(true);
        });

        it("copy from non-existing directory should trigger error", () => {
            const errorFn = vi.fn();
            FileKit.copy("folder", "folder2", { onError: errorFn });
            expect(errorFn).toHaveBeenCalled();
        });

        it("copy to existing directory should overwrite it", () => {
            const newDirectory = getNewPath("newFolder");
            fs.mkdirSync(newDirectory);
            fs.writeFileSync(`${newDirectory}/file.txt`, content);
            FileKit.copy(newDirectory, `${newDirectory}2`);
            expect(fs.existsSync(`${newDirectory}2`)).toBe(true);
            expect(fs.existsSync(`${newDirectory}2/file.txt`)).toBe(true);
        });

        it("copy to subdirectory of source should trigger error", () => {
            const newDirectory = getNewPath("newFolder");
            fs.mkdirSync(newDirectory);
            const errorFn = vi.fn();
            FileKit.copy(newDirectory, `${newDirectory}/folder2`, { onError: errorFn });
            expect(errorFn).toHaveBeenCalled();
            expect(fs.existsSync(`${newDirectory}/folder2`)).toBe(false);
        });

        it("copy to itself should trigger error", () => {
            const newDirectory = getNewPath("newFolder");
            fs.mkdirSync(newDirectory);
            const errorFn = vi.fn();
            FileKit.copy(newDirectory, newDirectory, { onError: errorFn });
            expect(errorFn).toHaveBeenCalled();
        });
    });

    describe("move", () => {
        it("move basic", () => {
            FileKit.writeFile(defaultFileName, content);
            const newFileName = getNewPath("file2.txt");
            FileKit.move(defaultFileName, newFileName);
            expect(fs.existsSync(newFileName)).toBe(true);
            expect(fs.existsSync(defaultFileName)).toBe(false);
        });

        it("move to non-existing directory should create directory", () => {
            fs.writeFileSync(defaultFileName, content);
            const newFileName = getNewPath("folder/file2.txt");
            FileKit.move(defaultFileName, newFileName);
            expect(fs.existsSync(newFileName)).toBe(true);
            expect(fs.existsSync(defaultFileName)).toBe(false);
        });

        it("move from non-existing file should trigger error", () => {
            const errorFn = vi.fn();
            FileKit.move(defaultFileName, "file2.txt", { onError: errorFn });
            expect(errorFn).toHaveBeenCalled();
        });

        it("move from non-existing directory should trigger error", () => {
            const errorFn = vi.fn();
            FileKit.move("folder/file.txt", "file2.txt", { onError: errorFn });
            expect(errorFn).toHaveBeenCalled();
        });

        it("move to existing file should overwrite it", () => {
            fs.writeFileSync(defaultFileName, content);
            const newFileName = getNewPath("file2.txt");
            FileKit.writeFile(newFileName, "Hello world 2!");
            FileKit.move(defaultFileName, newFileName);
            expect(fs.readFileSync(newFileName, "utf8")).toBe(content);
        });

        it("move directory", () => {
            const source = getNewPath("newFolder");
            FileKit.writeFile(`${source}/file.txt`, content);
            const dest = getNewPath("destFolder");
            FileKit.move(source, dest);
            expect(fs.existsSync(source)).toBe(false);
            expect(fs.existsSync(`${dest}/file.txt`)).toBe(true);
            expect(fs.readFileSync(`${dest}/file.txt`, "utf8")).toBe(content);
        });
    });
});
