import { verifyString } from "../util/Crypto.mts";

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
	static async fetch(url: URL | string): Promise<SquirrelpubPayload> {
		const response = await fetch(url);
		let signature = response.headers.get("SQUIRRELPUB_SIGNATURE");
		if(!signature) signature = await fetch(url.toString() + ".verify").then(response => response.text()).catch(null);
		return new SquirrelpubPayload(await response.text(), url.toString(), signature ? signature : undefined);
	}

	async verify(public_key: CryptoKey): Promise<boolean> {
		return this.signature ? await verifyString(this.payload, public_key, this.signature) : false;
	}
}