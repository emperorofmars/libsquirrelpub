import { IdentityProfile, StreamReference } from "../objects/Identity.mts";
import { Content } from "../objects/JsonObjects.mts";

/**
 * @memberof module:Squirrelpub
 */

export default class IdentityBuilder {
	id: string = "";
	public_key = {type: "", key: "", url: ""};
	alias_identities: string[] = [];
	primary_alias = ""
	profile = new IdentityProfile({name: "", description: new Content({type: "text/markdown", content: ""}), links: [], tags: []});
	streams = [new StreamReference({url: "", active_alias: "", replications: []})];
	social_graph = {};
	stream_registry = {};
	federation_registry = {};
	caching_service = {};
	federation_anchors: string[] = [];

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
