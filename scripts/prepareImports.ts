import fs from "fs";
import { getUtilFiles, srcIndexFile } from "./utils";

const main = () => {
    const files = getUtilFiles();

    const exportStatements = files.map((file) => {
        return `export * from "./utils/${file.fileName}";`;
    });

    const exportStatementsString = exportStatements.join("\n");

    fs.writeFileSync(srcIndexFile, exportStatementsString);
};

main();
