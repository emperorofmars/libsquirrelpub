import { assertEquals } from "@std/assert/equals";
import { importKey, verifyString } from "../src/util/Crypto.mts";
import * as testObjects from "./objects.ts";
import { SquirrelpubPayload } from "../src/objects/SquirrelpubPayload.mts";
import { fetchIdentity, Identity, Stream } from "../src/libsquirrelpub.mts";
import { fetchSequenceSpy } from "./utils.ts";

Deno.test({
	name: "Verify example identity signature",
	permissions: { read: true },
	ignore: Deno.permissions.querySync({ name: "read" }).state !== "granted",
	async fn() {
		const raw_json = await Deno.readTextFile("example/.squirrelpub/identity/index.json");
		const signature = await Deno.readTextFile("example/.squirrelpub/identity/verify.txt");
		const public_key = await importKey(testObjects.test_identity_public_key);

		const result = await verifyString(raw_json, public_key, signature);
		assertEquals(result, true);
	}
});

Deno.test({
	name: "Payload verify example identity signature",
	permissions: { read: true },
	ignore: Deno.permissions.querySync({ name: "read" }).state !== "granted",
	async fn() {
		const raw_json = await Deno.readTextFile("example/.squirrelpub/identity/index.json");
		const signature = await Deno.readTextFile("example/.squirrelpub/identity/verify.txt");

		const payload = new SquirrelpubPayload(raw_json, "https://squirrelpub.example.squirrel.pub/.squirrelpub/identity", signature);
		const identity = await Identity.fromPayload(payload);

		const result = identity.squirrelpub._request_meta().verified;
		assertEquals(result, true);
	}
});

Deno.test({
	name: "Payload verify example identity signature with fetch mock",
	permissions: { read: true },
	ignore: Deno.permissions.querySync({ name: "read" }).state !== "granted",
	async fn() {
		const raw_json = await Deno.readTextFile("example/.squirrelpub/identity/index.json");
		const signature = await Deno.readTextFile("example/.squirrelpub/identity/verify.txt");


		const _ = fetchSequenceSpy([raw_json, signature]);
		const identity = await fetchIdentity("example.squirrel.pub");

		const result = identity.squirrelpub._request_meta().verified;
		assertEquals(result, true);
	}
});

Deno.test({
	name: "Verify example stream signature",
	permissions: { read: true },
	ignore: Deno.permissions.querySync({ name: "read" }).state !== "granted",
	async fn() {
		const raw_json = await Deno.readTextFile("example/.squirrelpub/streams/post/index.json");
		const signature = await Deno.readTextFile("example/.squirrelpub/streams/post/verify.txt");
		const public_key = await importKey(testObjects.test_identity_public_key);

		const result = await verifyString(raw_json, public_key, signature);
		assertEquals(result, true);
	}
});

Deno.test({
	name: "Payload verify example stream signature",
	permissions: { read: true },
	ignore: Deno.permissions.querySync({ name: "read" }).state !== "granted",
	async fn() {
		const identity_raw_json = await Deno.readTextFile("example/.squirrelpub/identity/index.json");
		const identity_signature = await Deno.readTextFile("example/.squirrelpub/identity/verify.txt");
		const identity_payload = new SquirrelpubPayload(identity_raw_json, "https://squirrelpub.example.squirrel.pub/.squirrelpub/identity", identity_signature);
		const identity = await Identity.fromPayload(identity_payload);

		const raw_json = await Deno.readTextFile("example/.squirrelpub/streams/post/index.json");
		const signature = await Deno.readTextFile("example/.squirrelpub/streams/post/verify.txt");

		const payload = new SquirrelpubPayload(raw_json, "https://squirrelpub.example.squirrel.pub/.squirrelpub/identity", signature);
		const stream = await Stream.fromPayload(payload, identity);

		const result = stream.squirrelpub._request_meta().verified;
		assertEquals(result, true);
	}
});
