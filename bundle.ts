/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

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
