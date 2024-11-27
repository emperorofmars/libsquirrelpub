import type { IdentityProfile, PublicKeyReference, SocialGraph } from "../libsquirrelpub.mts";

/**
 * Helper to build a Squirrelpub Identity object.
 * 
 * @todo finish this
 */
export class IdentityBuilder {
	id: string | undefined;
	public_key: PublicKeyReference | undefined;
	alias_identities: string[] | undefined;
	primary_alias: string | undefined;
	profile: IdentityProfile | undefined;
	stream: string | undefined;
	stream_replications: string[] = [];
	social_graph: SocialGraph | undefined;
	stream_registry: string | undefined;
	federation_registry: string | undefined;
	caching_service: string | undefined;
	federation_anchors: string[] | undefined = [];

	/** @todo */
	build(): object {
		/** @todo way more legit validation */
		if(!this.id || this.id.length < 4) throw new Error("Invalid ID");
		if(!this.public_key || !this.public_key.type || !(this.public_key.key || this.public_key.url)) throw new Error("Invalid Public Key");

		// deno-lint-ignore no-explicit-any
		const ret: any = { type: "identity", id: this.id };

		ret.public_key = { type: this.public_key.type }
		if(this.public_key.url) ret.public_key.url = this.public_key.url
		if(this.public_key.key) ret.public_key.key = this.public_key.key

		if(this.alias_identities && this.alias_identities.length > 0) ret.alias_identities = this.alias_identities;
		if(this.primary_alias) ret.primary_alias = this.primary_alias;
		if(this.profile) ret.profile = this.profile;
		if(this.stream) ret.stream = this.stream;
		if(this.stream_replications && this.stream_replications.length > 0) ret.stream_replications = this.stream_replications;
		if(this.social_graph) ret.social_graph = this.social_graph;
		
		if(this.social_graph) ret.social_graph = this.social_graph;
		if(this.stream_registry) ret.stream_registry = this.stream_registry;
		if(this.federation_registry) ret.federation_registry = this.federation_registry;
		if(this.caching_service) ret.caching_service = this.caching_service;
		if(this.federation_anchors && this.federation_anchors.length > 0) ret.federation_anchors = this.federation_anchors;

		return {
			squirrelpub: ret,
			signature: ""
		}
	}
}
