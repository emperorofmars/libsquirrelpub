import { SquirrelpubPayload } from "../src/objects/SquirrelpubPayload.mts";
import * as testObjects from "./objects.ts";
import { fetchResponseSequenceSpy, fetchSequenceSpy } from "./utils.ts";
import { assertSpyCallArgs, assertSpyCalls } from "@std/testing/mock";
import { assertRejects } from "@std/assert/rejects";

Deno.test({
	name: "Test fetchSequenceSpy",
	async fn() {
		const test_object = testObjects.identity_valid_minimal;

		const spy = fetchSequenceSpy([JSON.stringify(test_object.json), "jPXN6s3YE1Faki7aCquo/KzMHx3wQ50KiEzLwRKstN2BQCWXuZPCTKsujj2XOYfXQcQp1Buw1gmdIiNbbJIXDQ=="]);
		await SquirrelpubPayload.fetch(test_object.fetch_url);
		assertRejects(async () => {
			await SquirrelpubPayload.fetch(test_object.fetch_url);
		});

		assertSpyCalls(spy, 3);
		assertSpyCallArgs(spy, 0, [test_object.fetch_url]);
		assertSpyCallArgs(spy, 1, [test_object.fetch_url + "/verify.txt"]);
		assertSpyCallArgs(spy, 2, [test_object.fetch_url]);
	}
});

Deno.test({
	name: "Test fetchResponseSequenceSpy",
	async fn() {
		const test_object = testObjects.identity_valid_minimal;

		const spy = fetchResponseSequenceSpy([new Response(JSON.stringify(test_object.json)), new Response("jPXN6s3YE1Faki7aCquo/KzMHx3wQ50KiEzLwRKstN2BQCWXuZPCTKsujj2XOYfXQcQp1Buw1gmdIiNbbJIXDQ==")]);
		await SquirrelpubPayload.fetch(test_object.fetch_url);
		assertRejects(async () => {
			await SquirrelpubPayload.fetch(test_object.fetch_url);
		});

		assertSpyCalls(spy, 3);
		assertSpyCallArgs(spy, 0, [test_object.fetch_url]);
		assertSpyCallArgs(spy, 1, [test_object.fetch_url + "/verify.txt"]);
		assertSpyCallArgs(spy, 2, [test_object.fetch_url]);
	}
});
