// @ts-check

/**
 * @memberof module:Squirrelpub
 */

// deno-lint-ignore no-unused-vars verbatim-module-syntax
import { Post } from './Post.mjs';
import { SquirrelpubBase } from './SquirrelpubBase.mjs';


export class Message extends SquirrelpubBase {
	/**
	 * @param {any} raw_squirrelpub_object - Parsed JSON
	 * @param {string} original_url - The URL this object was fetched from
	 */
	constructor(raw_squirrelpub_object, original_url) {
		super(raw_squirrelpub_object, original_url);
		if(this.type != "message") throw new Error("Squirrelpub object is not a Message!");

		// TODO implement json schema validation
	}
	
	/** @type {string} */
	get message_type() { return this.squirrelpub.message_type; }
	
	/** @type {number | string} */
	get id() { return this.squirrelpub.id; }

	/** @type {string} */
	get owner_id() { return this.squirrelpub.owner_id; }
	
	/** @type {string} Date and time as ISOString*/
	get timestamp() { return this.squirrelpub.parent; }
	
	/** @type {string} */
	get stream() { return this.squirrelpub.stream; }
	
	/** @type {Post} */
	get post() { return this.squirrelpub.post; }
}

