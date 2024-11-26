// @ts-check

/**
 * @memberof module:Squirrelpub
 */

// deno-lint-ignore no-unused-vars verbatim-module-syntax
import { Content } from "./JsonObjects.mjs";

/**
 * Squirrelpub Post.
 */
export class Post {
	/**
	 * @param {object} options
	 * @param {string} options.type
	 * @param {string | undefined} options.parent
	 * @param {Content | undefined} options.content
	 */
	constructor(options)
	{
		this.type = options.type;
		this.parent = options.parent;
		this.content = options.content;
	}
}
