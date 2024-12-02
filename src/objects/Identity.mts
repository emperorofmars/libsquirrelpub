import { importKey } from "../util/Crypto.mts";
import type { Attachment, Content, StreamReference } from "./JsonObjects.mts";
import type { SquirrelpubMeta, SquirrelpubBase } from './SquirrelpubBase.mts';
import { SquirrelpubPayload } from "./SquirrelpubPayload.mts";

/**
 * A link with a displayname. To be displayed in an Identity profile.
 */
export interface NamedLink {
	/** Display name */
	name: string;
	/** URL */
	url: string;
}

/**
 * Tags on a profile can describe things like an occupation, pronouns, fursona species, ...
 *
 * The type is namespaced and can be used as a hint on how the client should render it.
 * If the type is not understood by the client, the name will be used instead. Otherwise if a type is understood, it may still make use of the name.
 *
 * This is somewhat inspired by Blueskys tagging system, except here a user can set them themselves.
 */
export interface ProfileTag {
	/** Namespaced type. For example: `com.squirrelpub.fursona_species` */
	type: string;
	/** Name for this tag. Could be `Species`. Will serve as the fallback for rendereing in the client if the `type` is not understood. */
	name: string | undefined;
	/** The content of the tag. Could be `Red Squirrel`. */
	value: string | undefined;
}

/**
 * The profile of an Identity.
 *
 * It describes the values needed to build a profile similar to how social media sites work.
 */
export interface IdentityProfile {
	/** An Identities choosen display name. */
	name: string | undefined;
	/** Profile description. */
	description: Content | undefined;
	/** List of links to be displayed on this Identities profile page. */
	links: NamedLink[] | undefined;
	/** List of tags to be displayed on this Identities profile page. */
	tags: ProfileTag[] | undefined;
	/** Profile Icon image. */
	icon: Attachment | undefined;
	/** Profile header image. */
	header: Attachment | undefined;

	/**
	 * Support custom properties. Squirrelpub is extensible
	 */ // deno-lint-ignore no-explicit-any
	[key: string]: any;
}

/**
 * Defines a JsonWebKey with the algorithm used as required by 'SubtleCrypto.importKey'.
 */
export interface Key {
	algorithm: AlgorithmIdentifier | HmacImportParams | RsaHashedImportParams | EcKeyImportParams,
	key: JsonWebKey
}

/**
 * The Identity is the central object in Squirrelpub. It describes an entity which can as a user, server, cache or any combination thereof.
 */
export class Identity implements SquirrelpubBase {
	/**
	 * The Squirrelpub object contains the squirrelpub type, version and optional URL to retrieve the signature of the original payload, if not present in the http header.
	 */
	squirrelpub!: SquirrelpubMeta;

	/**
	 * Support custom properties. Squirrelpub is extensible
	 */ // deno-lint-ignore no-explicit-any
	[key: string]: any;

	/** Domain without the 'squirrelpub' hostname prefixed. */
	id: string | undefined;

	/** The public key for verifying signatures of objects belonging to this identity. */
	verify_public_key: Key | undefined;

	/** The timestamp when this Identity was created. */
	created_timestamp: string | undefined;

	/** List of other Identites which are the same real-life entity. This serves resiliency. */
	alias_identities: string[] | undefined;

	/** If set, then this alias will be fetched by the client and displayed. This serves resiliency. */
	primary_alias: string | undefined;

	/** Identity types can be 'user', 'forum', 'server', 'cache' or anything else. This serves as a hint on how clients should display this identity. */
	identity_type: string | undefined;

	/** The profile describes the information which is to be displayed on a profile page. */
	profile: IdentityProfile | undefined;

	/** Set of Stream references. {@link StreamReference} */
	streams: {
		post: StreamReference | undefined,
		reply: StreamReference | undefined,
		command: StreamReference | undefined,
		subscribed: StreamReference | undefined,
		subscribers: StreamReference | undefined,
		deny: StreamReference | undefined,
		past_public_keys: StreamReference | undefined,
		[key: string]: StreamReference | undefined
	} | undefined;

	/** Set of URL's to offered services. */
	services: {
		stream_registry: string | undefined,
		federation_registry: string | undefined,
		caching_service: string | undefined,
		[key: string]: string | undefined
	} | undefined;

	/**
	 * A list of Squirrelpub IDs which this Identity knows to exist.
	 * Acts as a 'seed' for automatic federation & discovery.
	 */
	federation_anchors: string[] | undefined;

	/**
	 * Create a new Identity from the fetched & parsed JSON object.
	 */
	constructor(raw_object: object) {
		Object.assign(this, raw_object);
		if(this.squirrelpub?.type !== "identity") throw new Error(`Wrong or invalid Squirrelpub type: ${this.squirrelpub?.type}`);
	}

	/**
	 * Create a new Identity from {@link SquirrelpubPayload}
	 */
	static async fromPayload(payload: SquirrelpubPayload): Promise<Identity> {
		const ret = new Identity(JSON.parse(payload.payload));

		let verified = false;
		let imported_public_key = undefined;
		if(ret.verify_public_key) {
			imported_public_key = await importKey(ret.verify_public_key);
			verified = await payload.verify(imported_public_key)
		}
		ret.squirrelpub._request_meta = () => {return {original_url: payload.original_url, signature_resolved: payload.signature, verified: verified, imported_public_key: imported_public_key};};
		return ret;
	}

	/**
	 * Has the object been succesfully parsed. Does not mean it is a valid Squirrelpub object.
	 */
	get success(): boolean { return !!this.squirrelpub?.type && !(/^\s*$/).test(this.squirrelpub.type); }

	/**
	 * Squirrelpub object type
	 */
	get squirrelpub_type(): string { return this.squirrelpub?.type; }

	/** Optional display name for this Identity */
	get display_name(): string { return this.profile?.name ? this.profile.name : `${this.id}`; }

	/** Pretty print the type of this Identity */
	get display_identity_type(): string { return this.identity_type && this.identity_type.length > 1 ? this.identity_type[0].toUpperCase() + this.identity_type.slice(1) : ""; }

	/** Pretty print the name and ID of this Identity */
	get display_name_id(): string { return this.profile?.name ? `${this.profile?.name} (${this.id})` : `${this.id}`; }

	/** Pretty print the type, name and ID of this Identity */
	get display_full(): string { return this.display_identity_type ? `${this.display_identity_type}: ${this.display_name_id}` : this.display_name_id; }
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
	if(!id.includes(".") || id.startsWith(".") || id.endsWith(".") || id.includes("..") || (/^\s*$/).test(id))
		throw new Error("A Squirrelpub ID must be a valid domain! For example: 'example.com'");

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
	const payload = await SquirrelpubPayload.fetch(constructIdentityURL(id));
	return Identity.fromPayload(payload);
}
