import { assertEquals, assertExists, assertRejects } from "@std/assert";
import { assertSpyCalls, assertSpyCallArgs } from "@std/testing/mock";
import squirrelpub from "../src/libsquirrelpub.mts";
import { fetchSpy } from "./utils.ts";
import * as testObjects from "./objects.ts";

Deno.test({
	name: "Fetch valid Stream",
	async fn() {
		const test_object = testObjects.stream_valid_minimal;
		const test_expected_response = new squirrelpub.Stream(test_object.json, test_object.fetch_url);

		const spy = fetchSpy(JSON.stringify(test_object.json));
		const stream = await squirrelpub.fetchStream(test_object.fetch_url);

		assertSpyCalls(spy, 1);
		assertSpyCallArgs(spy, 0, [test_object.fetch_url]);
		assertEquals(stream.success, true);
		assertEquals(stream.type, test_expected_response.type);
		assertEquals(stream.owner_id, test_expected_response.owner_id);
		assertEquals(stream.original_url, test_expected_response.original_url);

		assertEquals(stream.stream_name, "Main");
		assertEquals(stream.latest, 1);
		assertEquals(stream.len_approximate, 2);
		assertExists(stream.replications);
		assertEquals(stream.replications.length, 1);
		assertEquals(stream.replications, ["https://backup.somewhere.else.com/atsomepath"]);

		assertEquals(stream.constructMessageUrl(1), "https://example.github.io/squirrelpub_example/streams/test/" + 1 + ".json");
	}
});

Deno.test({
	name: "Fetch invalid Stream",
	fn() {
		const test_object = testObjects.stream_invalid_minimal;

		const spy = fetchSpy(JSON.stringify(test_object.json));
		assertRejects(async () => {
			await squirrelpub.fetchStream(test_object.fetch_url);
		});

		assertSpyCalls(spy, 1);
		assertSpyCallArgs(spy, 0, [test_object.fetch_url]);
	}
});

Deno.test({
	name: "Fetch valid Message page",
	async fn() {
		const test_stream = testObjects.stream_valid_minimal;
		const stream = new squirrelpub.Stream(test_stream.json, test_stream.fetch_url);
		assertEquals(stream.latest, 1);

		const test_object = testObjects.message_valid_minimal;
		const test_expected_response = [new squirrelpub.Message(test_object.json, test_object.fetch_url)];

		const spy = fetchSpy(JSON.stringify(test_object.json));
		const page = await squirrelpub.fetchPage(stream, 0, 2);

		assertSpyCalls(spy, 2);
		assertSpyCallArgs(spy, 0, [stream.constructMessageUrl(1)]);
		assertSpyCallArgs(spy, 1, [stream.constructMessageUrl(0)]);
		
		assertEquals(page.length, 2);
		const first_message = page[0];

		assertEquals(first_message.success, true);
		assertEquals(first_message.type, test_expected_response[0].type);
		assertEquals(first_message.owner_id, test_expected_response[0].owner_id);
		assertEquals(first_message.original_url, test_expected_response[0].original_url);
	}
});

Deno.test({
	name: "Fetch Message specific page numbers and page sizes",
	async fn() {
		const test_stream = testObjects.stream_valid_minimal;
		const stream = new squirrelpub.Stream(test_stream.json, test_stream.fetch_url);

		const test_object = testObjects.message_valid_minimal;

		{
			const spy = fetchSpy(JSON.stringify(test_object.json));
			const page = await squirrelpub.fetchPage(stream, 0, 1);
			assertSpyCalls(spy, 1);
			assertSpyCallArgs(spy, 0, [stream.constructMessageUrl(1)]);
			assertEquals(page.length, 1);
		}
		{
			const spy = fetchSpy(JSON.stringify(test_object.json));
			const page = await squirrelpub.fetchPage(stream, 1, 1);
			assertSpyCalls(spy, 1);
			assertSpyCallArgs(spy, 0, [stream.constructMessageUrl(0)]);
			assertEquals(page.length, 1);
		}
		{
			const spy = fetchSpy(JSON.stringify(test_object.json));
			const page = await squirrelpub.fetchPage(stream, 0, 10);
			assertSpyCalls(spy, 2);
			assertSpyCallArgs(spy, 0, [stream.constructMessageUrl(1)]);
			assertEquals(page.length, 2);
		}
	}
});