import { importKey, signString } from "../src/util/Crypto.mts";
import * as testObjects from "./objects.ts";

Deno.test({
	name: "Generate keypair",
	ignore: true,
	async fn() {
		const keypair = await crypto.subtle.generateKey({ name: "Ed25519" }, true, ["sign", "verify"]) as CryptoKeyPair;
		console.log(await crypto.subtle.exportKey("jwk", keypair.publicKey));
		console.log(await crypto.subtle.exportKey("jwk", keypair.privateKey));
	}
});

Deno.test({
	name: "Generate signature for example file",
	ignore: true,
	async fn() {
		const path = "example/.squirrelpub/identity/index.json";
		//const path = "example/.squirrelpub/stream/index.json";
		
		const raw_json = await Deno.readTextFile(path);
		
		console.log(await signString(raw_json, await importKey(testObjects.test_identity_private_key)));
	}
});