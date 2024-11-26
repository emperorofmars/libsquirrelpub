/**
 * @memberof module:Squirrelpub
 */

import type { Post } from './Post.mts';
import { SquirrelpubBase } from './SquirrelpubBase.mts';

/**
 * A Squirrelpub Message.
 * 
 * It can describe a Post (like 'microblog') or a Command (like 'delete').
 */
export class Message extends SquirrelpubBase {
	/**
	 * @param {any} raw_squirrelpub_object - Parsed JSON
	 * @param {string} original_url - The URL this object was fetched from
	 */
	// deno-lint-ignore no-explicit-any
	constructor(raw_squirrelpub_object: any, original_url: string) {
		super(raw_squirrelpub_object, original_url);
		if(this.type != "message") throw new Error("Squirrelpub object is not a Message!");

		// TODO implement json schema validation
	}
	
	/** Types can be: 'post', 'command' */
	get message_type(): string { return this.squirrelpub.message_type; }
	
	/** Message ID, used in constructing the url in the Stream to access this Message. */
	get id(): number | string { return this.squirrelpub.id; }

	/** Squirrelpub ID of the owner Identity. */
	get owner_id(): string { return this.squirrelpub.owner_id; }
	
	/** Date and time of the creation of this message as ISOString. */
	get timestamp(): string { return this.squirrelpub.timestamp; }
	
	/** The stream this Message is part of. */
	get stream(): string { return this.squirrelpub.stream; }
	
	/** If the message_type is 'post', get the Post. */
	get post(): Post { return this.squirrelpub.post; }
}

