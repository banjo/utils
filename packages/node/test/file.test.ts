import fs from "fs";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FileKit } from "../src";

const testDirectory = "./tests-folder-name";
const getNewPath = (fileName: string) => `${testDirectory}/${fileName}`;

describe("file", () => {
    const defaultFileName = getNewPath("file.txt");
    const content = "Hello world!";

    afterEach(() => {
        FileKit.removeSync(testDirectory);
    });

    beforeEach(() => {
        FileKit.createDirectorySync(testDirectory);
    });

    describe("createFileSync", () => {
        it("create basic", () => {
            FileKit.writeFileSync(defaultFileName, content);
            const fileContent = fs.readFileSync(defaultFileName, "utf8");
            expect(fileContent).toBe(content);
        });

        it("overwrite", () => {
            const newContent = "Hello world 2!";
            FileKit.writeFileSync(defaultFileName, content);
            expect(fs.readFileSync(defaultFileName, "utf8")).toBe(content);

            FileKit.writeFileSync(defaultFileName, newContent);
            expect(fs.readFileSync(defaultFileName, "utf8")).toBe(newContent);
        });

        it("create to non-existing directory", () => {
            const fileName = getNewPath("folder/file.txt");
            FileKit.writeFileSync(fileName, content);
            expect(fs.readFileSync(fileName, "utf8")).toBe(content);
        });
    });

    describe("createFile", () => {
        it("create basic", async () => {
            await FileKit.writeFile(defaultFileName, content);
            const fileContent = fs.readFileSync(defaultFileName, "utf8");
            expect(fileContent).toBe(content);
        });

        it("overwrite", async () => {
            const newContent = "Hello world 2!";
            await FileKit.writeFile(defaultFileName, content);
            expect(fs.readFileSync(defaultFileName, "utf8")).toBe(content);

            await FileKit.writeFile(defaultFileName, newContent);
            expect(fs.readFileSync(defaultFileName, "utf8")).toBe(newContent);
        });

        it("create to non-existing directory", async () => {
            const fileName = getNewPath("folder/file.txt");
            await FileKit.writeFile(fileName, content);
            expect(fs.readFileSync(fileName, "utf8")).toBe(content);
        });
    });

    describe("appendFileSync", () => {
        it("append basic", () => {
            FileKit.writeFileSync(defaultFileName, content);
            const fileContent = fs.readFileSync(defaultFileName, "utf8");
            expect(fileContent).toBe(content);

            const newContent = "Hello world 2!";
            FileKit.appendFileSync(defaultFileName, newContent);
            expect(fs.readFileSync(defaultFileName, "utf8")).toBe(content + newContent);
        });

        it("append to non-existing file", () => {
            const newContent = "Hello world 2!";
            FileKit.appendFileSync(defaultFileName, newContent);
            expect(fs.readFileSync(defaultFileName, "utf8")).toBe(newContent);
        });

        it("append to non-existing directory", () => {
            const newContent = "Hello world 2!";
            const fileName = getNewPath("folder/file.txt");
            FileKit.appendFileSync(fileName, newContent);
            expect(fs.readFileSync(fileName, "utf8")).toBe(newContent);
        });
    });

    describe("appendFile", () => {
        it("append basic", async () => {
            await FileKit.writeFile(defaultFileName, content);
            const fileContent = fs.readFileSync(defaultFileName, "utf8");
            expect(fileContent).toBe(content);

            const newContent = "Hello world 2!";
            await FileKit.appendFile(defaultFileName, newContent);
            expect(fs.readFileSync(defaultFileName, "utf8")).toBe(content + newContent);
        });

        it("append to non-existing file", async () => {
            const newContent = "Hello world 2!";
            await FileKit.appendFile(defaultFileName, newContent);
            expect(fs.readFileSync(defaultFileName, "utf8")).toBe(newContent);
        });

        it("append to non-existing directory", async () => {
            const newContent = "Hello world 2!";
            const fileName = getNewPath("folder/file.txt");
            await FileKit.appendFile(fileName, newContent);
            expect(fs.readFileSync(fileName, "utf8")).toBe(newContent);
        });
    });

    describe("readFileSync", () => {
        it("read basic", () => {
            fs.writeFileSync(defaultFileName, content);
            const fileContent = FileKit.readFileSync(defaultFileName);
            expect(fileContent).toBe(content);
        });

        it("read non-existing file", () => {
            const fileContent = FileKit.readFileSync(defaultFileName);
            expect(fileContent).toBe(undefined);
        });

        it("read non-existing directory", () => {
            const fileName = getNewPath("folder/file.txt");
            const fileContent = FileKit.readFileSync(fileName);
            expect(fileContent).toBe(undefined);
        });
    });

    describe("readFile", () => {
        it("read basic", async () => {
            fs.writeFileSync(defaultFileName, content);
            const fileContent = await FileKit.readFile(defaultFileName);
            expect(fileContent).toBe(content);
        });

        it("read non-existing file", async () => {
            const fileContent = await FileKit.readFile(defaultFileName);
            expect(fileContent).toBe(undefined);
        });

        it("read non-existing directory", async () => {
            const fileName = getNewPath("folder/file.txt");
            const fileContent = await FileKit.readFile(fileName);
            expect(fileContent).toBe(undefined);
        });
    });

    describe("removeFileSync", () => {
        it("delete basic", () => {
            fs.writeFileSync(defaultFileName, content);
            FileKit.removeSync(defaultFileName);
            expect(fs.existsSync(defaultFileName)).toBe(false);
        });

        it("delete non-existing file", () => {
            FileKit.removeSync(defaultFileName);
            expect(fs.existsSync(defaultFileName)).toBe(false);
        });

        it("delete non-existing directory", () => {
            const fileName = getNewPath("folder/file.txt");
            FileKit.removeSync(fileName);
            expect(fs.existsSync(fileName)).toBe(false);
        });
    });

    describe("removeFile", () => {
        it("delete basic", async () => {
            fs.writeFileSync(defaultFileName, content);
            await FileKit.remove(defaultFileName);
            expect(fs.existsSync(defaultFileName)).toBe(false);
        });

        it("delete non-existing file", async () => {
            await FileKit.remove(defaultFileName);
            expect(fs.existsSync(defaultFileName)).toBe(false);
        });

        it("delete non-existing directory", async () => {
            const fileName = getNewPath("folder/file.txt");
            await FileKit.remove(fileName);
            expect(fs.existsSync(fileName)).toBe(false);
        });
    });

    describe("createDirectorySync", () => {
        it("create basic", () => {
            FileKit.createDirectorySync(testDirectory);
            expect(fs.existsSync(testDirectory)).toBe(true);
        });

        it("create to non-existing directory", () => {
            const directoryName = getNewPath("folder");
            FileKit.createDirectorySync(directoryName);
            expect(fs.existsSync(directoryName)).toBe(true);
        });

        it("should return undefined if it already exists", () => {
            FileKit.createDirectorySync(testDirectory);
            expect(FileKit.createDirectorySync(testDirectory)).toBe(undefined);
        });
    });

    describe("createDirectory", () => {
        it("create basic", async () => {
            await FileKit.createDirectory(testDirectory);
            expect(fs.existsSync(testDirectory)).toBe(true);
        });

        it("create to non-existing directory", async () => {
            const directoryName = getNewPath("folder");
            await FileKit.createDirectory(directoryName);
            expect(fs.existsSync(directoryName)).toBe(true);
        });

        it("should return undefined if it already exists", async () => {
            await FileKit.createDirectory(testDirectory);
            expect(await FileKit.createDirectory(testDirectory)).toBe(undefined);
        });
    });

    describe("copySync file", () => {
        it("copySync basic", () => {
            FileKit.writeFileSync(defaultFileName, content);
            const newFileName = getNewPath("file2.txt");
            FileKit.copySync(defaultFileName, newFileName);
            expect(fs.existsSync(newFileName)).toBe(true);
        });

        it("copySync to non-existing directory should create directory", () => {
            fs.writeFileSync(defaultFileName, content);
            const newFileName = getNewPath("folder/file2.txt");
            FileKit.copySync(defaultFileName, newFileName, { logError: true });
            expect(fs.existsSync(newFileName)).toBe(true);
            expect(fs.readFileSync(newFileName, "utf8")).toBe(content);
        });

        it("copySync from non-existing file should trigger error", () => {
            const errorFn = vi.fn();
            FileKit.copySync(defaultFileName, "file2.txt", { onError: errorFn });
            expect(errorFn).toHaveBeenCalled();
        });

        it("copySync from non-existing directory should trigger error", () => {
            const errorFn = vi.fn();
            FileKit.copySync("folder/file.txt", "file2.txt", { onError: errorFn });
            expect(errorFn).toHaveBeenCalled();
        });

        it("copySync to existing file should overwrite it", () => {
            fs.writeFileSync(defaultFileName, content);
            const newFileName = getNewPath("file2.txt");
            fs.writeFileSync(newFileName, "Hello world 2!");
            FileKit.copySync(defaultFileName, newFileName);
            expect(fs.readFileSync(newFileName, "utf8")).toBe(content);
        });
    });

    describe("copy file", () => {
        it("copy basic", async () => {
            FileKit.writeFileSync(defaultFileName, content);
            const newFileName = getNewPath("file2.txt");
            await FileKit.copy(defaultFileName, newFileName);
            expect(fs.existsSync(newFileName)).toBe(true);
        });

        it("copy to non-existing directory should create directory", async () => {
            fs.writeFileSync(defaultFileName, content);
            const newFileName = getNewPath("folder/file2.txt");
            await FileKit.copy(defaultFileName, newFileName);
            expect(fs.existsSync(newFileName)).toBe(true);
            expect(fs.readFileSync(newFileName, "utf8")).toBe(content);
        });

        it("copy from non-existing file should trigger error", async () => {
            const errorFn = vi.fn();
            await FileKit.copy(defaultFileName, "file2.txt", { onError: errorFn });
            expect(errorFn).toHaveBeenCalled();
        });

        it("copy from non-existing directory should trigger error", async () => {
            const errorFn = vi.fn();
            await FileKit.copy("folder/file.txt", "file2.txt", { onError: errorFn });
            expect(errorFn).toHaveBeenCalled();
        });

        it("copy to existing file should overwrite it", async () => {
            fs.writeFileSync(defaultFileName, content);
            const newFileName = getNewPath("file2.txt");
            fs.writeFileSync(newFileName, "Hello world 2!");
            await FileKit.copy(defaultFileName, newFileName);
            expect(fs.readFileSync(newFileName, "utf8")).toBe(content);
        });
    });

    describe("copySync directory", () => {
        it("copySync basic", () => {
            const newDirectory = getNewPath("newFolder");
            fs.mkdirSync(newDirectory);
            fs.writeFileSync(`${newDirectory}/file.txt`, content);
            FileKit.copySync(newDirectory, `${newDirectory}2`);
            expect(fs.existsSync(`${newDirectory}2`)).toBe(true);
            expect(fs.existsSync(`${newDirectory}2/file.txt`)).toBe(true);
        });

        it("copySync to non-existing directory should create directory", () => {
            const newDirectory = getNewPath("newFolder");
            fs.mkdirSync(newDirectory);
            fs.writeFileSync(`${newDirectory}/file.txt`, content);
            FileKit.copySync(newDirectory, `${newDirectory}2`);
            expect(fs.existsSync(`${newDirectory}2`)).toBe(true);
            expect(fs.existsSync(`${newDirectory}2/file.txt`)).toBe(true);
        });

        it("copySync from non-existing directory should trigger error", () => {
            const errorFn = vi.fn();
            FileKit.copySync("folder", "folder2", { onError: errorFn });
            expect(errorFn).toHaveBeenCalled();
        });

        it("copySync to existing directory should overwrite it", () => {
            const newDirectory = getNewPath("newFolder");
            fs.mkdirSync(newDirectory);
            fs.writeFileSync(`${newDirectory}/file.txt`, content);
            FileKit.copySync(newDirectory, `${newDirectory}2`);
            expect(fs.existsSync(`${newDirectory}2`)).toBe(true);
            expect(fs.existsSync(`${newDirectory}2/file.txt`)).toBe(true);
        });

        it("copySync to subdirectory of source should trigger error", () => {
            const newDirectory = getNewPath("newFolder");
            fs.mkdirSync(newDirectory);
            const errorFn = vi.fn();
            FileKit.copySync(newDirectory, `${newDirectory}/folder2`, { onError: errorFn });
            expect(errorFn).toHaveBeenCalled();
            expect(fs.existsSync(`${newDirectory}/folder2`)).toBe(false);
        });

        it("copySync to itself should trigger error", () => {
            const newDirectory = getNewPath("newFolder");
            fs.mkdirSync(newDirectory);
            const errorFn = vi.fn();
            FileKit.copySync(newDirectory, newDirectory, { onError: errorFn });
            expect(errorFn).toHaveBeenCalled();
        });
    });

    describe("copy directory", () => {
        it("copy basic", async () => {
            FileKit.writeFileSync(defaultFileName, content);
            const newFileName = getNewPath("file2.txt");
            await FileKit.copy(defaultFileName, newFileName);
            expect(fs.existsSync(newFileName)).toBe(true);
        });

        it("copy to non-existing directory should create directory", async () => {
            fs.writeFileSync(defaultFileName, content);
            const newFileName = getNewPath("folder/file2.txt");
            await FileKit.copy(defaultFileName, newFileName);
            expect(fs.existsSync(newFileName)).toBe(true);
            expect(fs.readFileSync(newFileName, "utf8")).toBe(content);
        });

        it("copy from non-existing file should trigger error", async () => {
            const errorFn = vi.fn();
            await FileKit.copy(defaultFileName, "file2.txt", { onError: errorFn });
            expect(errorFn).toHaveBeenCalled();
        });

        it("copy from non-existing directory should trigger error", async () => {
            const errorFn = vi.fn();
            await FileKit.copy("folder/file.txt", "file2.txt", { onError: errorFn });
            expect(errorFn).toHaveBeenCalled();
        });

        it("copy to existing file should overwrite it", async () => {
            fs.writeFileSync(defaultFileName, content);
            const newFileName = getNewPath("file2.txt");
            fs.writeFileSync(newFileName, "Hello world 2!");
            await FileKit.copy(defaultFileName, newFileName);
            expect(fs.readFileSync(newFileName, "utf8")).toBe(content);
        });

        it("copy to subdirectory of source should trigger error", async () => {
            const newDirectory = getNewPath("newFolder");
            fs.mkdirSync(newDirectory);
            const errorFn = vi.fn();
            await FileKit.copy(newDirectory, `${newDirectory}/folder2`, { onError: errorFn });
            expect(errorFn).toHaveBeenCalled();
            expect(fs.existsSync(`${newDirectory}/folder2`)).toBe(false);
        });

        it("copy to itself should trigger error", async () => {
            const newDirectory = getNewPath("newFolder");
            fs.mkdirSync(newDirectory);
            const errorFn = vi.fn();
            await FileKit.copy(newDirectory, newDirectory, { onError: errorFn });
            expect(errorFn).toHaveBeenCalled();
        });
    });

    describe("moveSync", () => {
        it("moveSync basic", () => {
            FileKit.writeFileSync(defaultFileName, content);
            const newFileName = getNewPath("file2.txt");
            FileKit.moveSync(defaultFileName, newFileName);
            expect(fs.existsSync(newFileName)).toBe(true);
            expect(fs.existsSync(defaultFileName)).toBe(false);
        });

        it("moveSync to non-existing directory should create directory", () => {
            fs.writeFileSync(defaultFileName, content);
            const newFileName = getNewPath("folder/file2.txt");
            FileKit.moveSync(defaultFileName, newFileName);
            expect(fs.existsSync(newFileName)).toBe(true);
            expect(fs.existsSync(defaultFileName)).toBe(false);
        });

        it("moveSync from non-existing file should trigger error", () => {
            const errorFn = vi.fn();
            FileKit.moveSync(defaultFileName, "file2.txt", { onError: errorFn });
            expect(errorFn).toHaveBeenCalled();
        });

        it("moveSync from non-existing directory should trigger error", () => {
            const errorFn = vi.fn();
            FileKit.moveSync("folder/file.txt", "file2.txt", { onError: errorFn });
            expect(errorFn).toHaveBeenCalled();
        });

        it("moveSync to existing file should overwrite it", () => {
            fs.writeFileSync(defaultFileName, content);
            const newFileName = getNewPath("file2.txt");
            FileKit.writeFileSync(newFileName, "Hello world 2!");
            FileKit.moveSync(defaultFileName, newFileName);
            expect(fs.readFileSync(newFileName, "utf8")).toBe(content);
        });

        it("moveSync directory", () => {
            const source = getNewPath("newFolder");
            FileKit.writeFileSync(`${source}/file.txt`, content);
            const dest = getNewPath("destFolder");
            FileKit.moveSync(source, dest);
            expect(fs.existsSync(source)).toBe(false);
            expect(fs.existsSync(`${dest}/file.txt`)).toBe(true);
            expect(fs.readFileSync(`${dest}/file.txt`, "utf8")).toBe(content);
        });
    });

    describe("move", () => {
        it("move basic", async () => {
            FileKit.writeFileSync(defaultFileName, content);
            const newFileName = getNewPath("file2.txt");
            await FileKit.move(defaultFileName, newFileName);
            expect(fs.existsSync(newFileName)).toBe(true);
            expect(fs.existsSync(defaultFileName)).toBe(false);
        });

        it("move to non-existing directory should create directory", async () => {
            fs.writeFileSync(defaultFileName, content);
            const newFileName = getNewPath("folder/file2.txt");
            await FileKit.move(defaultFileName, newFileName);
            expect(fs.existsSync(newFileName)).toBe(true);
            expect(fs.existsSync(defaultFileName)).toBe(false);
        });

        it("move from non-existing file should trigger error", async () => {
            const errorFn = vi.fn();
            await FileKit.move(defaultFileName, "file2.txt", { onError: errorFn });
            expect(errorFn).toHaveBeenCalled();
        });

        it("move from non-existing directory should trigger error", async () => {
            const errorFn = vi.fn();
            await FileKit.move("folder/file.txt", "file2.txt", { onError: errorFn });
            expect(errorFn).toHaveBeenCalled();
        });

        it("move to existing file should overwrite it", async () => {
            fs.writeFileSync(defaultFileName, content);
            const newFileName = getNewPath("file2.txt");
            FileKit.writeFileSync(newFileName, "Hello world 2!");
            await FileKit.move(defaultFileName, newFileName);
            expect(fs.readFileSync(newFileName, "utf8")).toBe(content);
        });

        it("move directory", async () => {
            const source = getNewPath("newFolder");
            FileKit.writeFileSync(`${source}/file.txt`, content);
            const dest = getNewPath("destFolder");
            await FileKit.move(source, dest);
            expect(fs.existsSync(source)).toBe(false);
            expect(fs.existsSync(`${dest}/file.txt`)).toBe(true);
            expect(fs.readFileSync(`${dest}/file.txt`, "utf8")).toBe(content);
        });
    });
});
