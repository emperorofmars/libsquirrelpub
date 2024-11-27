import * as squirrelpub from "../src/libsquirrelpub.mts";
import { importKey } from "../src/util/Crypto.mts";
import * as testObjects from "./objects.ts";

Deno.test({
	name: "Generate keypair",
	async fn() {
		//const keypair = await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-384" }, true, ["sign", "verify"]);
		const keypair = await crypto.subtle.generateKey({ name: "Ed25519" }, true, ["sign", "verify"]) as CryptoKeyPair;
		console.log(await crypto.subtle.exportKey("jwk", keypair.publicKey));
		console.log(await crypto.subtle.exportKey("jwk", keypair.privateKey));
	}
});

Deno.test({
	name: "Create Builder with keypair",
	async fn() {
		const test_object = testObjects.identity_valid_full;
		const test_identity = new squirrelpub.Identity(test_object.json);

		//console.log(test_identity);
		
		test_identity.verify_public_key = testObjects.test_identity_public_key as JsonWebKey;

		const private_key = await importKey(testObjects.test_identity_private_key);

		const built_identity = JSON.stringify(test_identity);
		
		console.log(JSON.parse(built_identity));
	}
});
/*
Deno.test({
	name: "Sign and verify",
	async fn() {
		const test_object = testObjects.identity_valid_full;
		const test_identity = new squirrelpub.Identity(test_object.json, test_object.fetch_url);
		const builder = squirrelpub.IdentityBuilder.fromIdentity(test_identity);
		
		builder.verify_public_key = testObjects.test_identity_public_key as JsonWebKey;

		const private_key = await crypto.subtle.importKey("jwk", testObjects.test_identity_private_key as JsonWebKey, { name: "Ed25519" }, true, testObjects.test_identity_private_key.key_ops as KeyUsage[]);
		const built_identity = await builder.build(private_key);

		const result = await test_identity.verify(test_identity.verify_public_key as JsonWebKey);
		console.log(result);
		
		console.log(JSON.parse(built_identity));
	}
});
*/