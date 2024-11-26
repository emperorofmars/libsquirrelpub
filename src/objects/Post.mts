/**
 * @memberof module:Squirrelpub
 */

import type { Content } from "./JsonObjects.mts";

/**
 * Squirrelpub Post.
 */
export class Post {
	/**
	 * Types are arbitrary, but common ones include: 'microblog', 'imagepost', 'article', 'thread'
	 */
	type: string;

	/**
	 * URL string of a parent Message which is also a Post.
	 */
	parent: string | undefined;

	content: Content | undefined;
	
	constructor(options: { type: string; parent: string | undefined; content: Content | undefined; })
	{
		this.type = options.type;
		this.parent = options.parent;
		this.content = options.content;
	}
}
