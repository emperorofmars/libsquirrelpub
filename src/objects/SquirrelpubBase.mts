/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

/**
 * Squirrelpub object metadata, which is present on every squirrelpub object.
 */
export interface SquirrelpubMeta {
	/** The Squirrelpub object type */
	type: string;
	/** The Squirrelpub protocol major version. */
	version_major: number | undefined;
	/** The Squirrelpub protocol minor version. */
	version_minor: number | undefined;
	/** The URL from which a signature for this Squirrelpub object can be fetched from, if it wasn't contained in the Http headers. */
	signature: string | undefined;

	/**
	 * Function which returns info about the Squirrelpub object like wether its original payload was successfully verified.
	 * Its a function so that this data doesn't get stringified.
	 */
	_request_meta: (() => {original_url: string | undefined, signature_resolved: string | undefined, verified: boolean, imported_public_key: CryptoKey | undefined});
}

/**
 * The base Squirrelpub object.
 */
export interface SquirrelpubBase {
	/**
	 * The Squirrelpub object contains the squirrelpub type, version and optional URL to retrieve the signature of the original payload, if not present in the http header.
	 */
	squirrelpub: SquirrelpubMeta;

	/**
	 * Support custom properties. Squirrelpub is extensible
	 */ // deno-lint-ignore no-explicit-any
	[key: string]: any;

	/**
	 * Has the object been succesfully parsed. Does not mean it is a valid Squirrelpub object.
	 */
	get success(): boolean;

	/**
	 * Squirrelpub object type
	 */
	get squirrelpub_type(): string;
}
