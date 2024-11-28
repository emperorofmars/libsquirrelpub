import { SquirrelpubPayload } from "../src/objects/SquirrelpubPayload.mts";
import * as testObjects from "./objects.ts";
import { fetchResponseSequenceSpy, fetchSequenceSpy } from "./utils.ts";
import { assertSpyCallArgs, assertSpyCalls } from "@std/testing/mock";
import { assertEquals } from "@std/assert/equals";
import { importKey, verifyString } from "../src/util/Crypto.mts";

Deno.test({
	name: "Fetch Payload",
	async fn() {
		const test_object = testObjects.identity_valid_minimal;

		const spy = fetchSequenceSpy([JSON.stringify(test_object.json), "jPXN6s3YE1Faki7aCquo/KzMHx3wQ50KiEzLwRKstN2BQCWXuZPCTKsujj2XOYfXQcQp1Buw1gmdIiNbbJIXDQ=="]);
		const payload = await SquirrelpubPayload.fetch(test_object.fetch_url);

		assertSpyCalls(spy, 2);
		assertSpyCallArgs(spy, 0, [test_object.fetch_url]);
		assertSpyCallArgs(spy, 1, [test_object.fetch_url + "/verify.txt"]);

		assertEquals(payload.payload, JSON.stringify(test_object.json));
		assertEquals(payload.original_url, test_object.fetch_url);
		assertEquals(payload.signature, "jPXN6s3YE1Faki7aCquo/KzMHx3wQ50KiEzLwRKstN2BQCWXuZPCTKsujj2XOYfXQcQp1Buw1gmdIiNbbJIXDQ==");
		
		assertEquals(await payload.verify(await importKey(testObjects.test_identity_public_key)), false);
		assertEquals(await payload.verify(await importKey(testObjects.test_identity_public_key), "jPXN6s3YE1Faki7aCquo/KzMHx3wQ50KiEzLwRKstN2BQCWXuZPCTKsujj2XOYfXQcQp1Buw1gmdIiNbbJIXDQ=="), false);
	}
});

Deno.test({
	name: "Fetch Payload custom signature url",
	async fn() {
		const test_object = testObjects.identity_valid_minimal;

		const spy = fetchSequenceSpy([JSON.stringify(test_object.json), "jPXN6s3YE1Faki7aCquo/KzMHx3wQ50KiEzLwRKstN2BQCWXuZPCTKsujj2XOYfXQcQp1Buw1gmdIiNbbJIXDQ=="]);
		const payload = await SquirrelpubPayload.fetch(test_object.fetch_url, "https://foo.com/asdf");

		assertSpyCalls(spy, 2);
		assertSpyCallArgs(spy, 0, [test_object.fetch_url]);
		assertSpyCallArgs(spy, 1, ["https://foo.com/asdf"]);

		assertEquals(payload.payload, JSON.stringify(test_object.json));
		assertEquals(payload.original_url, test_object.fetch_url);
		assertEquals(payload.signature, "jPXN6s3YE1Faki7aCquo/KzMHx3wQ50KiEzLwRKstN2BQCWXuZPCTKsujj2XOYfXQcQp1Buw1gmdIiNbbJIXDQ==");
		
		assertEquals(await payload.verify(await importKey(testObjects.test_identity_public_key)), false);
		assertEquals(await payload.verify(await importKey(testObjects.test_identity_public_key), "jPXN6s3YE1Faki7aCquo/KzMHx3wQ50KiEzLwRKstN2BQCWXuZPCTKsujj2XOYfXQcQp1Buw1gmdIiNbbJIXDQ=="), false);
	}
});

Deno.test({
	name: "Fetch Payload and verify signature",
	permissions: { read: true },
	ignore: Deno.permissions.querySync({ name: "read" }).state !== "granted",
	async fn() {
		const fetch_url = "https://squirrelpub.example.squirrelpub.com/.squirrelpub/identity";
		const fetch_verify_url = "https://squirrelpub.example.squirrelpub.com/.squirrelpub/identity/verify.txt";

		const raw_json = await Deno.readTextFile("example/.squirrelpub/identity/index.json");
		const signature = await Deno.readTextFile("example/.squirrelpub/identity/verify.txt");

		const spy = fetchSequenceSpy([raw_json, signature]);
		const payload = await SquirrelpubPayload.fetch(fetch_url);

		assertSpyCalls(spy, 2);
		assertSpyCallArgs(spy, 0, [fetch_url]);
		assertSpyCallArgs(spy, 1, [fetch_verify_url]);

		assertEquals(payload.payload, raw_json);
		assertEquals(payload.original_url, fetch_url);
		assertEquals(payload.signature, signature);
		
		const public_key = await importKey(testObjects.test_identity_public_key);

		assertEquals(await verifyString(raw_json, public_key, signature), true);
		assertEquals(await payload.verify(await importKey(testObjects.test_identity_public_key)), true);
	}
});

Deno.test({
	name: "Fetch Payload which requires '.json' in url and verify signature",
	permissions: { read: true },
	ignore: Deno.permissions.querySync({ name: "read" }).state !== "granted",
	async fn() {
		const fetch_url = "https://squirrelpub.example.squirrelpub.com/.squirrelpub/identity";
		const expected_fetch_url = "https://squirrelpub.example.squirrelpub.com/.squirrelpub/identity.json";
		const expected_fetch_verify_url = "https://squirrelpub.example.squirrelpub.com/.squirrelpub/identity.verify.txt";

		const raw_json = await Deno.readTextFile("example/.squirrelpub/identity/index.json");
		const signature = await Deno.readTextFile("example/.squirrelpub/identity/verify.txt");

		const spy = fetchResponseSequenceSpy([Response.error(), new Response(raw_json), new Response(signature)]);
		const payload = await SquirrelpubPayload.fetch(fetch_url);

		assertSpyCalls(spy, 3);
		assertSpyCallArgs(spy, 0, [fetch_url]);
		assertSpyCallArgs(spy, 1, [expected_fetch_url]);
		assertSpyCallArgs(spy, 2, [expected_fetch_verify_url]);

		assertEquals(payload.payload, raw_json);
		assertEquals(payload.original_url, fetch_url);
		assertEquals(payload.signature, signature);
		
		const public_key = await importKey(testObjects.test_identity_public_key);

		assertEquals(await verifyString(raw_json, public_key, signature), true);
		assertEquals(await payload.verify(await importKey(testObjects.test_identity_public_key)), true);
	}
});
