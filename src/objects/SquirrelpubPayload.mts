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
	static async fetch(url: URL | string, verify_url: URL | string | undefined = undefined): Promise<SquirrelpubPayload> {
		const response = await fetch(url);
		let signature = response.headers.get("SQUIRRELPUB_SIGNATURE");
		if(!signature) {
			if(verify_url) signature = await fetch(verify_url).then(response => response.text()).catch(null);
			else signature = await fetch(url + "/verify.txt").then(response => response.text()).catch(null);
		}
		return new SquirrelpubPayload(await response.text(), url.toString(), signature ? signature : undefined);
	}

	async verify(public_key: CryptoKey, signature: string | undefined = undefined): Promise<boolean> {
		const used_dignature = signature ? signature : this.signature;
		return used_dignature ? await verifyString(this.payload, public_key, used_dignature) : false;
	}
}
