import { constructIdentityURL, fetchIdentity, Identity } from "../src/libsquirrelpub.mts";
import { SquirrelpubPayload } from "../src/objects/SquirrelpubPayload.mts";
import { importKey, signString } from "../src/util/Crypto.mts";
import * as testObjects from "./objects.ts";

Deno.test({
	name: "Fetch Identity from real network.",
	permissions: { net: true },
	ignore: Deno.permissions.querySync({ name: "net" }).state !== "granted",
	async fn() {
		const id = "example.squirrelpub.com";
		console.warn(`Fetching from real network: ${id}`);

		const identity = await fetchIdentity(id);
		const signature = identity.squirrelpub._request_meta().signature_resolved;

		//console.log(identity);
		console.log(signature);
		console.log(identity.squirrelpub._request_meta());
		console.log(identity.squirrelpub._request_meta().verified);
	}
});

Deno.test({
	name: "Fetch Identity from real network with payload manually.",
	permissions: { net: true },
	ignore: Deno.permissions.querySync({ name: "net" }).state !== "granted",
	async fn() {
		const id = "example.squirrelpub.com";
		console.warn(`Fetching from real network: ${id}`);

		const payload = await SquirrelpubPayload.fetch(constructIdentityURL(id));

		const identity = await Identity.fromPayload(payload);

		const signature = identity.squirrelpub._request_meta().signature_resolved;

		//console.log(identity);
		console.log(signature);
		console.log(identity.squirrelpub._request_meta());
		console.log(identity.squirrelpub._request_meta().verified);

		console.log(await signString(payload.payload, await importKey(testObjects.test_identity_private_key)));

	}
});
