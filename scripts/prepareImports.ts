import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, "../src");
const srcUtilsDir = path.join(srcDir, "utils");
const srcIndexFile = path.join(srcDir, "index.ts");

const main = () => {
    const utilFiles = fs.readdirSync(srcUtilsDir);
    const utilFilesWithoutExt = utilFiles.map((file: any) => {
        return file.replace(".ts", "");
    });

    const exportStatements = utilFilesWithoutExt.map((file: any) => {
        return `export * from "./utils/${file}";`;
    });

    const exportStatementsString = exportStatements.join("\n");

    fs.writeFileSync(srcIndexFile, exportStatementsString);
};

main();
