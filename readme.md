
# Squirrelpub

What if ActivityPub and ATProto smoked crack and had an ugly child which they forced to be statically hostable? 

Squirrelpub is a not serious and purely experimental federated social protocol.

This is a JS/TS library built in Deno 2 for fetching and working with Squirrelpub objects.

A weekend experiment mostly to (re)familiarize myself with the JS/TS ecosystem. I am making also a frontend app with React, and at some point also a backend, likely with Express.

I like services like Mastodon & the Fediverse and such, but to put it lightly, they have issues, including total UX failures. I'm experimenting with ways to alleviate these, while making it stupidly easy to self-host your own social-media profile and content.

## How It Works
Your ID is a domain hostname, for example `john.doe.example.com`.

You have to prefix `squirrelpub.` to the ID in order to get the final hostname.\
The final hostname bocomes `squirrelpub.john.doe.example.com` in this example.

In order to fetch the identity, do a `Https GET` request to the Squirrelpub endpoint like so:
```
https://squirrelpub.john.doe.example.com/.squirrelpub/identity
```
The response will be the Squirrelpub identity object.
``` json
{
	"squirrelpub": {
		"type": "identity",
		"version": "0.0.5",
		"signature": "https://example.squirrelpub.com/.squirrelpub/identity.verify"
	},
	"identity_type": "user",
	"id": "example.squirrelpub.com",
	"public_key": {
		"kty": "OKP",
		"crv": "Ed25519",
		"x": "2zedMdcc904ZEoelhu5QFR1euYrEXegDF5F7Mwj49HY",
		"key_ops": [ "verify" ],
		"ext": true
	},
	"past_verify_public_keys": "https://example.squirrelpub.com/.squirrelpub/past_public_keys",
	"past_public_keys": "https://example.squirrelpub.com/.squirrelpub/past_public_keys",
	"alias_identities": ["john.somwhereelse.pub"],
	"primary_alias": "example.squirrelpub.com",
	"created_timestamp": "2024-11-06T02:56:19.767Z",
	"profile": {
		"name": "Example Squirrelpub Identity",
		"description": {
			"type": "text/markdown",
			"content": "Hi\nI'm an example **Identity** on **Squirrelpub**!"
		},
		"links": [
			{
				"name": "GitHub",
				"url": "https://github.com/emperorofmars/libsquirrelpub"
			}
		],
		"tags": [
			{
				"type": "squirrelpub.fluffy",
				"displayname": "Fluffy",
				"value": true
			},
			{
				"type": "squirrelpub.fursone_species",
				"name": "Species",
				"value": "Squirrel"
			},
			{
				"type": "scom.quirrelpub.pronouns",
				"name": "Pronouns",
				"value": "example/test"
			}
		]
	},
	"stream": "https://example.squirrelpub.com/.squirrelpub/stream/test",
	"stream_replications": [
		"https://backup.somewhere.else.com/atsomepath"
	],
	"social_graph": {
		"subscribed_stream": "https://example.squirrelpub.com/.squirrelpub/graph/subscribed",
		"subscribers_stream": "https://example.squirrelpub.com/.squirrelpub/graph/subscribers",
		"deny_stream": "https://example.squirrelpub.com/.squirrelpub/graph/deny"
	},
	"stream_registry": "https://example.squirrelpub.com/.squirrelpub/stream_registry",
	"federation_registry": "https://example.squirrelpub.com/.squirrelpub/federation_registry",
	"caching_service": "https://example.squirrelpub.com/.squirrelpub/cache_service",
	"federation_anchors": [
		"example.squirrelpub.com",
		"squirrelpub.com",
		"example.com"
	]
}
```

This identity can be easily statically hosted, including on GitHub Pages!

Simply create a file named `index.json` at the path `.squirrelpub/identity/` and throw it at the `Deploy static content to Pages` GitHub Action!

See a more complete example in this repository: [example/.squirrelpub/identity/index.json](./example/.squirrelpub/identity/index.json)

