import type { Identity } from "../libsquirrelpub.mts";
import { importKey } from "../util/Crypto.mts";
import type { Post } from './Post.mts';
import type { SquirrelpubMeta, SquirrelpubBase } from './SquirrelpubBase.mts';
import type { SquirrelpubPayload } from "./SquirrelpubPayload.mts";

/**
 * A Squirrelpub Message.
 * 
 * It can describe a Post (like 'microblog') or a Command (like 'delete').
 */
export class Message implements SquirrelpubBase {
	/**
	 * The squirrelpub object contains the squirrelpub type, version and optional URL to retrieve the signature of the original payload, if not present in the http header.
	 */
	squirrelpub!: SquirrelpubMeta;

	/** Types can be: 'post', 'command' */
	message_type!: string;

	/** Message ID, used in constructing the url in the Stream to access this Message. */
	id!: number | string;

	/** Squirrelpub ID of the owner Identity. */
	owner_id!: string;
	
	/** Date and time of the creation of this message as ISOString. */
	timestamp!: string;
	
	/** The stream this Message is part of. */
	stream!: string;
	
	/** If the message_type is 'post', get the Post. */
	post: Post | undefined;

	/**
	 * Create a new Message from the fetched & parsed JSON object.
	 */
	constructor(raw_object: object) {
		Object.assign(this, raw_object);
		if(this.squirrelpub?.type !== "message") throw new Error(`Wrong or invalid Squirrelpub type: ${this.squirrelpub?.type}`);
	}

	/**
	 * Create a new Message from {@link SquirrelpubPayload}
	 */
	static async fromPayload(payload: SquirrelpubPayload, identity: Identity | undefined = undefined): Promise<Message> {
		const ret = new Message(JSON.parse(payload.payload));

		let verified = false;
		if(identity && identity.verify_public_key) {
			verified = await payload.verify(await importKey(identity.verify_public_key))
		}
		ret.squirrelpub._request_meta = () => {return {original_url: payload.original_url, signature_resolved: payload.signature, verified: verified};};
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
}

