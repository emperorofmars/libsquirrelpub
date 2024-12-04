/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { importKey, signString } from "../src/util/Crypto.mts";
import * as testObjects from "../test/objects.ts";

Deno.test({
	name: "Generate keypair",
	only: true,
	async fn() {
		const keypair = await crypto.subtle.generateKey({ name: "Ed25519" }, true, ["sign", "verify"]) as CryptoKeyPair;
		console.log(await crypto.subtle.exportKey("jwk", keypair.publicKey));
		console.log(await crypto.subtle.exportKey("jwk", keypair.privateKey));
	}
});

Deno.test({
	name: "Generate signature for example file",
	only: true,
	async fn() {
		const path = "example/.squirrelpub/identity/index.json";
		//const path = "example/.squirrelpub/streams/post/index.json";

		const raw_json = await Deno.readTextFile(path);

		console.log(await signString(raw_json, await importKey(testObjects.test_identity_private_key)));
	}
});
