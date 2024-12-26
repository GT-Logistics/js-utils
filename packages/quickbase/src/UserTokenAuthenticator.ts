import {BeforeRequestHook} from "ky";

export default function (token: string): BeforeRequestHook {
    return async function (request): Promise<void> {
        request.headers.append('Authorization', `QB-USER-TOKEN ${token}`);
    } as BeforeRequestHook;
}
