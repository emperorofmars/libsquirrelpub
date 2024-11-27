
export const identity_valid_minimal = {
	id: "example.squirrelpub.com",
	fetch_url: "https://squirrelpub.example.squirrelpub.com/.squirrelpub/identity",
	json: {squirrelpub: {type: "identity"},id: "example.squirrelpub.com"}
}

export const identity_invalid_minimal = {
	id: "example.squirrelpub.com",
	fetch_url: "https://squirrelpub.example.squirrelpub.com/.squirrelpub/identity",
	json: {squirrelpub: {},id: ".com."}
}

import identity_valid_full_json from "../example/.squirrelpub/identity/index.json" with { type: "json" }
export const identity_valid_full = {
	id: "example.squirrelpub.com",
	fetch_url: "https://squirrelpub.example.squirrelpub.com/.squirrelpub/identity",
	json: identity_valid_full_json
}

export const stream_valid_minimal = {
	fetch_url: "https://example.squirrelpub.com/stream",
	json: {
		squirrelpub: {
			type: "stream"
		},
		stream_name: "Main",
		url_base: "https://example.squirrelpub.com/stream/",
		latest: 1,
		url_suffix: ".json",
		owner_id: "example.squirrelpub.com",
		subscribe: false,
		min_poll_interval: 600000,
		replications: [
			"https://backup.somewhere.else.com/atsomepath"
		]
	}
}

export const stream_invalid_minimal = {
	fetch_url: "https://example.squirrelpub.com/stream",
	json: {
		squirrelpub: {
			type: "stre"
		},
		stream_name: "Main",
		url_base: "https://example.squirrelpub.com/stream/",
		latest: 1,
		url_suffix: ".json",
		owner_id: "john.doe.example.com",
		subscribe: false,
		min_poll_interval: 600000,
		replications: [
			"https://backup.somewhere.else.com/atsomepath"
		]
	}
}

export const message_valid_minimal = {
	fetch_url: "https://example.squirrelpub.com/stream/1.json",
	json: {
		squirrelpub: {
			type: "message"
		},
		message_type: "post",
		id: 1,
		owner_id: "john.doe.example.com",
		stream: "https://example.squirrelpub.com/stream",
		timestamp: "1732564679",
		post: {
			type: "microblog",
			parent: null,
			content: {
				type: "text/markdown",
				content: "Hello World!"
			}
		}
	}
}

export const test_identity_public_key = {
	kty: "OKP",
	crv: "Ed25519",
	x: "CDngu4mHq5J1fgYbw2gUWQGUAEe4CaapZfeqoAtF2Bg",
	key_ops: [ "verify" ],
	ext: true
}
export const test_identity_private_key = {
	kty: "OKP",
	crv: "Ed25519",
	x: "CDngu4mHq5J1fgYbw2gUWQGUAEe4CaapZfeqoAtF2Bg",
	key_ops: [ "sign" ],
	ext: true,
	d: "fyr0V6jwpuK8oA8FbgWkDLUsWlXItDc5oxStCTZ5xRA"
}
