import peerDepsExternal from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import packageJson from "./package.json" with { type: "json" };

const banner = `/*
* ####################################
* #        ◢◣ Mantra Coding          #
* ####################################
* ${packageJson.name} v${packageJson.version}
*/`;

/** @type {import('rollup').OutputOptions}*/
const outputOptions = {
	dir: "./dist",
	format: "esm",
	sourcemap: true,
	exports: "named",
	preserveModules: true,
	banner
}

/** @type {import('rollup').RollupOptions} */
export default {
    input: "./src/index.tsx",
    external: ["react", "react-dom"],
    output: [
        {	
			name: "index.js",
            ...outputOptions,
        },
    ],
    plugins: [
        peerDepsExternal(),
        resolve(),
        commonjs(),
        typescript({ useTsconfigDeclarationDir: true }),   
    ]
};
