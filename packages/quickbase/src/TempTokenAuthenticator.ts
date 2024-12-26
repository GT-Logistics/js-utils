import ky, {BeforeRequestHook} from "ky";
import {TempToken} from "./interfaces.js";

export default function (appToken: string): BeforeRequestHook {
    return async function (request, options): Promise<void> {
        const clonedRequest = request.clone(); // We can't touch the original body of the request
        const url = new URL(clonedRequest.url);
        const payload = await clonedRequest.json();
        const table = payload.from || payload.to || url.searchParams.get('tableId') || url.searchParams.get('appId');

        const headers = new Headers(options.headers);
        headers.set('QB-App-Token', appToken);

        const token = await ky.post(`auth/temporary/${table}`, {
            ...options,
            headers,
            credentials: 'include',
            hooks: {}, // Disable hooks to obtain an untainted request
        }).json<TempToken>();
        const authorization = token.temporaryAuthorization;

        request.headers.append('Authorization', `QB-TEMP-TOKEN ${authorization}`);
    } as BeforeRequestHook;
}
