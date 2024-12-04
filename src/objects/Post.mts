/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import type { Attachment, Content, StreamReference } from "./JsonObjects.mts";

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

	/** Set of Stream references which list responses & favourites of this post. {@link StreamReference} */
	interaction_streams: {
		favourites: StreamReference | undefined,
		replies: StreamReference | undefined,
		shares: StreamReference | undefined,
		[key: string]: StreamReference | undefined
	} | undefined;

	/**
	 * Support custom properties. Squirrelpub is extensible
	 */ // deno-lint-ignore no-explicit-any
	[key: string]: any;
}
