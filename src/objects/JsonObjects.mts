/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

/**
 * URL of a Squirrelpub stream and an optionl list of URLs where this Stream is being replicated.
 */
export interface StreamReference {
	url: string;
	replications: string[] | undefined;
}

/**
 * Describes the content of something to be displayed, like a post, or a profile description.
 */
export interface Content {
	/** The content-type. Squirrelpub uses 'text/markdown' by default */
	type: string;
	/** The actual content in the format specified in `type`. */
	content: string;
}

/**
 * Represents an attachment like an image or video.
 */
export interface Attachment {
	/** The content-type. For example 'image/webp'. */
	type: string;
	/** URL to fetch the object. */
	url: string;
}
