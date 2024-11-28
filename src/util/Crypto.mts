
/**
 * Import a Squirrelpub JsonWebKey.
 */
export async function importKey(json_key: JsonWebKey): Promise<CryptoKey> {
	return await crypto.subtle.importKey("jwk", json_key, { name: "Ed25519" }, true, json_key.key_ops as KeyUsage[]);
}

/**
 * Sign a Squirrelpub object read from the network or filesystem.
 */
export async function signString(string_to_sign: string, private_key: CryptoKey): Promise<string> {
	const signature_buffer = await crypto.subtle.sign(private_key.algorithm, private_key, new TextEncoder().encode(string_to_sign));
	return btoa(String.fromCharCode(...new Uint8Array(signature_buffer)));
}

/**
 * Verify a Squirrelpub object as read from the network or filesystem.
 */
export async function verifyString(string_to_verify: string, public_key: CryptoKey, signature: string): Promise<boolean> {
	const signature_array = Uint8Array.from(atob(signature), c => c.charCodeAt(0));
	return await crypto.subtle.verify(public_key.algorithm, public_key, signature_array, new TextEncoder().encode(string_to_verify));
}
