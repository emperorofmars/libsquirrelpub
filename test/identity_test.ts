import { assertEquals, assertExists, assertGreater, assertRejects, assertThrows } from "@std/assert";
import { assertSpyCalls, assertSpyCallArgs } from "@std/testing/mock";
import squirrelpub from "../src/libsquirrelpub.mts";
import { fetchRejectSpy, fetchSpy } from "./utils.ts";
import * as testObjects from "./objects.ts";
import type { IdentityProfile, NamedLink, ProfileTag } from "../src/prelude.mts";

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
		const test_expected_response = new squirrelpub.Identity(test_object.json, test_object.fetch_url);

		const spy = fetchSpy(JSON.stringify(test_object.json));
		const identity = await squirrelpub.fetchIdentity(test_object.id);

		assertSpyCalls(spy, 1);
		assertSpyCallArgs(spy, 0, [new URL(test_object.fetch_url)]);
		assertEquals(identity.success, true);
		assertEquals(identity.type, test_expected_response.type);
		assertEquals(identity.id, test_object.id);
		assertEquals(identity.original_url, test_expected_response.original_url);
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
			new squirrelpub.Identity(test_object.json, test_object.fetch_url);
		});
	}
});

Deno.test({
	name: "Check full example Identity",
	async fn() {
		const test_object = testObjects.identity_valid_full;
		const test_expected_response = new squirrelpub.Identity(test_object.json, test_object.fetch_url);

		const spy = fetchSpy(JSON.stringify(test_object.json));
		const identity = await squirrelpub.fetchIdentity(test_object.id);
		
		assertSpyCalls(spy, 1);
		assertSpyCallArgs(spy, 0, [new URL(test_object.fetch_url)]);

		assertEquals(identity.success, true);
		assertEquals(identity.type, test_expected_response.type);
		assertEquals(identity.id, test_object.id);
		assertEquals(identity.original_url, test_expected_response.original_url);

		assertExists(identity.public_key);

		assertEquals(identity.alias_identities, ["john.somwhereelse.pub"]);
		assertEquals(identity.primary_alias, test_object.id);

		assertExists(identity.profile);
		assertEquals(identity.name, "John Doe");
		assertEquals(identity.display_id, "John Doe (john.doe.example.com)");
		assertEquals(identity.display, "User: John Doe (john.doe.example.com)");

		const profile: IdentityProfile = identity.profile as IdentityProfile;
		assertExists(profile.description);
		assertEquals(profile.description.type, "text/markdown");
		assertExists(profile.description.content);
		assertExists(profile.links);
		assertGreater(profile.links.length, 0);

		const link: NamedLink = profile.links[0] as NamedLink;
		assertGreater(link.name.length, 0);
		assertGreater(link.url.length, 0);

		assertExists(profile.tags);
		assertGreater(profile.tags.length, 0)
		const tag: ProfileTag = profile.tags[0] as ProfileTag;
		assertGreater(tag.type.length, 0);
		assertGreater(tag.name?.length, 0);
		assertGreater(tag.value?.length, 0);

		assertEquals(identity.stream, "https://example.github.io/squirrelpub_example/streams/test");
		assertExists(identity.stream_replications);
		
		assertExists(identity.social_graph);
		
		assertExists(identity.stream_registry);
		assertExists(identity.federation_registry);
		assertExists(identity.caching_service);
		assertExists(identity.federation_anchors);
	}
});
