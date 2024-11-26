import esbuild from "npm:esbuild";
import { denoPlugins } from "@luca/esbuild-deno-loader";

const result = await esbuild.build({
	plugins: [...denoPlugins()],
	entryPoints: ["./src/libsquirrelpub.mts"],
	outdir: "./dist/",
	bundle: true,
	format: "esm",
	minify: true,
	sourcemap: true,
	treeShaking: true,
});
console.log(result);
esbuild.stop();
