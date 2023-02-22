import { readFileSync, writeFileSync } from "fs";
import { objectEntries } from "../src/utils/object";
import { capitalize } from "../src/utils/string";
import { getUtilFiles } from "./utils";

const shouldInclude = ["@returns", "@example"];
const TS_DOCS_REGEX = /\/\*\*[\s\S]*?\*\//g;

main();
function main() {
    const files = getUtilFiles();
    let docs: Docs[] = [];

    for (const f of files) {
        const comments = getAllTsDocsComments(f.content);
        if (!comments) throw new Error(`No comments found in ${f.fileName}`);
        docs = [...docs, ...parseComments(comments, f)];
    }

    const readme = readFileSync("./README.md", "utf8");
    if (!readme) throw new Error("No readme found");

    const placeholder = readme.match(
        /<!-- DOCS START -->[\s\S]*<!-- DOCS END -->/
    )?.[0];
    if (!placeholder) throw new Error("No placeholder found");

    const docsWithContent = generateContentForEachDoc(docs);

    const toc = createToc(docsWithContent);

    const markdown = generateMarkdown(docsWithContent, toc);

    const newReadme = readme.replace(placeholder, markdown);

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
    fileContent: string;
    example: string;
    params: Param[];
    returns: string;
};

type DocsWithContent = Docs & { content: string };

function createToc(docs: Docs[]) {
    let previousFileName = "";

    const createCategory = (doc: Docs) =>
        `-  [${capitalize(doc.fileName)}](#${doc.fileName})\n`;

    const createUnit = (doc: Docs) => `\t* [${doc.name}](#${doc.name})\n`;

    const toc = docs.map((doc) => {
        if (doc.fileName !== previousFileName) {
            previousFileName = doc.fileName;
            return `${createCategory(doc)}${createUnit(doc)}`;
        } else {
            return createUnit(doc);
        }
    });

    return `### Table of Contents\n\n${toc.join("")}`;
}

function addPlaceholders(content: string) {
    return `<!-- DOCS START -->\n${content}\n<!-- DOCS END -->`;
}

function generateMarkdown(docs: DocsWithContent[], toc: string): string {
    const groupedArray = docs.reduce((acc: any, doc) => {
        if (!acc[doc.fileName]) {
            acc[doc.fileName] = [];
        }

        acc[doc.fileName].push(doc);

        return acc;
    }, {});

    let markdown = toc;
    objectEntries(groupedArray).forEach(([fileName, docs]) => {
        markdown += `### ${capitalize(fileName)}\n\n`;

        const fileDesc = (<DocsWithContent[]>docs)?.[0].fileContent.match(
            TS_DOCS_REGEX
        )?.[0];

        if (fileDesc) {
            markdown += cleanComment(fileDesc) + "\n\n---\n";
        }

        (<DocsWithContent[]>docs).forEach((doc) => {
            markdown += doc.content;
        });
    });

    return addPlaceholders(markdown);
}

function generateContentForEachDoc(docs: Docs[]) {
    const content: DocsWithContent[] = docs.map((doc) => {
        return {
            ...doc,
            content: `#### ${doc.name}

> ${doc.description}

\`\`\`ts
${doc.example}
\`\`\`

---
`,
        };
    });

    return content;
}

function cleanComment(comment: string) {
    return comment
        .replace("/**", "")
        .replace("*/", "")
        .replaceAll(" * ", "")
        .trim();
}

function parseComments(
    comments: string[],
    file: { content: string; fileName: string }
): Docs[] {
    const docs: Docs[] = [];

    for (const comment of comments) {
        const formattedDoc = cleanComment(comment);

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
            fileName: file.fileName.replace("-node", ""),
            example,
            params,
            fileContent: file.content,
            returns,
        });
    }

    return docs;
}

function getFunctionName(example: string) {
    const regexForCalledFunction = /.*(?:\);)/g;
    const calledFunctions = example.match(regexForCalledFunction);

    if (!calledFunctions) {
        throw new Error(`No function called in example`);
    }

    let nameBeforeFunction = calledFunctions[0].split("(")[0];

    // take last word if there are multiple words before function
    if (nameBeforeFunction.split(" ").length > 1) {
        nameBeforeFunction = nameBeforeFunction.split(" ").at(-1)!;
    }

    return nameBeforeFunction;
}
function getExample(doc: string) {
    const example = doc.split("@example")[1].trim();

    let final = "";
    const lines = example.split("\n");
    lines.forEach((line) => {
        if (line.startsWith(" *")) {
            final += line.replace(" *", "").trim() + "\n";
        } else {
            final += line.trim() + "\n";
        }
    });

    return final;
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
    return content.match(TS_DOCS_REGEX);
}
