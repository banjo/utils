import { nodeResolve } from "@rollup/plugin-node-resolve";
import ts from "rollup-plugin-ts";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import cleanup from "rollup-plugin-cleanup";

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
            ts(),
            commonjs({
                requireReturnsDefault: "auto",
                defaultIsModuleExports: true,
            }),
            json(),
            cleanup(),
        ],
    },
];
