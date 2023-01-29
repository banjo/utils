import { nodeResolve } from "@rollup/plugin-node-resolve";
import ts from "rollup-plugin-ts";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import esbuild from "rollup-plugin-esbuild";

const plugins = [
    nodeResolve(),
    commonjs({
        requireReturnsDefault: "auto",
        defaultIsModuleExports: true,
    }),
    json(),
    ts(),
    esbuild({ minify: true, treeShaking: true }),
];

export default [
    {
        input: "src/index.ts",
        output: [
            {
                file: "dist/index.cjs",
                format: "cjs",
            },
            {
                file: "dist/index.mjs",
                format: "esm",
            },
        ],
        plugins,
    },
];
