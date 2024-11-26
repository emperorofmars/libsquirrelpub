import { assertEquals, assertExists, assertInstanceOf, assertIsError, fail } from "@std/assert";
import { assertSpyCalls, assertSpyCallArgs } from "@std/testing/mock";
import squirrelpub from "../src/libsquirrelpub.mts";
import { fetchSpy } from "./utils.ts";
import * as testObjects from "./objects.ts";

Deno.test({
	name: "construct Identity ID",
	fn() {
		assertEquals(squirrelpub.constructIdentityURL("example.com").toString(), "https://squirrelpub.example.com/.squirrelpub/identity");
		assertEquals(squirrelpub.constructIdentityURL("john.doe.example.com").toString(), "https://squirrelpub.john.doe.example.com/.squirrelpub/identity");
	}
});

Deno.test({
	name: "construct invalid Identity ID",
	fn() {
		try {
			squirrelpub.constructIdentityURL(".com");
			fail();
		} catch (error) {
			assertIsError(error);
		}
		try {
			squirrelpub.constructIdentityURL("..com");
			fail();
		} catch (error) {
			assertIsError(error);
		}
		try {
			squirrelpub.constructIdentityURL("com");
			fail();
		} catch (error) {
			assertIsError(error);
		}
		try {
			squirrelpub.constructIdentityURL(".");
			fail();
		} catch (error) {
			assertIsError(error);
		}
		try {
			squirrelpub.constructIdentityURL("");
			fail();
		} catch (error) {
			assertIsError(error);
		}
	}
});

Deno.test({
	name: "fetch valid Identity",
	async fn() {
		const tested_identity = testObjects.identity_valid_minimal;
		const test_expected_response = new squirrelpub.Identity(tested_identity.json, tested_identity.fetch_url);

		const spy = fetchSpy(JSON.stringify(tested_identity.json));
		const identity = await squirrelpub.fetchIdentity(tested_identity.id);

		assertSpyCalls(spy, 1);
		assertSpyCallArgs(spy, 0, [new URL(tested_identity.fetch_url)]);
		assertEquals(identity.success, true);
		assertEquals(identity.type, test_expected_response.type);
		assertEquals(identity.id, tested_identity.id);
		assertEquals(identity.squirrelpub.original_url, test_expected_response.squirrelpub.original_url);
	}
});

Deno.test({
	name: "fetch Identity with invalid ID",
	async fn() {
		fetchSpy(null);
		try {
			await squirrelpub.fetchIdentity("com");
			fail();
		} catch (error) {
			assertIsError(error);
		}
	}
});

Deno.test({
	name: "construct Identity from invalid JSON",
	fn() {
		const tested_identity = testObjects.identity_invalid_minimal;
		try {
			new squirrelpub.Identity(tested_identity.json, tested_identity.fetch_url);
			fail();
		} catch (error) {
			assertIsError(error);
		}
	}
});

Deno.test({
	name: "check full example Identity",
	async fn() {
		const tested_identity = testObjects.identity_valid_full;
		const test_expected_response = new squirrelpub.Identity(tested_identity.json, tested_identity.fetch_url);

		const spy = fetchSpy(JSON.stringify(tested_identity.json));
		const identity = await squirrelpub.fetchIdentity(tested_identity.id);
		
		assertSpyCalls(spy, 1);
		assertSpyCallArgs(spy, 0, [new URL(tested_identity.fetch_url)]);
		assertEquals(identity.success, true);
		assertEquals(identity.type, test_expected_response.type);
		assertEquals(identity.id, tested_identity.id);
		assertEquals(identity.squirrelpub.original_url, test_expected_response.squirrelpub.original_url);

		
		assertEquals(identity.alias_identities, ["john.somwhereelse.pub"]);
		assertEquals(identity.primary_alias, tested_identity.id);
		assertInstanceOf(identity.profile, squirrelpub.IdentityProfile);

		assertEquals(identity.name, "John Doe");
		assertEquals(identity.display_id, "John Doe (john.somwhereelse.pub)");
		assertEquals(identity.display, "User: John Doe (john.somwhereelse.pub)");
	}
});
