// @ts-check

/**
 * @memberof module:Squirrelpub
 */

import { Message } from './Message.mjs';
import { SquirrelpubBase } from './SquirrelpubBase.mjs';

/**
 * Squirrelpub Stream.
 */
export class Stream extends SquirrelpubBase {
	/**
	 * @param {any} raw_squirrelpub_object - Parsed JSON
	 * @param {string} original_url - The URL this object was fetched from
	 */
	constructor(raw_squirrelpub_object, original_url) {
		super(raw_squirrelpub_object, original_url);
		if(this.type != "stream") throw new Error("Squirrelpub object is not a Stream!");

		// TODO implement json schema validation
	}

	/** @type {string} */
	get stream_name() { return this.squirrelpub.stream_name; }
	
	/** @type {number} */
	get latest() { return this.squirrelpub.latest; }

	/** @type {string} */
	get url_base() { return this.squirrelpub.url_base; }

	/** @type {string} */
	get url_suffix() { return this.squirrelpub.url_suffix ? this.squirrelpub.url_suffix : ""; }

	/** @type {string} */
	get owner_id() { return this.squirrelpub.owner_id; }

	/** @type {string | boolean | undefined} */
	get subscribe() { return this.squirrelpub.subscribe; }

	/** @type {number | undefined} */
	get min_poll_interval() { return this.squirrelpub.min_poll_interval; }

	/** @type {string[]} */
	get replications() { return this.squirrelpub.replications ? this.squirrelpub.replications : []; }


	/** @type {number} */
	get len() { return this.squirrelpub.latest ? this.squirrelpub.latest + 1 : 0; }

	/**
	 * @param {number} id
	 * @returns {string}
	 */
	constructMessageUrl(id) {
		return `${this.url_base}/${id}${this.url_suffix}`;
	}
}


/**
 * Fetch a squirrelpub identity by its id (domain without the 'squirrelpub' hostname prefixed)
 * 
 * @param {string} url - URL to fetch from
 * @returns {Promise<Stream>} The squirrelpub identity if found
 * @throws If the fetch failed
 */
export async function fetchStream(url) {
	return new Stream(await fetch(url).then(response => response.json()), url);
}


/**
 * @param {Stream} stream
 * @param {number} page
 * @param {number} page_size
 * @returns {Promise<Message[]>}
 * @throws If the fetch failed
 */
export async function fetchPage(stream, page, page_size = 10) {
	const ret = [];
	for(let i = 0; i < page_size; i++)
	{
		const index = stream.latest - (page * page_size + i);
		if(index < 0) break;
		const url = stream.constructMessageUrl(index);// .url + "/" + index + ".json";
		const message = new Message(await fetch(url).then(response => response.json()), url);
		ret.push(message);
	}
	return ret;
}
