import { assertEquals } from "@std/assert/equals";
import { importKey, verifyString } from "../src/util/Crypto.mts";
import * as testObjects from "./objects.ts";

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
	name: "Verify example stream signature",
	permissions: { read: true },
	ignore: Deno.permissions.querySync({ name: "read" }).state !== "granted",
	async fn() {
		const raw_json = await Deno.readTextFile("example/.squirrelpub/stream/index.json");
		const signature = await Deno.readTextFile("example/.squirrelpub/stream/verify.txt");
		const public_key = await importKey(testObjects.test_identity_public_key);

		const result = await verifyString(raw_json, public_key, signature);
		assertEquals(result, true);
	}
});
