// @ts-check

/**
 * @memberof module:Squirrelpub
 */

/**
 * The base Squirrelpub object.
 */
export class SquirrelpubBase {
	/**
	 * @type {any} Squirrelpub object. Its JSON representation is what is to be signed.
	 * @readonly
	 */
	squirrelpub;

	/**
	 * @type {string} Cryptographic signature of the squirrelpub object
	 * @readonly
	 */
	signature;

	/**
	 * @type {string} The URL this object was fetched from
	 * @readonly
	 */
	original_url;

	/**
	 * @param {any} raw_squirrelpub_object - Parsed JSON
	 * @param {string} original_url - The URL this object was fetched from
	 */
	constructor(raw_squirrelpub_object, original_url) {
		this.squirrelpub = raw_squirrelpub_object.squirrelpub;
		this.signature = raw_squirrelpub_object.signature;
		this.original_url = original_url;
	}

	/** @type {boolean} */
	get success() { return this.squirrelpub != null && this.squirrelpub.type != null && !(/^\s*$/).test(this.squirrelpub.type); }

	/** @type {string} Squirrelpub object type */
	get type() { return this.squirrelpub.type; }
}
