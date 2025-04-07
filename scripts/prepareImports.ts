import fs from "fs";
import { format, getDirectory, getUtilFiles } from "./utils";

const main = async () => {
    console.log(`Preparing imports...\n`);
    const files = getUtilFiles();
    const { indexFile } = getDirectory();

    const exportStatements = files
        .map(file => {
            return `export * from "./utils/${file.fileName}";`;
        })
        .join("\n");

    console.log(`Writing to ${indexFile}...\n`);

    const formatted = await format(exportStatements, indexFile);
    fs.writeFileSync(indexFile, formatted);
};

main();
