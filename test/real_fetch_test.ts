import { fetchIdentity } from "../src/libsquirrelpub.mts";

Deno.test({
	name: "Fetch Identity from real network.",
	permissions: { net: true },
	ignore: Deno.permissions.querySync({ name: "net" }).state !== "granted",
	async fn() {
		const id = "example.squirrelpub.com";
		console.warn(`Fetching from real network: ${id}`);

		const identity = await fetchIdentity(id);

		console.log(identity);
	}
});
