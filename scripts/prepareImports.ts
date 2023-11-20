import fs from "fs";
import { TYPES, Type, getDirectories, getUtilFiles } from "./utils";

const main = (type: Type) => {
    const files = getUtilFiles(type);
    const { indexFile } = getDirectories(type);

    const exportStatements = files
        .filter(file => !file.fileName.includes("node"))
        .map(file => {
            return `export * from "./utils/${file.fileName}";`;
        })
        .join("\n");

    fs.writeFileSync(indexFile, exportStatements);
};

TYPES.forEach(type => {
    main(type);
});
