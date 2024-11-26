
export const identity_valid_minimal = {
	id: "example.com",
	fetch_url: "https://squirrelpub.example.com/.squirrelpub/identity",
	json: {squirrelpub: {type: "identity",id: "example.com"},	signature: ""},
}

export const identity_invalid_minimal = {
	id: "example.com",
	fetch_url: "https://squirrelpub.example.com/.squirrelpub/identity",
	json: {squirrelpub: {type: "",id: ".com."},	signature: ""}
}

import identity_valid_full_json from "../example/.squirrelpub/identity/index.json" with { type: "json" }
export const identity_valid_full = {
	id: "john.doe.example.com",
	fetch_url: "https://squirrelpub.john.doe.example.com/.squirrelpub/identity",
	json: identity_valid_full_json
}