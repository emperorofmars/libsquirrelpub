/**
 * This library will fetch Squirrelpub objects.
 * 
 * Example on how to fetch an 'Identity', the central object in Squirrelpub:
 * ``` ts
 * import squirrelpub from "@squirrelpub/libsquirrelpub";
 * 
 * const identity = await squirrelpub.fetchIdentity("example.com");
 * console.log(identity.display_name_id);
 * ```
 * 
 * Example on how to fetch an Identities 'Stream', and then the latest 10 messages from the Stream:
 * ``` ts
 * const stream = await squirrelpub.fetchStream(identity.stream);
 * const page = await squirrelpub.fetchPage(stream, 0, 10);
 * for(const message in page) console.log(message);
 * ```
 */

export * from "./objects/JsonObjects.mts";
export * from "./objects/SquirrelpubBase.mts";
export * from './objects/Identity.mts';
export * from './objects/Stream.mts';
export * from './objects/Message.mts';
export * from './objects/Post.mts';
