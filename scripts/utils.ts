import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

export const srcDir = path.join(__dirname, "../src");
export const srcUtilsDir = path.join(srcDir, "utils");
export const srcIndexFile = path.join(srcDir, "index.ts");
export const srcBrowserIndexFile = path.join(srcDir, "index.browser.ts");

export function getUtilFiles() {
    const utilFiles = fs.readdirSync(srcUtilsDir);

    return utilFiles.map((file: string) => {
        const fileName = file.replace(".ts", "");
        const content = fs.readFileSync(
            path.join(srcUtilsDir, `${fileName}.ts`),
            "utf8"
        );

        return {
            fileName,
            content,
        };
    });
}
