
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
		"identity_type": "user",
		"id": "john.doe.example.com",
		"public_key": {
			"type": "ed25519",
			"key": "THE CRYPTOGRAPHIC KEY",
			"url": "Or alternatively a link to the key. Only one can be present."
		},
		"alias_identities": ["john.somwhereelse.pub"],
		"profile": {
			"name": "John Doe",
			"description": {
				"content-type": "text/markdown",
				"content": "Hi, im an example user identity on Squirrelpub!"
			},
			"links": {
				{
					"name": "Mastodon",
					"url": "https://example.com/@somebody"
				},
				{
					"name": "Bluesky",
					"url": "https://bsky.app/profile/example.com"
				}
			},
			"tags": [
				{
					"type": "squirrelpub.fluffy",
					"displayname": "Fluffy",
					"value": true
				}
			]
		},
		"streams": [
			{
				"url": "https://example.github.io/squirrelpub_example/streams/test",
				"active_alias": "john.doe.example.com",
				"replications": [
					"https://backup.somewhere.else.com/atsomepath"
				]
			}
		],
		"social_graph": {
			"subscribed_public": {
				"len": 23,
				"url": "https://squirrelpub.john.doe.example.com/.squirrelpub/subscribed"
			},
			"subscribers_public": {
				"len": 24,
				"url": "https://squirrelpub.john.doe.example.com/.squirrelpub/subscribers"
			}
		}
	},
	"signature": "THE CRYPTOGRAPHIC SIGNATURE"
}
```

This identity can be easily statically hosted, including on GitHub Pages!

Simply create a file named `index.json` at the path `.squirrelpub/identity/` and throw it at the `Deploy static content to Pages` GitHub Action!

See a more complete example in this repository: [example/.squirrelpub/identity/index.json](./example/.squirrelpub/identity/index.json)

