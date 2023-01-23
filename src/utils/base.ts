/**
 * Sleep for a given amount of time.
 * @param ms - The amount of time to sleep, in milliseconds. Defaults to 0.
 * @example
 * await sleep(1000); // sleep for 1 second
 * await sleep(); // sleep for 0 milliseconds
 */
export const sleep = (ms: number = 0): Promise<void> =>
    new Promise((resolve) => setTimeout(resolve, ms));
