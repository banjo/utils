/**
 * Tools for CLI applications, mostly wrappers around other neat tools.
 */

import { createSpinner } from "nanospinner";

type Color =
    | "black"
    | "red"
    | "green"
    | "yellow"
    | "blue"
    | "magenta"
    | "cyan"
    | "white"
    | "gray";

type Options = {
    color?: Color;
};

type ParameterOptions = {
    text: string;
    mark: string;
    color: Color;
};

/**
 * Create a spinner in a CLI application. The spinner is returned as an object. Wrapper around the `nanospinner` package.
 * @param text - The text to display.
 * @param options - The options to use.
 * @returns The spinner object.
 * @example
 * const spinner = spinner("Hello world");
 *
 * // set to success
 * spinner.succeed({ text: "Success!"});
 *
 * // can modify mark and color
 * spinner.succeed({ text: "Success!", mark: "✔", color: "green" }});
 *
 * // set to fail
 * spinner.fail({ text: "Failed!"});
 *
 * // set the color
 * spinner.setColor("yellow");
 *
 * // set the text
 * spinner.setText("Hello world");
 *
 * // stop the spinner
 * spinner.stop();
 */
export const spinner = (
    text: string,
    options: Options = {
        color: "cyan",
    }
) => {
    const spinner = createSpinner().start({ text: text, color: options.color });

    return {
        succeed: (options: ParameterOptions) => {
            spinner.success(options);
        },
        setColor: (color: Color) => {
            spinner.update({ color: color });
        },
        setText: (text: string) => {
            spinner.update({ text: text });
        },
        fail: (options: ParameterOptions) => {
            spinner.error(options);
        },
        warn: (options: ParameterOptions) => {
            spinner.warn(options);
        },
        clear: () => {
            spinner.clear();
        },
        reset: () => {
            spinner.reset();
        },
        stop: (options: ParameterOptions) => {
            spinner.stop(options);
        },
    };
};
