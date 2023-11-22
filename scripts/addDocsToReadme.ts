import { readFileSync, writeFileSync } from "node:fs";
import { capitalize, objectEntries } from "../packages/utils/src/index";
import { astParseFiles } from "./ast";
import { TYPES, Type, format, getDirectories, getUtilFiles } from "./utils";

const TS_DOCS_REGEX = /\/\*\*[\s\S]*?\*\//g;

TYPES.forEach(type => {
    main(type);
});

async function main(type: Type) {
    console.log(`Adding docs to ${type}...\n`);
    const files = getUtilFiles(type);
    const directories = getDirectories(type);

    const fileOutput = astParseFiles(files);
    const docs = parseDocs(fileOutput);

    const readme = readFileSync(directories.readmeFile, "utf8");
    if (!readme) throw new Error("No readme found");

    const placeholder = readme.match(/<!-- DOCS START -->[\s\S]*<!-- DOCS END -->/)?.[0];
    if (!placeholder) throw new Error("No placeholder found");

    const docsWithContent = generateContentForEachDoc(docs);

    const toc = createToc(docsWithContent);
    const markdown = generateMarkdown(docsWithContent, toc);
    const newReadme = readme.replace(placeholder, markdown);
    const formatted = await format(newReadme, directories.readmeFile);

    writeFileSync(directories.readmeFile, formatted);
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
    example?: string;
    params: Param[];
    returns?: string;
};

type DocsWithContent = Docs & { content: string };

function parseDocs(comments: ParsedAstOutput[]) {
    let docs: Docs[] = [];
    comments.forEach(c => {
        const fileName = c.file;

        c.comments.forEach(comment => {
            const description = comment.comment.description;
            const params = comment.comment.tags.filter((t: any) => t.title === "param");
            const returns = comment.comment.tags.find((t: any) => t.title === "returns");
            const example = comment.comment.tags.find((t: any) => t.title === "example");
            const name = comment.name;

            docs.push({
                description,
                params: params.map(p => ({
                    name: p.name ?? "",
                    description: p.description ?? "",
                })),
                example: example?.description ?? undefined,
                name,
                returns: returns?.description ?? undefined,
                fileName,
                fileContent: c.content,
            });
        });
    });

    return docs;
}

function createToc(docs: Docs[]) {
    let previousFileName = "";

    const createCategory = (doc: Docs) => `-  [${capitalize(doc.fileName)}](#${doc.fileName})\n`;
    const createUnit = (doc: Docs) => `\t* [${doc.name}](#${doc.name})\n`;

    const toc = docs.map(doc => {
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

        const fileDesc = (<DocsWithContent[]>docs)?.[0].fileContent.match(TS_DOCS_REGEX)?.[0];

        if (fileDesc) {
            markdown += cleanComment(fileDesc) + "\n\n---\n";
        }

        (<DocsWithContent[]>docs).forEach(doc => {
            markdown += doc.content;
        });
    });

    return addPlaceholders(markdown);
}

function generateContentForEachDoc(docs: Docs[]) {
    const content: DocsWithContent[] = docs.map(doc => {
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
    return comment.replace("/**", "").replace("*/", "").replaceAll(" * ", "").trim();
}
