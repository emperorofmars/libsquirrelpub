/**
 * @memberof module:Squirrelpub
 */

import { Message } from './Message.mts';
import { SquirrelpubBase } from './SquirrelpubBase.mts';

/**
 * Squirrelpub Stream. Represents a history of Messages
 */
export class Stream extends SquirrelpubBase {
	/**
	 * @param {any} raw_squirrelpub_object - Parsed JSON
	 * @param {string} original_url - The URL this object was fetched from
	 */
	// deno-lint-ignore no-explicit-any
	constructor(raw_squirrelpub_object: any, original_url: string) {
		super(raw_squirrelpub_object, original_url);
		if(this.type != "stream") throw new Error("Squirrelpub object is not a Stream!");

		// TODO implement json schema validation
	}

	/** Optional display-name for this Stream. */
	get stream_name(): string | undefined { return this.squirrelpub.stream_name; }
	
	/** The ID of the latest Message which is part of the main history. */
	get latest(): number { return this.squirrelpub.latest; }

	/** The first part of an URL to retrieve a Message. */
	get url_base(): string  { return this.squirrelpub.url_base; }

	/** The last part of an URL to retrieve a Message. */
	get url_suffix(): string { return this.squirrelpub.url_suffix ? this.squirrelpub.url_suffix : ""; }

	/** Squirrelpub ID of the Identity which owns this Stream */
	get owner_id(): string { return this.squirrelpub.owner_id; }

	/**
	 * URL endpoint to which a server may subscribe to updates from this Stream.
	 * This endpoint doesn't have to exist.
	 * In that case use periodic polling instead.
	 */
	get subscribe(): string | boolean | undefined { return this.squirrelpub.subscribe; }

	/** The minimum intervall this Stream can be polled. */
	get min_poll_interval(): number { return this.squirrelpub.min_poll_interval; }

	/** Streams which replicate this one. */
	get replications(): string[] { return this.squirrelpub.replications ? this.squirrelpub.replications : []; }


	/** The approximate number of messages in the main history of this Stream. */
	get len_approximate(): number { return this.squirrelpub.latest ? this.squirrelpub.latest + 1 : 0; }

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
	return new Stream(await fetch(url).then(response => response.json()), url);
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
		const response = await fetch(url).then(response => response.json()).then(json => new Message(json, url)).catch(null);
		if(response) ret.push(response);
		/*const message = new Message(await fetch(url).then(response => response.json()).catch(return null), url);
		ret.push(message);*/
	}
	return ret;
}
