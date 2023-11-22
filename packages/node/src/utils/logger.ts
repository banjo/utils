import consola from "consola";
import { defaults } from "packages/utils/src";
import pc from "picocolors";
import { FileKit } from "./file";

/**
 * A simple logger that logs to the console and optionally to a file. Based on consola. Should mainly be used for CLI tools.
 */

type Type = "error" | "warning" | "info" | "success" | "debug" | "log";

type LoggerConfig = {
    /**
     * Whether to log debug messages. Defaults to false.
     * @default false
     */
    debug: boolean;

    /**
     * A filepath to save logs to. If undefined, logs will not be saved to a file.
     */
    logFile?: string;

    /**
     * File log handler. A callback to handle how the file logging is structured. Should return a string. Defaults to [<type>] <date>: <message>.
     */
    fileLogHandler?: (message: string, type: Type) => string;
};

const LOGGER_CONFIG: LoggerConfig = {
    debug: false,
    logFile: undefined,
};

const concatenateMessages = (message: string, ...optionalParams: unknown[]) => {
    const messages = [message, ...optionalParams].map(m => {
        if (typeof m === "object") return JSON.stringify(m);
        return m;
    });

    return messages.join("\n");
};

const setLoggerConfig = (config: Partial<LoggerConfig>) => {
    const updatedConfig = defaults(config, LOGGER_CONFIG);
    LOGGER_CONFIG.debug = updatedConfig.debug;
    LOGGER_CONFIG.logFile = updatedConfig.logFile;
    LOGGER_CONFIG.fileLogHandler = updatedConfig.fileLogHandler;
};

const error = (message: string, ...optionalParams: unknown[]) => {
    consola.error(message, ...optionalParams);

    const allMessages = concatenateMessages(message, ...optionalParams);

    saveToFile(allMessages, "error");
};

const warning = (message: string, ...optionalParams: unknown[]) => {
    consola.warn(message, ...optionalParams);

    const allMessages = concatenateMessages(message, ...optionalParams);
    saveToFile(allMessages, "warning");
};
const info = (message: string, ...optionalParams: unknown[]) => {
    consola.info(message, ...optionalParams);

    const allMessages = concatenateMessages(message, ...optionalParams);
    saveToFile(allMessages, "info");
};

const success = (message: string, ...optionalParams: unknown[]) => {
    consola.success(message, ...optionalParams);

    const allMessages = concatenateMessages(message, ...optionalParams);
    saveToFile(allMessages, "success");
};

const log = (message: string, ...optionalParams: unknown[]) => {
    consola.log(message, ...optionalParams);

    const allMessages = concatenateMessages(message, ...optionalParams);
    saveToFile(allMessages, "log");
};

const saveToFile = (message: unknown, type: Type) => {
    const logFile = LOGGER_CONFIG.logFile;
    if (!logFile) return;

    if (LOGGER_CONFIG.fileLogHandler) {
        const formattedMessage = LOGGER_CONFIG.fileLogHandler(message as string, type);
        FileKit.appendFile(logFile, formattedMessage);
        return;
    }

    const formattedLogDate = new Date().toISOString().replace(/:/g, "-");
    const formattedMessage = `[${type.toUpperCase()}] ${formattedLogDate}: ${message}\n`;

    FileKit.appendFile(logFile, formattedMessage);
};

const debug = (message: string | unknown) => {
    saveToFile(message, "debug");
    if (!LOGGER_CONFIG.debug) return;

    if (typeof message === "string") {
        consola.log(`🔍 ${pc.dim(message)}`);
    } else {
        consola.log(message);
    }
};

/**
 * A simple logger with styled output. Support for debug mode, file logging, and more.
 * @example
 * // Log to console
 * Logger.debug("Hello world!");
 * Logger.log("Hello world!");
 * Logger.info("Hello world!");
 * Logger.success("Hello world!");
 * Logger.warning("Hello world!");
 * Logger.error("Hello world!");
 *
 * // Configure logger
 * Logger.setLoggerConfig({ debug: true });
 *
 * // Log to file
 * Logger.setLoggerConfig({ logFile: "logs.txt" });
 *
 */
export const Logger = {
    error,
    warning,
    info,
    success,
    debug,
    log,
    setLoggerConfig,
};
