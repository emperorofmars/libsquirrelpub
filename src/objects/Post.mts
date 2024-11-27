import type { Content } from "./JsonObjects.mts";

/**
 * Squirrelpub Post.
 */
export interface Post {
	/**
	 * Types are arbitrary, but common ones include: 'microblog', 'imagepost', 'article', 'thread'
	 */
	type: string;

	/**
	 * URL string of a parent Message which is also a Post.
	 */
	parent: string | undefined;

	/**
	 * The content of the post
	 * 
	 * @link Content
	 */
	content: Content | undefined;
}
