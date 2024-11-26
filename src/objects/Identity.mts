/**
 * @memberof module:Squirrelpub
 */

import type { Content } from "./JsonObjects.mts";
import { SquirrelpubBase } from './SquirrelpubBase.mts';

/**
 * Describes a Stream and how it is to be displayed.
 * Also defines where this Stream is being backed up to.
 */
export class StreamReference {
	url: string;
	active_alias: string | undefined;
	replications: string[] | undefined;
	
	constructor(options: { url: string; active_alias: string | undefined; replications: string[] | undefined; }) {
		this.url = options.url;
		this.active_alias = options.active_alias;
		this.replications = options.replications;
	}
}

/**
 * A link with a displayname. To be displayed in an Identity profile.
 */
export class NamedLink {
	name: string;
	url: string;
	
	constructor(options: { name: string; url: string; }) {
		this.name = options.name;
		this.url = options.url;
	}
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

export class Host {
	stream_registry: StreamReference | undefined;
	federation_registry: StreamReference | undefined;
	
	constructor(options: { stream_registry: StreamReference | undefined; federation_registry: StreamReference | undefined; }) {
		this.stream_registry = options.stream_registry;
		this.federation_registry = options.federation_registry;
	}
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

	/** Domain without the 'squirrelpub' hostname prefixed */
	get id(): string { return this.squirrelpub.id; }

	/** Identity types can be 'user', 'server', 'cache' or any combination thereof. */
	get identity_type(): string { return this.squirrelpub.identity_type; }

	/** @type {string} */
	get name(): string | undefined { return this.profile?.name; }

	/** @type {IdentityProfile} */
	get profile(): IdentityProfile { return this.squirrelpub.profile; }

	/** The list of Streams to which this Identity posts. */
	get streams(): StreamReference[] { return this.squirrelpub.streams ? this.squirrelpub.streams : []; }

	
	/** @type {string} */
	get display_identity_type(): string { return this.identity_type[0].toUpperCase() + this.identity_type.slice(1); }

	/** @type {string} */
	get display_id(): string { return `${this.name} (${this.id})`; }

	/** @type {string} */
	get display(): string { return `${this.display_identity_type}: ${this.display_id}`; }
}


/**
 * Load a squirrelpub identity by its id (domain without the 'squirrelpub' hostname prefixed)
 * 
 * @param {string} id - the identities domain, without the 'squirrelpub' hostname prefixed
 * @returns {URL} The squirrelpub fetch URL
 * @throws If the id is an invalid hostname
 */
export function constructIdentityURL(id: string): URL {
	if(!id.includes(".")) throw new Error("A Squirrelpub ID must be a valid domain! For example: 'example.com'");

	const squirrelpubId = "squirrelpub." + id;
	const url = new URL("https://" + squirrelpubId + "/.squirrelpub/identity");

	if(url.hostname != squirrelpubId)
	{
		throw new Error("Invalid Squirrelpub ID");
	}

	return url;
}


/**
 * Fetch a squirrelpub identity by its id (domain without the 'squirrelpub' hostname prefixed)
 * 
 * @param {string} id - the identities domain, without the 'squirrelpub' hostname prefixed
 * @returns {Promise<Identity>} The squirrelpub identity if found
 */
export async function fetchIdentity(id: string): Promise<Identity> {
	const url = constructIdentityURL(id);
	return new Identity(await fetch(url).then(response => response.json()), url.toString());
}
