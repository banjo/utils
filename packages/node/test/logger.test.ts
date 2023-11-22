import consola from "consola";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { FileKit, Logger } from "../src";

describe("logger", () => {
    const testDirectory = "./tests-logger-folder-name";
    const getNewPath = (fileName: string) => `${testDirectory}/${fileName}`;
    const currentTime = new Date("2023-01-01T00:00:00.000Z");

    beforeAll(() => {
        vi.useFakeTimers();
        vi.setSystemTime(currentTime);

        consola.wrapAll();
    });

    afterAll(() => {
        Logger.setLoggerConfig({ logFile: undefined });
        vi.useRealTimers();
    });

    beforeEach(() => {
        FileKit.createDirectory(testDirectory);
        consola.mockTypes(() => vi.fn());
    });

    afterEach(() => {
        FileKit.deleteDirectory(testDirectory);
    });

    it("should save log to file", () => {
        const fileName = getNewPath("log.txt");
        Logger.setLoggerConfig({ logFile: fileName });
        Logger.log("test");
        const fileContent = FileKit.readFile(fileName);
        expect(fileContent).toBe(`[LOG] 2023-01-01T00-00-00.000Z: test\n`);
    });

    it("should save success to file", () => {
        const fileName = getNewPath("log.txt");
        Logger.setLoggerConfig({ logFile: fileName });
        Logger.success("test");
        const fileContent = FileKit.readFile(fileName);
        expect(fileContent).toBe(`[SUCCESS] 2023-01-01T00-00-00.000Z: test\n`);
    });

    it("should save debug to file", () => {
        const fileName = getNewPath("log.txt");
        Logger.setLoggerConfig({ logFile: fileName });
        Logger.debug("test");
        const fileContent = FileKit.readFile(fileName);
        expect(fileContent).toBe(`[DEBUG] 2023-01-01T00-00-00.000Z: test\n`);
    });

    it("should save info to file", () => {
        const fileName = getNewPath("log.txt");
        Logger.setLoggerConfig({ logFile: fileName });
        Logger.info("test");
        const fileContent = FileKit.readFile(fileName);
        expect(fileContent).toBe(`[INFO] 2023-01-01T00-00-00.000Z: test\n`);
    });

    it("should save warning to file", () => {
        const fileName = getNewPath("log.txt");
        Logger.setLoggerConfig({ logFile: fileName });
        Logger.warning("test");
        const fileContent = FileKit.readFile(fileName);
        expect(fileContent).toBe(`[WARNING] 2023-01-01T00-00-00.000Z: test\n`);
    });

    it("should save error to file", () => {
        const fileName = getNewPath("log.txt");
        Logger.setLoggerConfig({ logFile: fileName });
        Logger.error("test");
        const fileContent = FileKit.readFile(fileName);
        expect(fileContent).toBe(`[ERROR] 2023-01-01T00-00-00.000Z: test\n`);
    });

    it("should save multiple logs to file", () => {
        const fileName = getNewPath("log.txt");
        Logger.setLoggerConfig({ logFile: fileName });
        Logger.log("test");
        Logger.success("test");
        Logger.debug("test");
        Logger.info("test");
        Logger.warning("test");
        Logger.error("test");
        const fileContent = FileKit.readFile(fileName);
        expect(fileContent).toBe(
            `[LOG] 2023-01-01T00-00-00.000Z: test\n` +
                `[SUCCESS] 2023-01-01T00-00-00.000Z: test\n` +
                `[DEBUG] 2023-01-01T00-00-00.000Z: test\n` +
                `[INFO] 2023-01-01T00-00-00.000Z: test\n` +
                `[WARNING] 2023-01-01T00-00-00.000Z: test\n` +
                `[ERROR] 2023-01-01T00-00-00.000Z: test\n`
        );
    });
});
