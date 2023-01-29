import fs from "fs";
import { getUtilFiles, srcIndexFile, srcBrowserIndexFile } from "./utils";

const main = () => {
    const files = getUtilFiles();

    const exportStatements = files
        .filter((file) => !file.fileName.includes("node"))
        .map((file) => {
            return `export * from "./utils/${file.fileName}";`;
        })
        .join("\n");

    fs.writeFileSync(srcIndexFile, exportStatements);
};

main();
