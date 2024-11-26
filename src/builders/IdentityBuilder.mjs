// @ts-check

import { IdentityProfile, StreamReference } from "../objects/Identity.mjs";
import { Content } from "../objects/JsonObjects.mjs";

/**
 * @memberof module:Squirrelpub
 */

export default class IdentityBuilder {
	/** @type {string} */
	id = "";
	public_key = {type: "", key: "", url: ""};
	/** @type {string[]} */
	alias_identities = [];
	primary_alias = ""
	profile = new IdentityProfile({name: "", description: new Content({type: "text/markdown", content: ""}), links: [], tags: []});
	streams = [new StreamReference({url: "", active_alias: "", replications: []})];
	social_graph = {};
	stream_server = {};
	cache_server = {};
	/** @type {string[]} */
	federation_anchors = [];

	build() {
		return {
			squirrelpub: {
				type: "identity",
				id: this.id
			},
			signature: ""
		};
	}
}
