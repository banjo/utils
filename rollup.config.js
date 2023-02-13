import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import dts from "rollup-plugin-dts";
import esbuild from "rollup-plugin-esbuild";

const entries = ["src/index.ts"];

const plugins = [
    resolve({
        preferBuiltins: true,
    }),
    json(),
    commonjs(),
    esbuild({
        target: "node16",
        minify: true,
    }),
];

export default [
    ...entries.map((input) => ({
        input,
        output: [
            {
                file: input.replace("src/", "dist/").replace(".ts", ".mjs"),
                format: "esm",
                sourcemap: true,
            },
            {
                file: input.replace("src/", "dist/").replace(".ts", ".cjs"),
                format: "cjs",
                sourcemap: true,
            },
        ],
        external: [],
        plugins,
    })),
    ...entries.map((input) => ({
        input,
        output: {
            file: input.replace("src/", "dist/").replace(".ts", ".d.ts"),
            format: "esm",
        },
        external: [],
        plugins: [dts({ respectExternal: true })],
    })),
];

// export default [
//     {
//         input: "src/index.ts",
//         output: [
//             {
//                 file: "dist/index.cjs",
//                 format: "cjs",
//             },
//             {
//                 file: "dist/index.mjs",
//                 format: "esm",
//             },
//         ],
//         plugins,
//     },
// ];
