/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { importKey, verifyString } from "../util/Crypto.mts";
import type { Identity } from "./Identity.mts";

/**
 * Fetches and represents a raw squirrelpub object, and tries to verify its signature.
 *
 * Specific Squirrelpub objects can be constructed from this.
 */
export class SquirrelpubPayload {

	/** The raw fetched JSON text, ready to be validated against its signature. */
	readonly payload: string;

	/** The URL this object was fetched from. */
	readonly original_url: string;

	/** The signature for this object. */
	readonly signature: string | undefined;

	constructor(payload: string, original_url: string, signature: string | undefined) {
		this.payload = payload;
		this.original_url = original_url;
		this.signature = signature;
	}

	/**
	 * Fetch a Squirrelpub object from the given @param url
	 *
	 * @throws If the fetch failed
	 */
	static async fetch(url: URL | string, verify_url: URL | string | undefined = undefined): Promise<SquirrelpubPayload> {
		let final_url = url;

		// Try to fetch url directly. If the server is not static, this should just work. In the case of static hosting, this may not work.
		let response = await fetch(final_url);
		if(!response.ok) {
			// If the first fetch failed, attempt to fetch from url + 'index.json' or url + '.json'
			await response.body?.cancel();
			if(url.toString().endsWith("/")) {
				final_url = url.toString() + (url.toString().endsWith("/") ? "" : "/") + "index.json";
			} else if(!url.toString().endsWith(".json")) {
				final_url = url.toString() + ".json";
			} else {
				throw Promise.reject("could not fetch Squirrelpub object!");
			}
			response = await fetch(final_url);
		}

		// If the object could not be fetched, its a fail.
		if(!response.ok) {
			return Promise.reject("Could not fetch Squirrelpub object!");
		}
		const payload = await response.text();

		// If the server is not static, the signature for the fetched object should be in this header.
		let signature = response.headers.get("SQUIRRELPUB_SIGNATURE");

		// in the case of static hosting, fetch the signature.
		if(!signature) {
			if(!verify_url) {
				if(final_url.toString().endsWith(".json")) {
					// If the path ends with something like 'identity.json', replace the end with 'identity.verify.txt'.
					verify_url = final_url.toString().slice(0, final_url.toString().length - 5) + ".verify.txt";
				} else {
					// Otherwise assume the fetched object is the index of the path. The verify file must sit in that folder and be named 'verify.txt'
					verify_url = final_url.toString() + (final_url.toString().endsWith("/") ? "" : "/") + "verify.txt";
				}
			}
			signature = await fetch(verify_url).then(response => response.text()).catch(null);
		}
		return new SquirrelpubPayload(payload, url.toString(), signature ? signature : undefined);
	}

	/**
	 * Check if this objects signature is valid, with a manually provided key.
	 */
	async verify(public_key: CryptoKey, signature: string | undefined = undefined): Promise<boolean> {
		const used_signature = signature ? signature : this.signature;
		return used_signature ? await verifyString(this.payload, public_key, used_signature) : false;
	}

	/**
	 * Check if this objects signature is valid and belongs to the provided identity.
	 */
	async verify_from_identity(identity: Identity, signature: string | undefined = undefined): Promise<boolean> {
		const used_signature = signature ? signature : this.signature;
		if(identity.verify_public_key && used_signature) {
			const key = identity.squirrelpub._request_meta().imported_public_key ? identity.squirrelpub._request_meta().imported_public_key : await importKey(identity.verify_public_key);
			if(key) return await verifyString(this.payload, key, used_signature)
		}
		return false;
	}
}
