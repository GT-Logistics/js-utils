import ky, {BeforeRequestHook} from "ky";
import {TempToken} from "./interfaces.js";

export default function (appToken: string): BeforeRequestHook {
    return async function (request, options): Promise<void> {
        const clonedRequest = request.clone(); // We can't touch the original body of the request
        const url = new URL(clonedRequest.url);
        const payload = await clonedRequest.json();
        const table = payload?.from || payload?.to || url.searchParams.get('tableId') || url.searchParams.get('appId');

        const token = await ky.get(`auth/temporary/${table}`, {
            fetch: (options as any).fetch,
            prefixUrl: options.prefixUrl,
            headers: {
                'QB-Realm-Hostname': clonedRequest.headers.get('QB-Realm-Hostname'),
                'QB-App-Token': appToken,
            },
            credentials: 'include',
        }).json<TempToken>();
        const authorization = token.temporaryAuthorization;

        request.headers.append('Authorization', `QB-TEMP-TOKEN ${authorization}`);
    } as BeforeRequestHook;
}
