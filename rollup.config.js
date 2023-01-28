import { nodeResolve } from "@rollup/plugin-node-resolve";
import ts from "rollup-plugin-ts";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import cleanup from "rollup-plugin-cleanup";
import terser from "@rollup/plugin-terser";

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
        plugins: [
            nodeResolve(),
            commonjs({
                requireReturnsDefault: "auto",
                defaultIsModuleExports: true,
            }),
            json(),
            ts(),
            cleanup(),
            terser({ format: { comments: false } }),
        ],
    },
];
