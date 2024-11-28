import { SquirrelpubPayload } from "../src/objects/SquirrelpubPayload.mts";
import * as testObjects from "./objects.ts";
import { fetchSequenceSpy } from "./utils.ts";
import { assertSpyCallArgs, assertSpyCalls } from "@std/testing/mock";
import { assertEquals } from "@std/assert/equals";
import { importKey } from "../src/util/Crypto.mts";

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
