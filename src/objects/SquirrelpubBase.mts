/**
 * The base Squirrelpub object.
 */
export abstract class SquirrelpubBase {
	/**
	 * Squirrelpub object. Its JSON representation is what is to be signed.
	 */
	// deno-lint-ignore no-explicit-any
	readonly squirrelpub: any;

	/**
	 * Cryptographic signature of the squirrelpub object
	 */
	readonly signature: string;

	/**
	 * The URL this object was fetched from
	 */
	readonly original_url: string;

	/**
	 * Initialize the SquirrelpubBase object from the fetched & parsed JSON object.
	 * 
	 * @param {any} raw_squirrelpub_object - Parsed JSON
	 * @param {string} original_url - The URL this object was fetched from
	 */
	// deno-lint-ignore no-explicit-any
	constructor(raw_squirrelpub_object: any, original_url: string) {
		this.squirrelpub = raw_squirrelpub_object.squirrelpub;
		this.signature = raw_squirrelpub_object.signature;
		this.original_url = original_url;
	}

	/**
	 * Has the object been succesfully parsed. Does not mean it is a valid Squirrelpub object.
	 */
	get success(): boolean { return this.squirrelpub != null && this.squirrelpub.type != null && !(/^\s*$/).test(this.squirrelpub.type); }

	/**
	 * Squirrelpub object type
	 */
	get type(): string { return this.squirrelpub.type; }
}
