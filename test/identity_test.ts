import { assertEquals, assertExists, assertGreater, assertRejects, assertThrows } from "@std/assert";
import { assertSpyCalls, assertSpyCallArgs } from "@std/testing/mock";
import * as squirrelpub from "../src/libsquirrelpub.mts";
import { fetchRejectSpy, fetchSpy } from "./utils.ts";
import * as testObjects from "./objects.ts";

Deno.test({
	name: "Construct valid Identity IDs",
	fn() {
		assertEquals(squirrelpub.constructIdentityURL("example.com").toString(), "https://squirrelpub.example.com/.squirrelpub/identity");
		assertEquals(squirrelpub.constructIdentityURL("john.doe.example.com").toString(), "https://squirrelpub.john.doe.example.com/.squirrelpub/identity");
	}
});

Deno.test({
	name: "Construct invalid Identity IDs",
	fn() {
		assertThrows(() => {
			squirrelpub.constructIdentityURL(".com");
		});
		assertThrows(() => {
			squirrelpub.constructIdentityURL("..com");
		});
		assertThrows(() => {
			squirrelpub.constructIdentityURL("com");
		});
		assertThrows(() => {
			squirrelpub.constructIdentityURL(".");
		});
		assertThrows(() => {
			squirrelpub.constructIdentityURL("");
		});
	}
});

Deno.test({
	name: "Fetch valid Identity",
	async fn() {
		const test_object = testObjects.identity_valid_minimal;
		const test_expected_response = new squirrelpub.Identity(test_object.json);

		const spy = fetchSpy(JSON.stringify(test_object.json));
		const identity = await squirrelpub.fetchIdentity(test_object.id);

		console.log(JSON.parse(JSON.stringify(identity)));

		assertSpyCalls(spy, 2);
		assertSpyCallArgs(spy, 0, [new URL(test_object.fetch_url)]);
		assertEquals(identity.success, true);
		assertEquals(identity.squirrelpub_type, test_expected_response.squirrelpub_type);
		assertEquals(identity.id, test_object.id);
		//assertEquals(identity.squirrelpub._original_url, test_object.fetch_url);
	}
});

Deno.test({
	name: "Fetch valid Identity with fetch recejt",
	fn() {
		const test_object = testObjects.identity_valid_minimal;

		const spy = fetchRejectSpy(JSON.stringify(test_object.json));
		assertRejects(async () => {
			await squirrelpub.fetchIdentity(test_object.id);
		});

		assertSpyCalls(spy, 1);
		assertSpyCallArgs(spy, 0, [new URL(test_object.fetch_url)]);
	}
});

Deno.test({
	name: "Fetch Identity with invalid IDs",
	fn() {
		fetchSpy(null);
		assertRejects(async () => {
			await squirrelpub.fetchIdentity("com");
		});
		assertRejects(async () => {
			await squirrelpub.fetchIdentity("com");
		});
		assertRejects(async () => {
			await squirrelpub.fetchIdentity("example.com/foo");
		});
	}
});

Deno.test({
	name: "Construct Identity from invalid JSON",
	fn() {
		const test_object = testObjects.identity_invalid_minimal;
		assertThrows(() => {
			new squirrelpub.Identity(test_object.json);
		});
	}
});

Deno.test({
	name: "Check full example Identity",
	async fn() {
		const test_object = testObjects.identity_valid_full;
		const test_expected_response = new squirrelpub.Identity(test_object.json);

		const spy = fetchSpy(JSON.stringify(test_object.json));
		const identity = await squirrelpub.fetchIdentity(test_object.id);
		
		assertSpyCalls(spy, 2);
		assertSpyCallArgs(spy, 0, [new URL(test_object.fetch_url)]);

		assertEquals(identity.success, true);
		assertEquals(identity.squirrelpub_type, test_expected_response.squirrelpub_type);
		assertEquals(identity.id, test_object.id);
		//assertEquals(identity.squirrelpub._original_url, test_expected_response.squirrelpub._original_url);

		assertExists(identity.verify_public_key);

		assertEquals(identity.alias_identities, ["example.somwhereelse.pub"]);
		assertEquals(identity.primary_alias, test_object.id);

		assertExists(identity.profile);
		assertEquals(identity.display_name, "Example Squirrelpub Identity");
		assertEquals(identity.display_name_id, "Example Squirrelpub Identity (example.squirrelpub.com)");
		assertEquals(identity.display_full, "User: Example Squirrelpub Identity (example.squirrelpub.com)");

		const profile: squirrelpub.IdentityProfile = identity.profile as squirrelpub.IdentityProfile;
		assertExists(profile.description);
		assertEquals(profile.description.type, "text/markdown");
		assertExists(profile.description.content);
		assertExists(profile.links);
		assertGreater(profile.links.length, 0);

		const link: squirrelpub.NamedLink = profile.links[0] as squirrelpub.NamedLink;
		assertGreater(link.name.length, 0);
		assertGreater(link.url.length, 0);

		assertExists(profile.tags);
		assertGreater(profile.tags.length, 0)
		const tag: squirrelpub.ProfileTag = profile.tags[0] as squirrelpub.ProfileTag;
		assertGreater(tag.type.length, 0);
		assertGreater(tag.name?.length, 0);
		assertGreater(tag.value?.length, 0);

		assertEquals(identity.stream, "https://example.squirrelpub.com/.squirrelpub/stream/test");
		assertExists(identity.stream_replications);
		
		assertExists(identity.social_graph);
		
		assertExists(identity.stream_registry);
		assertExists(identity.federation_registry);
		assertExists(identity.caching_service);
		assertExists(identity.federation_anchors);
	}
});
/*
Deno.test({
	name: "Verify Identity",
	async fn() {
		const test_object = testObjects.identity_valid_full;
		const identity = new squirrelpub.Identity(test_object.json);

		const result = await verify(identity.verify_public_key as JsonWebKey);
		
		console.log(identity.verify_public_key);
		console.log(identity.signature);
		console.log(result);

		assertEquals(result, true);
	}
});
*/