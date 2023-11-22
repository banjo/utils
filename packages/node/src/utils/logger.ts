import consola from "consola";
import { defaults } from "packages/utils/src";
import pc from "picocolors";
import { FileKit } from "./file";

/**
 * A simple logger that logs to the console and optionally to a file. Based on consola. Should mainly be used for CLI tools.
 */

type LoggerConfig = {
    /**
     * Whether to log debug messages.
     * @default false
     */
    debug: boolean;

    /**
     * A filepath to save logs to.
     * @default "logs.txt"
     */
    logFile?: string;
};

const LOGGER_CONFIG: LoggerConfig = {
    debug: false,
    logFile: undefined,
};

const LOGGER_CONFIG_DEFAULTS = {
    debug: false,
    logFile: "logs.txt",
};

const setLoggerConfig = (config: Partial<LoggerConfig>) => defaults(config, LOGGER_CONFIG_DEFAULTS);

const error = (message: string, ...optionalParams: unknown[]) =>
    consola.error(message, ...optionalParams);

const warning = (message: string, ...optionalParams: unknown[]) =>
    consola.warn(message, ...optionalParams);

const info = (message: string, ...optionalParams: unknown[]) =>
    consola.info(message, ...optionalParams);

const success = (message: string, ...optionalParams: unknown[]) =>
    consola.success(message, ...optionalParams);

const log = (message: string, ...optionalParams: unknown[]) =>
    consola.log(message, ...optionalParams);

const saveToFile = (message: unknown) => {
    const logFile = LOGGER_CONFIG.logFile;
    if (!logFile) return;

    const formattedLogDate = new Date().toISOString().replace(/:/g, "-");
    const formattedMessage = `${formattedLogDate} ${message}\n`;

    FileKit.appendFile(logFile, formattedMessage);
};

const debug = (message: string | unknown) => {
    if (!LOGGER_CONFIG.debug) return;

    if (typeof message === "string") {
        consola.log(`🔍 ${pc.dim(message)}`);
    } else {
        consola.log(message);
    }

    saveToFile(message);
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
