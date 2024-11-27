/**
 * Helper to build a Squirrelpub Identity object.
 * 
 * @todo finish this
 */
export default class IdentityBuilder {
	id: string = "";
	public_key = {type: "", key: "", url: ""};
	alias_identities: string[] = [];
	primary_alias = ""
	profile = {name: "", description: {type: "text/markdown", content: ""}, links: [], tags: []};
	stream = "";
	stream_replications = [];
	social_graph = {};
	stream_registry = {};
	federation_registry = {};
	caching_service = {};
	federation_anchors: string[] = [];

	/** @todo */
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
