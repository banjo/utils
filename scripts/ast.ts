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
                fns.push({ name: `${name}.${variableName}`, comment });
            },
            ExportNamedDeclaration(path: any) {
                if (path.node.declaration?.type === "FunctionDeclaration") {
                    const fnName = path.node.declaration.id?.name;
                    if (!fnName || !names.includes(fnName)) return;

                    const leadingComments: any[] = path.node.leadingComments;
                    if (!leadingComments) return;

                    shouldShowWrapperObject = false;
                    const comment = getComment(leadingComments);
                    fns.push({ name: `${name}.${fnName}`, comment });
                } else if (path.node.declaration?.type === "VariableDeclaration") {
                    const varName = path.node.declaration.declarations[0]?.id?.name;
                    if (!varName || !names.includes(varName)) return;

                    const leadingComments: any[] = path.node.leadingComments;
                    if (!leadingComments) return;

                    shouldShowWrapperObject = false;
                    const comment = getComment(leadingComments);
                    fns.push({ name: `${name}.${varName}`, comment });
                }
            },
        });
    }

    if (shouldShowWrapperObject) {
        const comment = getComment(leadingComments);
        fns.push({ name, comment });
    }

    return fns;
};

/**
 * Mapping from interface name to the prefix used in docs.
 * Add entries here to include other interfaces in generated docs.
 */
const INTERFACE_DOC_PREFIX: Record<string, string> = {
    GenericMethods: "result",
};

const parseInterfaceMembers = (node: any, prefix: string): ParsedAst[] => {
    const members: ParsedAst[] = [];
    const body = node.body?.body ?? [];

    for (const member of body) {
        const name = member.key?.name;
        if (!name) continue;

        const leadingComments: any[] = member.leadingComments;
        if (!leadingComments || leadingComments.length === 0) continue;

        const comment = getComment(leadingComments);
        members.push({ name: `${prefix}.${name}`, comment });
    }

    return members;
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
            TSInterfaceDeclaration(path: any) {
                const interfaceName = path.node.id?.name;
                const prefix = INTERFACE_DOC_PREFIX[interfaceName];
                if (!prefix) return;

                const members = parseInterfaceMembers(path.node, prefix);
                fns.push(...members);
            },
        });

        // Remove standalone entries that were already claimed by a prefixed object export
        // e.g. if "Result.ok" exists, remove the standalone "ok" entry
        const prefixedNames = new Set(
            fns.filter(fn => fn.name.includes(".")).map(fn => fn.name.split(".")[1])
        );
        const filtered = fns.filter(fn => {
            if (fn.name.includes(".")) return true;
            return !prefixedNames.has(fn.name);
        });

        const jsDocsParsed = filtered.map(fn => {
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
