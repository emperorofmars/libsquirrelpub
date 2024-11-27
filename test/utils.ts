import { spy } from "@std/testing/mock";

export function fetchSpy(resolveValue: BodyInit | null) {
	const ret = spy((_url: string | URL | Request) => new Promise<Response>((resolve, _reject) => { resolve(new Response(resolveValue)); }));
	globalThis.fetch = ret;
	return ret;
}

// deno-lint-ignore no-explicit-any
export function fetchRejectSpy(rejectReason: any) {
	const ret = spy((_url: string | URL | Request) => new Promise<Response>((_resolve, reject) => { reject(rejectReason); }));
	globalThis.fetch = ret;
	return ret;
}

// deno-lint-ignore no-explicit-any
export function fetchCallbackSpy(fn: (resolve: (value: Response | PromiseLike<Response>) => void, reject: (reason?: any) => void) => void) {
	const ret = spy((_url: string | URL | Request) => new Promise<Response>((resolve, reject) => fn(resolve, reject)));
	globalThis.fetch = ret;
	return ret;
}

// deno-lint-ignore no-explicit-any
export function fetchSequenceSpy<T>(sequence: any[]) {
	let index = 0;
	// deno-lint-ignore no-explicit-any
	const spyFn = (resolve: (value: Response | PromiseLike<Response>) => void, _reject: (reason?: any) => void)  => {
		if(index < sequence.length) resolve(new Response(sequence[index]));
		else resolve(new Response("null"));
		index++;
	}
	return fetchCallbackSpy(spyFn);
}