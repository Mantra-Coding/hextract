import peerDepsExternal from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import { terser } from "@rollup/plugin-terser";
import packageJson from "./package.json" with { type: "json" };

const banner = `/*
* ####################################
* #        ◢◣ Mantra Coding          #
* ####################################
* ${packageJson.name} v${packageJson.version}
*/`;

/** @type {import('rollup').RollupOptions} */
export default [
    // ESM build
    {
        input: "./src/index.tsx",
        external: ["react", "react-dom"],
        output: {
            file: "./dist/index.js",
            format: "esm",
            sourcemap: true,
            banner
        },
        plugins: [
            peerDepsExternal(),
            resolve({ browser: true }),
            commonjs(),
            typescript({ 
                useTsconfigDeclarationDir: true,
                tsconfigOverride: {
                    exclude: ["**/*.test.*", "**/*.spec.*"]
                }
            }),
            terser()
        ]
    },
    // CommonJS build
    {
        input: "./src/index.tsx",
        external: ["react", "react-dom"],
        output: {
            file: "./dist/index.cjs",
            format: "cjs",
            sourcemap: true,
            banner,
            exports: "named"
        },
        plugins: [
            peerDepsExternal(),
            resolve({ browser: true }),
            commonjs(),
            typescript({ 
                useTsconfigDeclarationDir: true,
                tsconfigOverride: {
                    exclude: ["**/*.test.*", "**/*.spec.*"]
                }
            }),
            terser()
        ]
    }
];