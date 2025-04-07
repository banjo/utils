// @ts-ignore
import babel from "@babel/core";
import doctrine from "doctrine";
import { last } from "src/utils/array";

export type ParsedAst = { name: string; comment: string };
export type ParsedAstOutput = {
    file: string;
    comments: {
        comment: doctrine.Annotation;
        name: string;
    }[];
    content: string;
};

const getComment = (leadingComments: any[]) => {
    const comment =
        leadingComments.length > 1 ? last(leadingComments)?.value : leadingComments[0]?.value ?? "";

    return comment;
};

const parseFunctionDeclaration = (path: any) => {
    const fns: ParsedAst[] = [];

    const name = path.node.declaration.id!.name;
    const leadingComments: any[] = path.node.leadingComments;
    if (leadingComments) {
        const comment =
            leadingComments.length > 1 ? last(leadingComments)?.value : leadingComments[0].value;

        fns.push({ name, comment });
        return fns;
    }

    // might have leading comments on another TSDeclareFunction (range, template, etc)
    const exportNamedDeclarations: any[] = path.parent.body.filter(
        (node: any) => node.type === "ExportNamedDeclaration"
    );

    const hasTsDeclareFunction = exportNamedDeclarations.filter(
        d => d.declaration?.type === "TSDeclareFunction"
    );

    const matchingDeclareFunctions = hasTsDeclareFunction.filter(
        (node: any) => node.declaration.id.name === name
    );

    if (matchingDeclareFunctions.length === 0) {
        console.log("no matching declare function for " + name);
        return [];
    }

    matchingDeclareFunctions.forEach(node => {
        const leadingComments: any[] = node.leadingComments;
        if (!leadingComments) return;

        const comment =
            leadingComments.length > 1 ? last(leadingComments)?.value : leadingComments[0].value;

        fns.push({ name, comment });
    });
    return fns;
};

const parseVariableDeclaration = (path: any, ast: any) => {
    const fns: ParsedAst[] = [];

    const name = path.node.declaration.declarations[0].id.name;
    const leadingComments: any[] = path.node.leadingComments;
    if (!leadingComments) return [];

    const isObjectWithProperties =
        path.node.declaration.declarations[0].init.type === "ObjectExpression" &&
        path.node.declaration.declarations[0].init.properties.length > 1;

    let shouldShowWrapperObject = true;
    if (isObjectWithProperties) {
        const properties = path.node.declaration.declarations[0].init.properties;
        const names = properties.map((p: any) => p.key.name);

        babel.traverse(ast!, {
            VariableDeclarator(path: any) {
                const variableName = path.node.id.name;
                if (!names.includes(variableName)) return;

                const leadingComments: any[] = path.parent.leadingComments;
                if (!leadingComments) return;

                shouldShowWrapperObject = false;
                const comment = getComment(leadingComments);
                fns.push({ name: variableName, comment });
            },
        });
    }

    if (shouldShowWrapperObject) {
        const comment = getComment(leadingComments);
        fns.push({ name, comment });
    }

    return fns;
};

export const astParseFiles = (
    files: { content: string; fileName: string }[]
): ParsedAstOutput[] => {
    const parsedComments = files.map(file => {
        const ast = babel.parseSync(file.content, {
            sourceType: "module",
            plugins: ["@babel/plugin-transform-typescript"],
        });

        const fns: ParsedAst[] = [];

        babel.traverse(ast!, {
            ExportNamedDeclaration(path: any) {
                if (path.node.declaration?.type === "FunctionDeclaration") {
                    const functionDeclarations = parseFunctionDeclaration(path);
                    fns.push(...functionDeclarations);
                } else if (path.node.declaration?.type === "VariableDeclaration") {
                    const variableDeclarations = parseVariableDeclaration(path, ast);
                    fns.push(...variableDeclarations);
                }
            },
        });

        const jsDocsParsed = fns.map(fn => {
            const parsed = doctrine.parse(fn.comment, { unwrap: true });

            return {
                ...fn,
                comment: parsed,
            };
        });

        return { file: file.fileName, comments: jsDocsParsed, content: file.content };
    });

    return parsedComments;
};
