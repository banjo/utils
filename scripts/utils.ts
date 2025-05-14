// @ts-ignore
import options from "@banjoanton/prettier-config";
import fs from "fs";
import path from "path";
import prettier from "prettier";
import { attempt } from "src/utils/test";
import { fileURLToPath } from "url";

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

export const getDirectory = () => {
    const packageDirectory = path.join(__dirname, "../");
    const srcDir = path.join(packageDirectory, "src");

    return {
        srcDir: srcDir,
        utilsDir: path.join(srcDir, "utils"),
        indexFile: path.join(srcDir, "index.ts"),
        readmeFile: path.join(packageDirectory, "README.md"),
    };
};

export const getUtilFiles = () => {
    const { utilsDir } = getDirectory();
    const fallbackValue: string[] = [];
    const utilFiles = attempt(() => fs.readdirSync(utilsDir), { fallbackValue });

    return utilFiles.map((file: string) => {
        const fileName = file.replace(".ts", "");
        const content = fs.readFileSync(path.join(utilsDir, `${fileName}.ts`), "utf8");

        return {
            fileName,
            content,
        };
    });
};

export const format = (text: string, filePath: string) => {
    return prettier.format(text, { ...options, filepath: filePath });
};
