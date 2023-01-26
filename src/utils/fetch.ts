/**
 * Utlilties that uses the fetch API to fetch data. Smaller implementations that basically saves time.
 */

type FetchSettings = {
    /**
     * If true, the function will throw an error if the response is not ok. Defaults to false.
     */
    throws?: boolean;
    /**
     * If true, the function will log the response to the console. Defaults to false.
     */
    debug?: boolean;
};

/**
 * Fetches a JSON response from a URL. Returns null if the response is not ok.
 * Can pass normal fetch options as well as custom options for the wrapper.
 * @param url - The URL to fetch.
 * @param options - The options to use.
 * @returns The JSON response or null if the response is not ok.
 * @example
 * await fetchJson("https://example.com/api");
 * await fetchJson("https://example.com/api", { throws: true });
 * await fetchJson("https://example.com/api", { debug: true });
 * await fetchJson("https://example.com/api", { method: "POST"});
 */
export const fetchJson = async <T = any>(
    url: string,
    options: RequestInit & FetchSettings = { throws: false, debug: false }
): Promise<T | null> => {
    try {
        const response = await fetch(url, options).then((res) => res.json());
        return response;
    } catch (error) {
        if (options?.throws) throw error;
        if (options?.debug) console.log(error);
        return null;
    }
};
