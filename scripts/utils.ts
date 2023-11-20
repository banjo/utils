import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

export const TYPES = ["utils", "node"] as const;
export type Type = (typeof TYPES)[number];

const typeData: Record<Type, { dir: string }> = {
    utils: {
        dir: "../packages/utils/src",
    },
    node: {
        dir: "../packages/node/src",
    },
};

export const getDirectories = (type: Type) => {
    const { dir } = typeData[type];

    return {
        srcDir: path.join(__dirname, dir),
        utilsDir: path.join(__dirname, dir, "utils"),
        indexFile: path.join(__dirname, dir, "index.ts"),
        readmeFile: path.join(__dirname, dir, "README.md"),
    };
};

export function getUtilFiles(type: Type) {
    const { utilsDir } = getDirectories(type);
    const utilFiles = fs.readdirSync(utilsDir);

    return utilFiles.map((file: string) => {
        const fileName = file.replace(".ts", "");
        const content = fs.readFileSync(path.join(utilsDir, `${fileName}.ts`), "utf8");

        return {
            fileName,
            content,
        };
    });
}
