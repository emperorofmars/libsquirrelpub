/**
 * @memberof module:Squirrelpub
 */

import type { Content } from "./JsonObjects.mts";
import { SquirrelpubBase } from './SquirrelpubBase.mts';

/**
 * A link with a displayname. To be displayed in an Identity profile.
 */
export class NamedLink {
	name!: string;
	url!: string;
}

/**
 * Tags on a profile can describe things like an occupation, pronouns, fursona species, ...
 * 
 * The type is namespaced and can be used as a hint on how the client should render it.
 * If the type is not understood by the client, the name will be used instead. Otherwise if a type is understood, it may still make use of the name.
 * 
 * This is somewhat inspired by Blueskys tagging system, except here a user can set them themselves.
 */
export class ProfileTag {
	type: string;
	name: string | undefined;
	value: string | undefined;
	
	constructor(options: { type: string; name: string | undefined; value: string | undefined; }) {
		this.type = options.type;
		this.name = options.name;
		this.value = options.value;
	}
}

/**
 * The profile of an Identity.
 * 
 * It describes the values needed to build a profile similar to how social media sites work.
 */
export class IdentityProfile {
	name: string | undefined;
	description: Content | undefined;
	links: NamedLink[] | undefined;
	tags: ProfileTag[] | undefined;
	
	constructor(options: { name: string | undefined; description: Content | undefined; links: NamedLink[] | undefined; tags: ProfileTag[] | undefined; }) {
		this.name = options.name;
		this.description = options.description;
		this.links = options.links;
		this.tags = options.tags;
	}
}

/**
 * Defines the relationships to other Identities.
 */
export class SocialGraph {
	subscribed!: {
		len: number;
		url: string;
	};
	subscribers!: {
		len: number;
		url: string;
	};
}

/**
 * Defines the location of the public key of an Identity.
 */
export class PublicKeyReference {
	/** Key type, like id_rsa or ed25519 */
	type!: string;
	/** The key can be directly embebbed */
	key: string | undefined;
	/** The key can be linked */
	url: string | undefined;
}

/**
 * Squirrelpub Identity.
 * 
 * An Identity can be a user, server, cache or any combination thereof.
 */
export class Identity extends SquirrelpubBase {
	/**
	 * @param {any} raw_squirrelpub_object - Parsed JSON
	 * @param {string} original_url - The URL this object was fetched from
	 */
	// deno-lint-ignore no-explicit-any
	constructor(raw_squirrelpub_object: any, original_url: string) {
		super(raw_squirrelpub_object, original_url);
		if(this.type != "identity") throw new Error("Squirrelpub object is not an Identity!");

		// TODO implement json schema validation
	}

	/** Domain without the 'squirrelpub' hostname prefixed. */
	get id(): string { return this.squirrelpub.id; }

	/** List of other Identites which are the same real-life entity. This serves resiliency. */
	get alias_identities(): string[] | undefined { return this.squirrelpub.alias_identities; }

	/** If set, then this alias will be fetched by the client and displayed. This serves resiliency. */
	get primary_alias(): string | undefined { return this.squirrelpub.primary_alias; }

	/** {@link PublicKeyReference} */
	get public_key(): PublicKeyReference { return this.squirrelpub.public_key; }

	/** Identity types can be 'user', 'server', 'cache' or any combination thereof. */
	get identity_type(): string { return this.squirrelpub.identity_type; }

	/** {@link IdentityProfile} */
	get profile(): IdentityProfile { return this.squirrelpub.profile; }

	/** URL of this Identities Stream. {@link Stream} */
	get stream(): string | undefined { return this.squirrelpub.stream; }
	
	/**
	 * {@link Stream}
	 * 
	 * Backup Streams in case the main one goes down.
	 * This serves resiliency.
	 */
	get stream_replications(): string[] | undefined { return this.squirrelpub.stream_replications; }

	/**
	 * {@link SocialGraph}
	 * 
	 * If omitted this Identity can not have authenticated followers or follow any other Identity.
	 * If you follow such an Identity, it will never know about you following it.
	 */
	get social_graph(): SocialGraph | undefined { return this.squirrelpub.social_graph; }

	/**
	 * URL to a StreamRegistry hosted by this Identity.
	 * A StreamRegistry hosts Streams for other Identities.
	 */
	get stream_registry(): string | undefined { return this.squirrelpub.stream_registry; }

	/**
	 * URL to a FederationRegistry hosted by this Identity.
	 * A FederationRegistry hosts endpoints to search for content across the entire network.
	 */
	get federation_registry(): string | undefined { return this.squirrelpub.federation_registry; }

	/**
	 * URL to a CachingService hosted by this Identity.
	 * A CachingService hosts endpoints to fetch content from.
	 */
	get caching_service(): string | undefined { return this.squirrelpub.caching_service; }

	/**
	 * A list of Squirrelpub IDs which this Identity knows to exist.
	 * Acts as a 'seed' for automatic federation & discovery.
	 */
	get federation_anchors(): string[] { return this.squirrelpub.federation_anchors ? this.squirrelpub.federation_anchors : [];  }

	

	/** Optional display name for this Identity */
	get name(): string | undefined { return this.profile?.name; }

	/** Pretty print the type of this Identity */
	get display_identity_type(): string { return this.identity_type[0].toUpperCase() + this.identity_type.slice(1); }

	/** Pretty print the name and ID of this Identity */
	get display_id(): string { return `${this.name} (${this.id})`; }

	/** Pretty print the type, name and ID of this Identity */
	get display(): string { return `${this.display_identity_type}: ${this.display_id}`; }
}

/**
 * Construct an URL from a Squirrelpub ID, from which the Identity can be fetched.
 * 
 * A Squirrelpub ID must be a valid DNS hostname.
 * To turn an ID into the Squirrelpub hostname, prefix it with `squirrelpub.`.
 * To turn a Squirrelpub hostname into the final URL from which the Identity can be fetched, prefix it with `https://` and append it with `/.squirrelpub/identity"`.
 * 
 * @param {string} id - the ID, without the 'squirrelpub' hostname prefixed
 * @returns {URL} The squirrelpub fetch URL
 * @throws If the id is an invalid hostname
 */
export function constructIdentityURL(id: string): URL {
	if(!id.includes(".")) throw new Error("A Squirrelpub ID must be a valid domain! For example: 'example.com'");

	const squirrelpubHost = "squirrelpub." + id;
	const url = new URL("https://" + squirrelpubHost + "/.squirrelpub/identity");

	if(url.hostname != squirrelpubHost)
	{
		throw new Error("Invalid Squirrelpub ID");
	}
	return url;
}

/**
 * Load a squirrelpub identity by its ID (domain without the 'squirrelpub' hostname prefixed).
 * 
 * @param {string} id - the identities domain, without the 'squirrelpub' hostname prefixed
 * @returns {Promise<Identity>} The squirrelpub identity if found
 */
export async function fetchIdentity(id: string): Promise<Identity> {
	const url = constructIdentityURL(id);
	return new Identity(await fetch(url).then(response => response.json()), url.toString());
}
