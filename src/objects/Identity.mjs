// @ts-check

/**
 * @memberof module:Squirrelpub
 */

// deno-lint-ignore no-unused-vars verbatim-module-syntax
import { Content } from "./JsonObjects.mjs";
import { SquirrelpubBase } from './SquirrelpubBase.mjs';

export class StreamReference {
	/**
	 * @param {object} options
	 * @param {string} options.url
	 * @param {string | undefined} options.active_alias
	 * @param {string[] | undefined} options.replications
	 */
	constructor(options) {
		this.url = options.url;
		this.active_alias = options.active_alias;
		this.replications = options.replications;
	}
}

export class NamedLink {
	/**
	 * @param {object} options
	 * @param {string} options.name
	 * @param {string} options.url
	 */
	constructor(options) {
		this.name = options.name;
		this.url = options.url;
	}
}

export class ProfileTag {
	/**
	 * @param {object} options
	 * @param {string} options.type
	 * @param {string | undefined} options.name
	 * @param {string | undefined} options.value
	 */
	constructor(options) {
		this.type = options.type;
		this.name = options.name;
		this.value = options.value;
	}
}

export class IdentityProfile {
	/**
	 * @param {object} options
	 * @param {string | undefined} options.name
	 * @param {Content | undefined} options.description
	 * @param {NamedLink[] | undefined} options.links
	 * @param {ProfileTag[] | undefined} options.tags
	 */
	constructor(options) {
		this.name = options.name;
		this.description = options.description;
		this.links = options.links;
		this.tags = options.tags;
	}
}

export class Host {
	/**
	 * @param {object} options
	 * @param {StreamReference | undefined} options.stream_registry
	 * @param {StreamReference | undefined} options.federation_registry
	 */
	constructor(options) {
		this.stream_registry = options.stream_registry;
		this.federation_registry = options.federation_registry;
	}
}

/**
 * Squirrelpub Identity.
 */
export class Identity extends SquirrelpubBase {
	/**
	 * @param {any} raw_squirrelpub_object - Parsed JSON
	 * @param {string} original_url - The URL this object was fetched from
	 */
	constructor(raw_squirrelpub_object, original_url) {
		super(raw_squirrelpub_object, original_url);
		if(this.type != "identity") throw new Error("Squirrelpub object is not an Identity!");

		// TODO implement json schema validation
	}

	/** @type {string} Domain without the 'squirrelpub' hostname prefixed */
	get id() { return this.squirrelpub.id; }

	/** @type {string} */
	get identity_type() { return this.squirrelpub.identity_type; }

	/** @type {string} */
	get name() { return this.squirrelpub.profile.name; }

	/** @type {IdentityProfile} */
	get profile() { return this.squirrelpub.profile; }

	/**
	 * @returns {StreamReference[]}
	 */
	get streams() {
		return this.squirrelpub.streams;
	}

	
	/** @type {string} */
	get display_identity_type() { return this.identity_type[0].toUpperCase() + this.identity_type.slice(1); }

	/** @type {string} */
	get display_id() { return `${this.name} (${this.id})`; }

	/** @type {string} */
	get display() { return `${this.display_identity_type}: ${this.display_id}`; }
}


/**
 * Load a squirrelpub identity by its id (domain without the 'squirrelpub' hostname prefixed)
 * 
 * @param {string} id - the identities domain, without the 'squirrelpub' hostname prefixed
 * @returns {URL} The squirrelpub fetch URL
 * @throws If the id is an invalid hostname
 */
export function constructIdentityURL(id) {
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
export async function fetchIdentity(id) {
	const url = constructIdentityURL(id);
	return new Identity(await fetch(url).then(response => response.json()), url.toString());
}
