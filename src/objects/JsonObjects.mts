/**
 * @memberof module:Squirrelpub
 */

/**
 * Describes the content of something to be displayed, like a post, or a profile description.
 */
export interface Content {
	/** The content-type. Squirrelpub uses 'text/markdown' by default */
	type: string;
	/** The actual content in the format specified in `type`. */
	content: string;
}
