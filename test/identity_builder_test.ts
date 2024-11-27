import { assertExists } from "@std/assert";
import * as squirrelpub from "../src/libsquirrelpub.mts";

Deno.test({
	name: "Build valid Identity",
	fn() {
		const builder = new squirrelpub.IdentityBuilder();
		builder.id = "example.squirrelpub.com";
		builder.public_key = {type: "ed25519", url: "https://example.squirrelpub.com/.squirrelpub/identity/key", key: undefined};

		const built_identity = builder.build();
		
		//console.log(built_identity);

		assertExists(built_identity);
	}
});