import { assertEquals } from "@std/assert/equals";
import * as squirrelpub from "../src/libsquirrelpub.mts";
import { importKey, signString, verifyString } from "../src/util/Crypto.mts";
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
	name: "Generate keypair and signature for example",
	ignore: true,
	async fn() {
		const keypair = await crypto.subtle.generateKey({ name: "Ed25519" }, true, ["sign", "verify"]) as CryptoKeyPair;
		const public_key = await crypto.subtle.exportKey("jwk", keypair.publicKey);
		const private_key = await crypto.subtle.exportKey("jwk", keypair.privateKey);
		console.log(public_key);
		console.log(private_key);

		const test_object = testObjects.identity_valid_full;
		const test_identity = new squirrelpub.Identity(test_object.json);

		test_identity.verify_public_key = public_key;

		const final_string = JSON.stringify(test_identity, null, 4);
		console.log(final_string);
		console.log(await signString(final_string, keypair.privateKey));
	}
});

Deno.test({
	name: "Generate signature for example from existing keypair",
	ignore: true,
	async fn() {
		const test_object = testObjects.identity_valid_full;
		const test_identity = new squirrelpub.Identity(test_object.json);

		test_identity.verify_public_key = testObjects.test_identity_public_key;

		const final_string = JSON.stringify(test_object.json, null, 4);
		console.log(final_string);
		console.log(await signString(final_string, await importKey(testObjects.test_identity_private_key)));
	}
});

Deno.test({
	name: "Generate signature for example loaded as file from existing keypair",
	ignore: true,
	async fn() {
		const raw_json = await Deno.readTextFile("example/.squirrelpub/identity/index.json");
		const test_identity = new squirrelpub.Identity(JSON.parse(raw_json));

		test_identity.verify_public_key = testObjects.test_identity_public_key;

		console.log(raw_json);
		console.log(await signString(raw_json, await importKey(testObjects.test_identity_private_key)));
	}
});
