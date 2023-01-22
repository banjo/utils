import { nodeResolve } from "@rollup/plugin-node-resolve";
import ts from "rollup-plugin-ts";

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
        plugins: [nodeResolve(), ts()],
    },
];
