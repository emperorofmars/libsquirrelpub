import { SquirrelpubPayload } from "../src/objects/SquirrelpubPayload.mts";
import * as testObjects from "./objects.ts";
import { fetchCallbackSpy } from "./utils.ts";
import { assertSpyCallArgs, assertSpyCalls } from "@std/testing/mock";
import { assertEquals } from "@std/assert/equals";
import { importKey } from "../src/util/Crypto.mts";

Deno.test({
	name: "Fetch Payload",
	async fn() {
		const test_object = testObjects.identity_valid_minimal;

		/** @todo actually create legit signature */
		
		let spyCount = 0;
		const spyFn = (resolve: (value: Response | PromiseLike<Response>) => void) => {
			if(spyCount == 0) resolve(new Response(JSON.stringify(test_object.json)));
			else resolve(new Response("jPXN6s3YE1Faki7aCquo/KzMHx3wQ50KiEzLwRKstN2BQCWXuZPCTKsujj2XOYfXQcQp1Buw1gmdIiNbbJIXDQ=="))
			spyCount++;
		}
		const spy = fetchCallbackSpy(spyFn);
		const payload = await SquirrelpubPayload.fetch(test_object.fetch_url);

		console.log(payload);

		assertSpyCalls(spy, 2);
		assertSpyCallArgs(spy, 0, [test_object.fetch_url]);

		assertEquals(payload.payload, JSON.stringify(test_object.json));
		assertEquals(payload.original_url, test_object.fetch_url);
		assertEquals(payload.signature, "jPXN6s3YE1Faki7aCquo/KzMHx3wQ50KiEzLwRKstN2BQCWXuZPCTKsujj2XOYfXQcQp1Buw1gmdIiNbbJIXDQ==");
		
		assertEquals(await payload.verify(await importKey(testObjects.test_identity_public_key)), false);
	}
});