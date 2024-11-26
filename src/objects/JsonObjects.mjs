// @ts-check

/**
 * @memberof module:Squirrelpub
 */

export class Content {
	/**
	 * @param {object} options
	 * @param {string} options.type
	 * @param {string} options.content
	 */
	constructor(options) {
		this.type = options.type;
		this.content = options.content;
	}
}
