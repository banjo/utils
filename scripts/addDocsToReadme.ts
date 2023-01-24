import { writeFileSync } from "fs";
import { readFile } from "./../src/utils/fs";
import { getUtilFiles } from "./utils";

const shouldInclude = ["@returns", "@example"];

main();
function main() {
    const files = getUtilFiles();
    let docs: Docs[] = [];

    for (const f of files) {
        const comments = getAllTsDocsComments(f.content);
        if (!comments) throw new Error(`No comments found in ${f.fileName}`);
        docs = [...docs, ...parseComments(comments, f.fileName)];
    }

    const readme = readFile("./README.md");
    if (!readme) throw new Error("No readme found");

    const placeholder = readme.match(
        /<!-- DOCS START -->[\s\S]*<!-- DOCS END -->/
    );
    if (!placeholder) throw new Error("No placeholder found");

    const generateReadme = generateReadmeContent(docs);

    const newReadme = readme.replace(placeholder[0], generateReadme.join("\n"));

    writeFileSync("./README.md", newReadme);
}

type Param = {
    name: string;
    description: string;
};

type Docs = {
    name: string;
    description: string;
    fileName: string;
    example: string;
    params: Param[];
    returns: string;
};

function generateReadmeContent(docs: Docs[]) {
    const content: string[] = docs.map((doc) => {
        const params = doc.params
            .map((param) => {
                return `| ${param.name} | ${param.description} |`;
            })
            .join("\n");

        return `### ${doc.name}

${doc.description}

\`\`\`ts
${doc.example}
\`\`\`

#### Params

| Name | Description |
| ---- | ----------- |
${params}

---
`;
    });

    content.unshift("<!-- DOCS START -->");
    content.push("<!-- DOCS END -->");

    return content;
}

function parseComments(comments: string[], fileName: string): Docs[] {
    const docs: Docs[] = [];

    for (const comment of comments) {
        const formattedDoc = comment
            .replace("/**", "")
            .replace("*/", "")
            .replaceAll(" * ", "")
            .trim();

        if (!shouldInclude.every((s) => formattedDoc.includes(s))) {
            continue;
        }

        const description = getDescription(formattedDoc);
        const params = getParams(formattedDoc);
        const returns = getReturns(formattedDoc);
        const example = getExample(formattedDoc);

        const functionName = getFunctionName(example);

        docs.push({
            name: functionName,
            description,
            fileName,
            example,
            params,
            returns,
        });
    }

    return docs;
}

function getFunctionName(example: string) {
    const regexForCalledFunction = /.*(?:\);)/g;
    const calledFunctions = example.match(regexForCalledFunction);

    if (!calledFunctions) {
        throw new Error("No function called in example");
    }

    let nameBeforeFunction = calledFunctions[0].split("(")[0];

    // take last word if there are multiple words before function
    if (nameBeforeFunction.split(" ").length > 1) {
        nameBeforeFunction = nameBeforeFunction.split(" ").at(-1)!;
    }

    return nameBeforeFunction;
}
function getExample(doc: string) {
    return doc.split("@example")[1].trim();
}

function getReturns(doc: string) {
    return doc.split("@returns")[1].trim().split("\n")[0].trim();
}

function getParams(doc: string) {
    const params: Param[] = [];
    const lines = doc.split("\n");

    for (const line of lines) {
        if (line.includes("@param")) {
            const name = line.split(" ")[1];
            const description = line.split(/-(.*)/s)[1].trim();

            params.push({ name, description });
        }
    }

    return params;
}

function getDescription(doc: string) {
    return doc.split("@")[0].trim();
}

function getAllTsDocsComments(content: string): string[] | null {
    return content.match(/\/\*\*[\s\S]*?\*\//g);
}
