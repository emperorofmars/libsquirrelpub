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
		let response = await fetch(final_url);
		if(!response.ok) {
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
		if(!response.ok) {
			return Promise.reject("Could not fetch Squirrelpub object!");
		}
		let signature = response.headers.get("SQUIRRELPUB_SIGNATURE");
		if(!signature) {
			if(!verify_url) {
				if(final_url.toString().endsWith(".json")) {
					verify_url = final_url.toString().slice(0, final_url.toString().length - 5) + ".verify.txt";
				} else {
					verify_url = final_url.toString() + (final_url.toString().endsWith("/") ? "" : "/") + "verify.txt";
				}
			}
			signature = await fetch(verify_url).then(response => response.text()).catch(null);
		}
		return new SquirrelpubPayload(await response.text(), url.toString(), signature ? signature : undefined);
	}

	async verify(public_key: CryptoKey, signature: string | undefined = undefined): Promise<boolean> {
		const used_signature = signature ? signature : this.signature;
		return used_signature ? await verifyString(this.payload, public_key, used_signature) : false;
	}

	async verify_from_identity(identity: Identity, signature: string | undefined = undefined): Promise<boolean> {
		const used_signature = signature ? signature : this.signature;
		if(identity.verify_public_key && used_signature ) {
			const key = await importKey(identity.verify_public_key);
			await verifyString(this.payload, key, used_signature)
		}
		return false;
	}
}
