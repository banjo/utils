/**
 * Tools for CLI applications, mostly wrappers around other neat tools.
 */

const importOra = () => {
    const ora = require("ora");
    return ora;
};

type Options = {
    spinner?: SpinnerName;
    color?: Color;
};

/**
 * Create a spinner in a CLI application. The spinner is returned as an object. Wrapper around the `ora` package.
 * @param text - The text to display.
 * @param options - The options to use.
 * @returns The spinner object.
 * @example
 * const spinner = spinner("Hello world");
 *
 * // set to success
 * spinner.succeed("Done!");
 *
 * // set to fail
 * spinner.fail("Failed!");
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
        spinner: "dots",
        color: "cyan",
    }
) => {
    const ora = importOra();
    const spinner = ora({
        text,
        spinner: options.spinner,
        color: options.color,
    }).start();

    return {
        succeed: (text: string) => {
            spinner.succeed(text);
        },
        setColor: (color: Color) => {
            spinner.color = color;
        },
        setText: (text: string) => {
            spinner.text = text;
        },
        fail: (text: string) => {
            spinner.fail(text);
        },
        stop: () => {
            spinner.stop();
        },
    };
};
