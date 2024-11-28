import type { Attachment, Content } from "./JsonObjects.mts";

/**
 * 
 */
export interface InteractionGraph {
	/** URL to retrieve an object describing Identities which favourited this object. */
	favourites: string | undefined;
	/** URL to retrieve an object describing posts which set this one as their parent. */
	replies: string | undefined;
	/** URL to retrieve an object describing posts which set this one as an attachment. */
	shares: string | undefined;
}

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

	/**
	 * Any attached content, like images, for this post
	 * 
	 * @link Attachment
	 */
	attachment: Attachment[] | undefined;

	/**
	 * URLs of Squirrelpub lists linking responses & favourites of this post.
	 * 
	 * @link InteractionGraph
	 */
	social_graph: InteractionGraph | undefined;
	
	/**
	 * Support custom properties. Squirrelpub is extensible
	 */ // deno-lint-ignore no-explicit-any
	[key: string]: any;
}
