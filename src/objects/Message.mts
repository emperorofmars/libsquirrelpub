/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import type { Identity } from "../libsquirrelpub.mts";
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

	/**
	 * Support custom properties. Squirrelpub is extensible
	 */ // deno-lint-ignore no-explicit-any
	[key: string]: any;

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

		const verified = identity ? await payload.verify_from_identity(identity) : false;
		ret.squirrelpub._request_meta = () => {return {original_url: payload.original_url, signature_resolved: payload.signature, verified: verified, imported_public_key: undefined};};
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

