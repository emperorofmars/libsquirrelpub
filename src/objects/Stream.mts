import { importKey } from "../util/Crypto.mts";
import type { Identity } from "./Identity.mts";
import { Message } from './Message.mts';
import type { SquirrelpubMeta, SquirrelpubBase } from './SquirrelpubBase.mts';
import { SquirrelpubPayload } from "./SquirrelpubPayload.mts";

/**
 * Squirrelpub Stream. Represents a history of Messages
 */
export class Stream implements SquirrelpubBase {
	/**
	 * The Squirrelpub object contains the squirrelpub type, version and optional URL to retrieve the signature of the original payload, if not present in the http header.
	 */
	squirrelpub!: SquirrelpubMeta;
	
	/**
	 * Support custom properties. Squirrelpub is extensible
	 */ // deno-lint-ignore no-explicit-any
	[key: string]: any;
	
	/** Optional display-name for this Stream. */
	stream_name: string | undefined;

	/** The ID of the latest Message which is part of the main history. */
	latest!: number;

	/** The first part of an URL to retrieve a Message. */
	url_base!: string;

	/** The last part of an URL to retrieve a Message. */
	url_suffix: string | undefined;

	/** Squirrelpub ID of the Identity which owns this Stream */
	owner_id!: string;
	
	/**
	 * URL endpoint to which a server may subscribe to updates from this Stream.
	 * This endpoint doesn't have to exist.
	 * In that case use periodic polling instead.
	 */
	subscribe: string | boolean | undefined;
	
	/** The minimum intervall this Stream can be polled. */
	min_poll_interval: number | undefined;
	
	/** Streams which replicate this one. */
	replications: string[] | undefined;

	/**
	 * Create a new Stream from the fetched & parsed JSON object.
	 */
	constructor(raw_object: object) {
		Object.assign(this, raw_object);
		if(this.squirrelpub?.type !== "stream") throw new Error(`Wrong or invalid Squirrelpub type: ${this.squirrelpub?.type}`);
	}

	/**
	 * Create a new Stream from {@link SquirrelpubPayload}
	 */
	static async fromPayload(payload: SquirrelpubPayload, identity: Identity | undefined = undefined): Promise<Stream> {
		const ret = new Stream(JSON.parse(payload.payload));

		let verified = false;
		if(identity && identity.verify_public_key) {
			verified = await payload.verify(await importKey(identity.verify_public_key))
		}
		ret.squirrelpub._request_meta = () => {return {original_url: payload.original_url, signature_resolved: payload.signature, verified: verified};};
		return ret;
	}

	/**
	 * Has the object been succesfully parsed. Does not mean it is a valid Squirrelpub object.
	 */
	get success(): boolean { return !!this.squirrelpub?.type && !(/^\s*$/).test(this.squirrelpub.type); }

	/**
	 * Squirrelpub object type
	 */
	get squirrelpub_type(): string { return this.squirrelpub?.type; }

	/** The approximate number of messages in the main history of this Stream. */
	get len_approximate(): number { return this.latest ? this.latest + 1 : 0; }

	/**
	 * Construct an URL from which a Message based on its ID can be fetched.
	 * 
	 * @param {number | string} id - The ID of the Message
	 * @returns {string} - URL string to fetch the Message from
	 */
	constructMessageUrl(id: number | string): string {
		return `${this.url_base}${id}${this.url_suffix}`;
	}
}

/**
 * Fetch a Squirrelpub Stream
 * 
 * @throws If the fetch failed
 */
export async function fetchStream(url: string): Promise<Stream> {
	return Stream.fromPayload(await SquirrelpubPayload.fetch(url));
}


/**
 * Fetch a set of Messages from a Squirrelpub Stream
 * 
 * @throws If the fetch failed
 * 
 * @todo Use a fork-join if the stream is statically hosted, otherwise devise a more legit API.
 */
export async function fetchPage(stream: Stream, page: number, page_size: number = 10): Promise<Message[]> {
	const ret = [];
	for(let i = 0; i < page_size; i++)
	{
		const index = stream.latest - (page * page_size + i);
		if(index < 0) break;
		const url = stream.constructMessageUrl(index);
		const response = await fetch(url).then(response => response.json()).then(json => new Message(json)).catch(null);
		if(response) ret.push(response);
	}
	return ret;
}
