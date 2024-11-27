/**
 * Squirrelpub object metadata, which is present on every squirrelpub object.
 */
export interface SquirrelpubMeta {
	/** The Squirrelpub object type */
	type: string;
	/** The Squirrelpub protocol version. */
	version: string | undefined;
	/** The URL from which a signature for this Squirrelpub object can be fetched from, if it wasn't contained in the Http headers. */
	signature: string | undefined;

	/** The URL this object was fetched from. */
	//_original_url: string | undefined;
	/** The resolved signature for this object. */
	//_signature_resolved: string | undefined;
	/** The URL this object was fetched from. */
	//_verified: boolean;
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
	 * Has the object been succesfully parsed. Does not mean it is a valid Squirrelpub object.
	 */
	get success(): boolean;

	/**
	 * Squirrelpub object type
	 */
	get squirrelpub_type(): string;
}
