import ky, {BeforeRequestHook, KyInstance} from "ky";
import UserTokenAuthenticator from "./UserTokenAuthenticator.js";
import TempTokenAuthenticator from "./TempTokenAuthenticator.js";
import {Config} from "./interfaces.js";

export default function (realm: string, configs: Config = {}): KyInstance {
    return factory(fetch, realm, configs);
}

export function factory(client: typeof fetch, realm: string, configs: Config = {}): KyInstance {
    const {token, appToken} = configs;

    if (!token && !appToken) {
        throw new Error('You must provide an App Token (to generate Temporal tokens) or a User Token');
    }

    let authenticator: BeforeRequestHook;
    if (token) {
        authenticator = UserTokenAuthenticator(token);
    }
    if (appToken) {
        authenticator = TempTokenAuthenticator(appToken);
    }

    return ky.create({
        fetch: client,
        prefixUrl: 'https://api.quickbase.com/v1/',
        headers: {
            'QB-Realm-Hostname': realm,
        },
        hooks: {
            beforeRequest: [
                authenticator,
            ],
        },
    });
}
