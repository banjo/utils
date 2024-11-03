// @ts-ignore
import options from "@banjoanton/prettier-config";
import fs from "fs";
import { attemptSync } from "packages/utils/src";
import path from "path";
import prettier from "prettier";
import { fileURLToPath } from "url";

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

export const TYPES = ["utils", "node"] as const;
export type Type = (typeof TYPES)[number];

const typeData: Record<Type, { dirName: string }> = {
    utils: {
        dirName: "utils",
    },
    node: {
        dirName: "node",
    },
};

export const getDirectories = (type: Type) => {
    const { dirName } = typeData[type];

    const packageDirectory = path.join(__dirname, "../packages", dirName);
    const srcDir = path.join(packageDirectory, "src");

    return {
        srcDir: srcDir,
        utilsDir: path.join(srcDir, "utils"),
        indexFile: path.join(srcDir, "index.ts"),
        readmeFile: path.join(packageDirectory, "README.md"),
    };
};

export const getUtilFiles = (type: Type) => {
    const { utilsDir } = getDirectories(type);
    const fallbackValue: string[] = [];
    const utilFiles = attemptSync(() => fs.readdirSync(utilsDir), { fallbackValue });

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
