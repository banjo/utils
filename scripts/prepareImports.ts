import fs from "fs";
import { TYPES, Type, format, getDirectories, getUtilFiles } from "./utils";

const main = async (type: Type) => {
    console.log(`Preparing imports for ${type}...`);
    const files = getUtilFiles(type);
    const { indexFile } = getDirectories(type);

    const exportStatements = files
        .filter(file => !file.fileName.includes("node"))
        .map(file => {
            return `export * from "./utils/${file.fileName}";`;
        })
        .join("\n");

    console.log(`Writing to ${indexFile}...\n`);

    const formatted = await format(exportStatements, indexFile);
    fs.writeFileSync(indexFile, formatted);
};

TYPES.forEach(type => {
    main(type);
});
