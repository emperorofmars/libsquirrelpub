import { assertEquals, assertIsError, fail } from "@std/assert";
import { assertSpyCalls, assertSpyCallArgs } from "@std/testing/mock";
import squirrelpub from "../src/libsquirrelpub.mts";
import { fetchSpy } from "./utils.ts";

Deno.test(async function fetchIdentityTest() {
	const test_id = "squirrelpub.com";
	const test_expected_url = "https://squirrelpub." + test_id + "/.squirrelpub/identity";
	const test_response = {squirrelpub: {type: "identity"}, signature: ""};
	const test_expected_response = new squirrelpub.Identity({squirrelpub: {type: "identity"}, signature: ""}, test_expected_url);

	const spy = fetchSpy(JSON.stringify(test_response));
	const identity = await squirrelpub.fetchIdentity(test_id);

	assertSpyCalls(spy, 1);
	assertSpyCallArgs(spy, 0, [new URL(test_expected_url)]);
	assertEquals(test_expected_response.type, identity.type);
	assertEquals(test_expected_response.squirrelpub.type, identity.squirrelpub.type);
	assertEquals(test_expected_response.squirrelpub.original_url, identity.squirrelpub.original_url);
});

Deno.test(async function fetchIdentityInvalidIDTest() {
	fetchSpy(null);
	try {
		await squirrelpub.fetchIdentity("com");
		fail();
	} catch (error) {
		assertIsError(error);
	}
});
